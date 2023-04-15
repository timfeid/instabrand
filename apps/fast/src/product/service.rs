use std::sync::Arc;

use prisma_client_rust::chrono::DateTime;

use crate::prisma::{product, PrismaClient};

pub struct ProductService;

product::include!(product_with_relations {
    images: select { url image }
    variants: include { images: select { url image } product }
});

impl ProductService {
    pub async fn find_by_slug(
        db: Arc<PrismaClient>,
        slug: String,
    ) -> Option<product_with_relations::Data> {
        db.product()
            .find_first(vec![product::slug::equals(slug)])
            .include(product_with_relations::include())
            .exec()
            .await
            .unwrap()
    }

    pub async fn list(db: Arc<PrismaClient>) -> Vec<product_with_relations::Data> {
        db.product()
            .find_many(vec![product::deleted_at::equals(None)])
            .include(product_with_relations::include())
            .exec()
            .await
            .unwrap()
    }
}
