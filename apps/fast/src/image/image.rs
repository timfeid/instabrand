use rspc::Type;
use serde::Serialize;

use crate::{
    prisma::{self, image},
    product::product::PictureSource,
};

pub trait AsImage {
    fn as_image(&self) -> prisma::image::Data;
}

#[derive(Type, Serialize)]
pub struct Image {
    pub picture_sources: Vec<PictureSource>,
    pub src: String,
    pub srcset: String,
    pub alt: String,
}

impl Image {
    pub fn from_data(image: &image::Data, alt: String) -> Image {
        Image {
            picture_sources: vec![PictureSource {
                media: "(min-width: 1367px)".into(),
                srcset: format!("{}, {} 2x", image.url_desktop, image.url_desktop_2_x),
            }],
            src: image.url.to_owned(),
            srcset: format!("{}\n{} 2x", image.url, image.url_2_x),
            alt,
        }
    }

    pub fn extract_images<T: AsImage>(images: &Vec<T>) -> Vec<Image> {
        images
            .iter()
            .map(|i| Image::from_data(&i.as_image(), "alt".into()))
            .collect()
    }
}
