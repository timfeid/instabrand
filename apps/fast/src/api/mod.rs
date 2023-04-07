use std::{path::PathBuf, sync::Arc};

use rspc::Config;
pub use rspc::RouterBuilder;

use crate::{prisma, product::router::create_products_router};

#[derive(Clone)]
pub struct Ctx {
    pub db: Arc<prisma::PrismaClient>,
}

pub type Router = rspc::Router<Ctx>;

pub(crate) fn new() -> RouterBuilder<Ctx> {
    let products_router = create_products_router();

    Router::new()
        .config(
            Config::new()
                // Doing this will automatically export the bindings when the `build` function is called.
                .export_ts_bindings(
                    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
                        .join("../fast-frontend/src/lib/bindings.ts"),
                ),
        )
        .query("anotherVersion", |t| {
            t(|_, _: ()| env!("CARGO_PKG_VERSION"))
        })
        .query("version", |t| t(|_, _: ()| env!("CARGO_PKG_VERSION")))
        .merge("products.", products_router)
}
