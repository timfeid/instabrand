use rspc::{selection, Type};
use serde::Serialize;

use crate::{
    image::image::{AsImage, Image},
    prisma,
    variant::variant::{variant_with_relations, Variant},
};

use super::service::product_with_relations;

#[derive(Type, Serialize)]
pub struct PictureSource {
    pub media: String,
    pub srcset: String,
}

#[derive(Type, Serialize)]
pub struct ProductPrice {
    pub actual: String,
    pub compare_at: Option<String>,
}

#[derive(Type, Serialize)]
pub enum ProductAvailability {
    InStock,
    Limited,
    SoldOut,
    PreOrder,
}

#[derive(Type, Serialize)]
pub struct Product {
    pub id: String,
    pub name: String,
    pub slug: String,
    pub price: ProductPrice,
    pub description: String,
    pub primary_image: Option<Image>,
    pub secondary_image: Option<Image>,
    pub images: Vec<Image>,
    pub availability: ProductAvailability,
    pub label: Option<String>,
    pub variants: Vec<Variant>,
}

impl AsImage for product_with_relations::images::Data {
    fn as_image(&self) -> prisma::image::Data {
        prisma::image::Data {
            ..self.image.clone()
        }
    }
}

impl AsImage for product_with_relations::variants::images::Data {
    fn as_image(&self) -> prisma::image::Data {
        prisma::image::Data {
            ..self.image.clone()
        }
    }
}

impl From<product_with_relations::variants::Data> for variant_with_relations::Data {
    fn from(value: product_with_relations::variants::Data) -> Self {
        variant_with_relations::Data {
            id: value.id.clone(),
            product_id: value.product_id.clone(),
            slug: value.slug.clone(),
            size: value.size.clone(),
            sku: value.sku.clone(),
            style: value.style.clone(),
            color: value.color.clone(),
            material: value.material.clone(),
            price_in_cents: value.price_in_cents,
            compare_at_price_in_cents: value.compare_at_price_in_cents,
            created_at: value.created_at,
            updated_at: value.updated_at,
            deleted_at: value.deleted_at,
            cost_in_cents: value.cost_in_cents,
            images: vec![],
        }
    }
}

impl Product {
    fn find_image_at(product: &product_with_relations::Data, index: usize) -> Option<Image> {
        if let Some(image) = product.images.get(index) {
            return Some(Image::from_data(&image.as_image(), "alt".into()));
        }

        None
    }

    pub fn from(product: product_with_relations::Data) -> Self {
        let price = ProductPrice {
            actual: "$1".into(),
            compare_at: None,
        };

        let primary_image = Product::find_image_at(&product, 0);
        let secondary_image = Product::find_image_at(&product, 1);
        let images = Image::extract_images(&product.images);

        Product {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price,
            description: product.description,
            primary_image,
            secondary_image,
            images,
            availability: ProductAvailability::InStock,
            label: None,
            variants: product
                .variants
                .iter()
                .map(|v| Variant::from_data(Into::<variant_with_relations::Data>::into(v.clone())))
                .collect(),
        }
    }
}
