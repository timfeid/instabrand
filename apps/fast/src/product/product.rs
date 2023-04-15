use std::vec;

use rspc::{selection, Type};
use serde::Serialize;

use crate::{
    image::image::Image,
    order::order::order_with_relations,
    prisma,
    variant::variant::{
        variant_with_relations::{self, Data as VariantWithRelations},
        Variant,
    },
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

impl From<variant_with_relations::product::Data> for Product {
    fn from(value: variant_with_relations::product::Data) -> Self {
        let p: ProductWithRelations = value.into();
        p.into()
    }
}

impl From<variant_with_relations::product::Data> for product_with_relations::Data {
    fn from(value: variant_with_relations::product::Data) -> Self {
        let mut images: Vec<product_with_relations::images::Data> = Vec::new();

        for image in value.images {
            images.push(product_with_relations::images::Data {
                url: image.url,
                image: image.image,
            });
        }

        return product_with_relations::Data {
            id: value.id,
            name: value.name,
            description: value.description,
            slug: value.slug,
            brand_id: value.brand_id,
            created_at: value.created_at,
            updated_at: value.updated_at,
            deleted_at: value.deleted_at,
            images,
            variants: vec![],
        };
    }
}

impl Into<variant_with_relations::product::Data> for prisma::product::Data {
    fn into(self) -> variant_with_relations::product::Data {
        let mut images: Vec<variant_with_relations::product::images::Data> = Vec::new();

        self.images.into_iter().for_each(|image| {
            for image in image {
                if let Some(image) = image.image {
                    images.push(variant_with_relations::product::images::Data {
                        url: image.url.clone(),
                        image: prisma::image::Data {
                            url: image.url,
                            url_2_x: image.url_2_x,
                            url_desktop: image.url_desktop,
                            url_desktop_2_x: image.url_desktop_2_x,
                            url_mobile: image.url_mobile,
                            url_mobile_2_x: image.url_mobile_2_x,
                            url_tablet: image.url_tablet,
                            url_tablet_2_x: image.url_tablet_2_x,
                            image_product: None,
                            variant_image: None,
                        },
                    });
                }
            }
        });

        variant_with_relations::product::Data {
            id: self.id,
            name: self.name,
            slug: self.slug,
            brand_id: self.brand_id,
            created_at: self.created_at,
            description: self.description,
            updated_at: self.updated_at,
            deleted_at: self.deleted_at,
            images,
            variants: vec![],
        }
    }
}

impl Into<variant_with_relations::product::Data>
    for order_with_relations::line_items::variant::product::Data
{
    fn into(self) -> variant_with_relations::product::Data {
        let mut images: Vec<variant_with_relations::product::images::Data> = Vec::new();

        for image in self.images {
            images.push(variant_with_relations::product::images::Data {
                url: image.url,
                image: image.image,
            });
        }

        variant_with_relations::product::Data {
            id: self.id,
            name: self.name,
            slug: self.slug,
            brand_id: self.brand_id,
            created_at: self.created_at,
            description: self.description,
            updated_at: self.updated_at,
            deleted_at: self.deleted_at,
            images,
            variants: vec![],
        }
    }
}

impl Into<prisma::image::Data> for product_with_relations::images::Data {
    fn into(self) -> prisma::image::Data {
        prisma::image::Data {
            ..self.image.clone()
        }
    }
}

impl Into<prisma::image::Data> for variant_with_relations::images::Data {
    fn into(self) -> prisma::image::Data {
        prisma::image::Data {
            ..self.image.clone()
        }
    }
}

impl Into<prisma::image::Data> for product_with_relations::variants::images::Data {
    fn into(self) -> prisma::image::Data {
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
            product: value.product.into(),
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
        let images = Image::extract_images(self.images, &self.name);

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
            return Some(Image::from_data(image.clone().into(), "alt".into()));
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
