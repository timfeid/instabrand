use std::vec;

use rspc::{selection, Type};
use serde::Serialize;

use crate::{
    image::image::{AsImage, Image},
    prisma,
    variant::variant::{variant_with_relations::Data as VariantWithRelations, Variant},
};

use super::service::product_with_relations;
use super::service::product_with_relations::Data as ProductWithRelations;

#[derive(Type, Serialize, Debug, Clone, PartialEq, Eq)]
pub struct PictureSource {
    pub media: String,
    pub srcset: String,
}

#[derive(Type, Serialize, Default, Debug, Clone, PartialEq, Eq)]
pub struct ProductPrice {
    pub actual: String,
    pub compare_at: Option<String>,
}

#[derive(Type, Serialize, Debug, Clone, PartialEq, Eq)]
pub enum ProductAvailability {
    InStock,
    Limited,
    SoldOut,
    PreOrder,
}

impl Default for ProductAvailability {
    fn default() -> Self {
        Self::InStock
    }
}

#[derive(Type, Serialize, Default, Debug, Clone, Eq, PartialEq)]
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

impl From<product_with_relations::variants::Data> for VariantWithRelations {
    fn from(value: product_with_relations::variants::Data) -> Self {
        VariantWithRelations {
            id: value.id,
            product_id: value.product_id,
            slug: value.slug,
            color: value.color,
            style: value.style,
            sku: value.sku,
            size: value.size,
            material: value.material,
            price_in_cents: value.price_in_cents,
            created_at: value.created_at,
            updated_at: value.updated_at,
            deleted_at: value.deleted_at,
            cost_in_cents: value.cost_in_cents,
            compare_at_price_in_cents: value.compare_at_price_in_cents,
            images: vec![],
        }
    }
}

impl Into<Product> for ProductWithRelations {
    fn into(self) -> Product {
        let variants: Vec<Variant> = self
            .variants
            .iter()
            .map(|v| Variant::from_data(v.clone(), &self.name))
            .collect();

        let price = match self.variants.get(0) {
            Some(variant) => Variant::get_product_price(
                variant.price_in_cents,
                variant.compare_at_price_in_cents,
            ),
            _ => ProductPrice::default(),
        };

        let primary_image = Product::find_image_at(&self, 0);
        let secondary_image = Product::find_image_at(&self, 1);
        let images = Image::extract_images(&self.images, &self.name);

        Product {
            id: self.id,
            name: self.name,
            slug: self.slug,
            price,
            description: self.description,
            primary_image,
            secondary_image,
            images,
            availability: ProductAvailability::InStock,
            label: None,
            variants,
        }
    }
}

impl Product {
    fn find_image_at(product: &ProductWithRelations, index: usize) -> Option<Image> {
        if let Some(image) = product.images.get(index) {
            return Some(Image::from_data(&image.as_image(), "alt".into()));
        }

        None
    }

    pub fn from_vector(products: Vec<ProductWithRelations>) -> Vec<Self> {
        products
            .iter()
            .map(|product| product.clone().into())
            .collect()
    }
}
