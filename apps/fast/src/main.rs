use crate::api::Ctx;
use axum::{
    http::{
        header::{AUTHORIZATION, CONTENT_TYPE},
        HeaderValue, Method,
    },
    routing::get,
};
use axum_sessions::{
    async_session::{MemoryStore, Session},
    extractors::WritableSession,
    PersistencePolicy, SessionHandle, SessionLayer,
};
use prisma::PrismaClient;
use prisma_client_rust::chrono::format;
use rand::Rng;
use rspc::integrations::httpz::{Request, TCtxFunc};
use std::{net::SocketAddr, sync::Arc};
use stripe::{
    CheckoutSession, CheckoutSessionMode, Client, CreateCheckoutSession,
    CreateCheckoutSessionLineItems, CreateCustomer, CreatePrice, CreateProduct, Currency, Customer,
    Expandable, IdOrCreate, Price, Product,
};
use tokio::sync::RwLock;
use tower_cookies::{CookieManagerLayer, Cookies};
use tower_http::cors::{Any, CorsLayer};

mod api;
mod cart;
mod image;
mod order;
mod prisma;
mod product;
mod state;
mod utils;
mod variant;

fn router(db: Arc<PrismaClient>) -> axum::Router {
    dotenv::dotenv().unwrap();
    let router = api::new().build().arced();
    let stripe = Arc::new(Client::new(dotenv::var("STRIPE_SECRET").unwrap()));

    let store = MemoryStore::new();
    let secret: [u8; 64] = {
        let left: [u8; 32] = rand::thread_rng().gen();
        let right: [u8; 32] = rand::thread_rng().gen();
        let mut whole: [u8; 64] = [0; 64];
        let (one, two) = whole.split_at_mut(left.len());
        one.copy_from_slice(&left);
        two.copy_from_slice(&right);

        whole
    };
    let cookie_domain = dotenv::var("COOKIE_DOMAIN").unwrap_or("localhost".into());
    let session_layer = SessionLayer::new(store, &secret)
        .with_http_only(true)
        .with_cookie_domain(cookie_domain);

    let allowed_origins = ["http://localhost:5173".parse::<HeaderValue>().unwrap()];
    let allowed_headers = [AUTHORIZATION, CONTENT_TYPE];
    let allowed_methods = [Method::GET, Method::POST, Method::OPTIONS];

    axum::Router::new()
        .route("/", get(|| async { "Welcome to your new rspc app!" }))
        .route("/health", get(|| async { "Ok!" }))
        .nest(
            "/rspc/:id",
            router
                .endpoint(|req: Request| {
                    let session_handle =
                        req.extensions().get::<SessionHandle>().unwrap().to_owned();

                    Ctx {
                        session_handle,
                        db,
                        stripe,
                    }
                })
                .axum(),
        )
        .layer(CookieManagerLayer::new())
        .layer(
            CorsLayer::new()
                .allow_methods(allowed_methods)
                .allow_headers(allowed_headers)
                .allow_origin(allowed_origins)
                .allow_credentials(true),
        )
        .layer(session_layer)
}

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();

    let client = Arc::new(prisma::new_client().await.unwrap());
    let addr = "[::]:9000".parse::<SocketAddr>().unwrap(); // This listens on IPv6 and IPv4
    println!("{} listening on http://{}", env!("CARGO_CRATE_NAME"), addr);
    axum::Server::bind(&addr)
        .serve(router(client).into_make_service())
        .with_graceful_shutdown(utils::axum_shutdown_signal())
        .await
        .expect("Error with HTTP server!");
}
