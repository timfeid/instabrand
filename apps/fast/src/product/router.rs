use axum::handler::Layered;
use rspc::{internal::LayerResult, selection, RequestLayer, Router};

use crate::api::Ctx;

use super::{product::Product, service::ProductService};
use rspc::Error;

pub fn create_products_router() -> rspc::RouterBuilder<Ctx> {
    <Router<Ctx>>::new().query("get", |t| {
        t(|ctx, slug| async move {
            let response = ProductService::find_by_slug(ctx.db, slug).await.unwrap();

            Product::from(response)
        })
    })
}
