use axum::handler::Layered;
use rspc::{internal::LayerResult, selection, ErrorCode, RequestLayer, Router};

use crate::{
    api::Ctx,
    order::order::{CreateOrder, Order},
    prisma::OrderStatus,
    variant::variant::{Variant, VariantWithTypes},
};

use rspc::Error;

use super::cart::{Cart, SetCart};

pub fn create_cart_router() -> rspc::RouterBuilder<Ctx> {
    <Router<Ctx>>::new().mutation("set", |t| {
        t(|ctx, details: SetCart| async move {
            match Order::create(
                ctx.db,
                CreateOrder {
                    status: OrderStatus::Cart,
                    customer_id: None,
                    brand_id: details.brand_id,
                    line_items: details.line_items,
                },
            )
            .await
            {
                Some(order) => Ok(Cart { order: order.order }),
                _ => Err(Error::new(
                    ErrorCode::BadRequest,
                    "Please try again with different parameters".into(),
                )),
            }
        })
    })
}
