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

pub fn create_state_router() -> rspc::RouterBuilder<Ctx> {
    <Router<Ctx>>::new().query("list", |t| {
        t(|ctx, _: ()| async move { ctx.db.state().find_many(vec![]).exec().await.unwrap() })
    })
}
