use axum::handler::Layered;
use rspc::{
    integrations::httpz::CookieJar, internal::LayerResult, selection, ErrorCode, RequestLayer,
    Router, Type,
};
use serde::{Deserialize, Serialize};
use tower_cookies::Cookie;

use crate::{
    api::Ctx,
    cart::cart::SessionCart,
    order::order::{CreateOrder, CreateOrderLineItem, Order},
    prisma::OrderStatus,
    variant::variant::{Variant, VariantWithTypes},
};

use rspc::Error;

use super::cart::{Cart, SetCart};

#[derive(Type, Default, Deserialize, Debug, Serialize)]
struct IntentResponse {
    success: bool,
    error: Option<String>,
    id: Option<String>,
    secret: Option<String>,
}

pub fn create_cart_router() -> rspc::RouterBuilder<Ctx> {
    <Router<Ctx>>::new()
        .mutation("createIntent", |t| {
            t(|ctx, cart_id: String| async move {
                let mut response = IntentResponse::default();
                if let Some(mut order) =
                    Order::find_by_id(ctx.db, cart_id, Some(OrderStatus::Cart)).await
                {
                    if let Ok(intent) = order.create_payment_intent(ctx.stripe).await {
                        response.success = true;
                        response.secret = intent.client_secret;
                        response.id = Some(intent.id.to_string());
                    }
                }

                response
            })
        })
        .mutation("set", |t| {
            t(|ctx, details: SetCart| async move {
                let session_key = format!("cart-{}", details.brand_id);
                let mut session = ctx.session_handle.write().await;
                let mut cart: Option<Cart> = None;

                if let Some(session_cart) = session.get::<SessionCart>(&session_key) {
                    cart = Some(
                        Cart::update(ctx.db, session_cart.id.clone(), details)
                            .await
                            .unwrap(),
                    );
                } else {
                    cart = Cart::create(ctx.db, details).await;
                }

                if let Some(cart) = cart {
                    session
                        .insert(
                            &session_key,
                            SessionCart {
                                id: cart.order.id.clone(),
                                line_items: cart
                                    .order
                                    .line_items
                                    .iter()
                                    .map(|i| CreateOrderLineItem {
                                        variant_id: i.variant.id.clone(),
                                        quantity: i.quantity,
                                    })
                                    .collect(),
                            },
                        )
                        .unwrap();

                    return Ok(cart);
                }

                Err(Error::new(
                    ErrorCode::BadRequest,
                    "Please try again with different values or clear your cookies.".into(),
                ))
            })
        })
        .query("get", |t| {
            t(|ctx, brand_id: String| async move {
                let session_key = format!("cart-{}", brand_id);
                let session = ctx.session_handle.read().await;

                session.get::<SessionCart>(&session_key)
            })
        })
        .query("getById", |t| {
            t(|ctx, cart_id: String| async move {
                return Cart::find_by_id(ctx.db, cart_id).await;
            })
        })
}
