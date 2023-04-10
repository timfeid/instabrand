use axum::handler::Layered;
use rspc::{internal::LayerResult, selection, RequestLayer, Router};

use crate::{
    api::Ctx,
    variant::variant::{Variant, VariantWithTypes},
};

use super::{product::Product, service::ProductService};
use rspc::Error;

pub fn create_product_router() -> rspc::RouterBuilder<Ctx> {
    <Router<Ctx>>::new()
        .query("get", |t| {
            t(
                |ctx, (slug, variantSlug): (String, Option<String>)| async move {
                    VariantWithTypes::get(
                        variantSlug,
                        vec![
                            "size".to_string(),
                            "color".to_string(),
                            "material".to_string(),
                            "style".to_string(),
                        ],
                        ProductService::find_by_slug(ctx.db, slug).await.unwrap(),
                    )
                },
            )
        })
        .query("list", |t| {
            t(|ctx, _: ()| async move {
                let response = ProductService::list(ctx.db).await;

                Product::from_vector(response)
            })
        })
}
