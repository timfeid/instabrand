use axum::handler::Layered;
use rspc::{
    integrations::httpz::CookieJar, internal::LayerResult, selection, ErrorCode, RequestLayer,
    Router,
};
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

pub fn create_cart_router() -> rspc::RouterBuilder<Ctx> {
    <Router<Ctx>>::new()
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
}
