use crate::api::Ctx;
use axum::routing::get;
use prisma::PrismaClient;
use std::{net::SocketAddr, sync::Arc};
use tower_http::cors::{Any, CorsLayer};

mod api;
mod image;
mod prisma;
mod product;
mod utils;
mod variant;

fn router(db: Arc<PrismaClient>) -> axum::Router {
    let router = api::new().build().arced();

    axum::Router::new()
        .route("/", get(|| async { "Welcome to your new rspc app!" }))
        .route("/health", get(|| async { "Ok!" }))
        .nest("/rspc/:id", router.endpoint(|| Ctx { db }).axum())
        .layer(
            CorsLayer::new()
                .allow_methods(Any)
                .allow_headers(Any)
                .allow_origin(Any),
        )
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
