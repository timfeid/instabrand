use std::sync::Arc;

use crate::prisma::{product, PrismaClient};

pub struct ProductService;

product::include!(product_with_relations {
    images: select { url image }
    variants: include { images: select { url image } }
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
}
