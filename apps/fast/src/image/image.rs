use rspc::Type;
use serde::Serialize;

use crate::{
    prisma::{self, image},
    product::product::PictureSource,
};

pub trait AsImage {
    fn as_image(&self) -> prisma::image::Data;
}

#[derive(Type, Serialize, Debug, Clone, PartialEq, Eq)]
pub struct Image {
    pub picture_sources: Vec<PictureSource>,
    pub src: String,
    pub srcset: String,
    pub alt: String,
}

impl Image {
    pub fn from_data(image: image::Data, alt: String) -> Image {
        Image {
            picture_sources: vec![
                PictureSource {
                    media: "(min-width: 1367px)".into(),
                    srcset: format!("{}, {} 2x", image.url_desktop, image.url_desktop_2_x),
                },
                PictureSource {
                    media: "(min-width: 768px)".into(),
                    srcset: format!("{}, {} 2x", image.url_tablet, image.url_tablet_2_x),
                },
                PictureSource {
                    media: "(min-width: 480px)".into(),
                    srcset: format!("{}, {} 2x", image.url_mobile, image.url_mobile_2_x),
                },
            ],
            src: image.url.to_owned(),
            srcset: format!("{}\n{} 2x", image.url, image.url_2_x),
            alt,
        }
    }

    pub fn extract_images<T>(images: &Vec<T>, alt: &String) -> Vec<Image>
    where
        T: Into<image::Data>,
        T: Copy,
    {
        let mut i: Vec<Image> = Vec::new();

        for image in images {
            i.push(Image::from_data(
                Into::<image::Data>::into(*image),
                alt.clone(),
            ))
        }

        i
    }
}
