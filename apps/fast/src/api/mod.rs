use std::{path::PathBuf, sync::Arc};

use rspc::Config;
pub use rspc::RouterBuilder;

use crate::{cart::router::create_cart_router, prisma, product::router::create_product_router};

#[derive(Clone)]
pub struct Ctx {
    pub db: Arc<prisma::PrismaClient>,
}

pub type Router = rspc::Router<Ctx>;

pub(crate) fn new() -> RouterBuilder<Ctx> {
    let product_router = create_product_router();
    let cart_router = create_cart_router();

    Router::new()
        .config(
            Config::new()
                // Doing this will automatically export the bindings when the `build` function is called.
                .export_ts_bindings(
                    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../store/src/lib/bindings.ts"),
                ),
        )
        .query("anotherVersion", |t| {
            t(|_, _: ()| env!("CARGO_PKG_VERSION"))
        })
        .query("version", |t| t(|_, _: ()| env!("CARGO_PKG_VERSION")))
        .merge("products.", product_router)
        .merge("cart.", cart_router)
}
