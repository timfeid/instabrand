use rspc::Type;
use serde::{Deserialize, Serialize};

use crate::{
    image::image::{AsImage, Image},
    prisma::{self, variant},
    product::product::{ProductAvailability, ProductPrice},
};

variant::include!(variant_with_relations {
    images: select { url image }
});

impl AsImage for variant_with_relations::images::Data {
    fn as_image(&self) -> prisma::image::Data {
        prisma::image::Data {
            ..self.image.clone()
        }
    }
}

impl variant_with_relations::Data {
    fn find_image_at(&self, index: usize) -> Option<Image> {
        if let Some(image) = &self.images.get(index) {
            return Some(Image::from_data(&image.as_image(), "alt".into()));
        }

        None
    }
}

#[derive(Type, Serialize)]
pub struct Variant {
    pub id: String,
    pub slug: String,
    pub price: ProductPrice,
    pub availability: ProductAvailability,
    pub images: Vec<Image>,
    pub image: Option<Image>,
    pub size: Option<String>,
    pub color: Option<String>,
    pub material: Option<String>,
    pub style: Option<String>,
}

impl Variant {
    pub fn from_data(data: variant_with_relations::Data) -> Variant {
        let price = ProductPrice {
            actual: format!("${}", data.price_in_cents / 100),
            compare_at: if let Some(price) = data.compare_at_price_in_cents {
                Some(format!("${}", price / 100))
            } else {
                None
            },
        };

        let images = Image::extract_images(&data.images);
        let image = data.find_image_at(0);

        Variant {
            id: data.id,
            slug: data.slug,
            price,
            images,
            availability: ProductAvailability::InStock,
            image,
            size: data.size,
            color: data.color,
            material: data.material,
            style: data.style,
        }
    }
}
