use rspc::Type;
use serde::Serialize;
use std::collections::HashSet;

use crate::{
    image::image::Image,
    prisma::{
        self,
        variant::{self},
    },
    product::product::{Product, ProductAvailability, ProductPrice},
};

variant::include!(variant_with_relations {
    images: select { url image }
    product: include {
        images: select {
            url image
        }
        variants: include {
            images: select {
                url image
            }
        }
    }
});

type VariantWithRelations = variant_with_relations::Data;

impl VariantWithRelations {
    fn find_image_at(&self, index: usize) -> Option<Image> {
        if let Some(image) = &self.images.get(index) {
            let image = *image;
            return Some(Image::from_data(
                Into::<prisma::image::Data>::into(image.clone()),
                "alt".into(),
            ));
        }

        None
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Type)]
pub struct VariantWithType {
    id: String,
    value: String,
    slug: String,
    selected: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Type)]
pub struct ProductListType {
    name: String,
    variants: Vec<VariantWithType>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Type)]
pub struct VariantWithTypes {
    variant: Variant,
    types: Vec<ProductListType>,
    product: Product,
}

fn get_filter_types(type_names: &[String], current_type: &str) -> Vec<String> {
    type_names
        .iter()
        .filter(|type_| *type_ != current_type)
        .cloned()
        .collect()
}

fn get_variants(
    product_variants: &[Variant],
    filter_by_type: &impl Fn(&Variant, &[String], &str) -> bool,
    type_name: &str,
    selected_variant_slug: &str,
    filter_types: &[String],
) -> Vec<VariantWithType> {
    let mut unique_variants: HashSet<String> = HashSet::new();
    let mut variant_list: Vec<VariantWithType> = Vec::new();

    for variant in product_variants.iter().filter(|variant| {
        filter_by_type(
            variant,
            &get_filter_types(&filter_types, &type_name),
            &type_name,
        )
    }) {
        if let Some(value) = match &*type_name {
            "color" => variant.color.clone(),
            "size" => variant.size.clone(),
            "material" => variant.material.clone(),
            "style" => variant.style.clone(),
            _ => None,
        } {
            if !unique_variants.contains(&value) {
                unique_variants.insert(value.clone());
                variant_list.push(VariantWithType {
                    id: variant.id.clone(),
                    value,
                    slug: variant.slug.clone(),
                    selected: variant.slug == selected_variant_slug,
                });
            }
        }
    }

    variant_list
}

impl VariantWithTypes {
    pub async fn get<T>(
        selected_variant_slug: Option<String>,
        type_names: Vec<String>,
        data: T,
    ) -> VariantWithTypes
    where
        T: Into<Product>,
    {
        let product: Product = data.into();
        let selected_variant_slug = match selected_variant_slug {
            Some(slug) => slug,
            None => product.variants[0].slug.clone(),
        };

        let selected_variant = product
            .variants
            .iter()
            .find(|variant| variant.slug == selected_variant_slug)
            .cloned()
            .unwrap_or_else(|| product.variants[0].clone());

        let filter_by_type = |variant: &Variant, filter_types: &[String], current_type: &str| {
            filter_types.iter().all(|type_name| {
                type_name == current_type
                    || (type_name == "color" && variant.color == selected_variant.color)
                    || (type_name == "size" && variant.size == selected_variant.size)
                    || (type_name == "material" && variant.material == selected_variant.material)
                    || (type_name == "style" && variant.style == selected_variant.style)
            })
        };

        let types: Vec<ProductListType> = type_names
            .clone()
            .into_iter()
            .filter_map(|type_name| {
                let variants = get_variants(
                    &product.variants,
                    &filter_by_type,
                    &type_name,
                    &selected_variant_slug,
                    &type_names,
                );

                if variants.is_empty() {
                    None
                } else {
                    Some(ProductListType {
                        name: type_name,
                        variants,
                    })
                }
            })
            .collect();

        VariantWithTypes {
            variant: selected_variant,
            types,
            product,
        }
    }
}

#[derive(Type, Serialize, Debug, Clone, PartialEq, Eq, Default)]
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
    pub product: Product,
}

impl Variant {
    pub fn get_product_price(
        price_in_cents: i32,
        compare_at_price_in_cents: Option<i32>,
    ) -> ProductPrice {
        ProductPrice {
            actual: format!("${}", price_in_cents / 100),
            compare_at: if let Some(price) = compare_at_price_in_cents {
                Some(format!("${}", price / 100))
            } else {
                None
            },
        }
    }

    pub fn from_data<T>(from: T, product_name: &String) -> Variant
    where
        T: Into<VariantWithRelations>,
    {
        let data: VariantWithRelations = from.into();
        let price = Variant::get_product_price(data.price_in_cents, data.compare_at_price_in_cents);

        let images = Image::extract_images(&data.images.clone(), product_name);
        let mut image = data.find_image_at(0);

        let product: Product = data.product.into();

        if image.is_none() {
            image = product.primary_image.clone();
        }

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
            product,
        }
    }
}

mod tests {
    use crate::product::product::Product;

    #[tokio::test]
    async fn test_get_variant_with_types_0() {
        use crate::variant::variant::{
            ProductListType, Variant, VariantWithType, VariantWithTypes,
        };

        let shirt_xl_black = Variant {
            id: "shirtXLBlack".to_string(),
            slug: "shirtXLBlack".to_string(),
            size: Some("XL".to_string()),
            color: Some("Black".to_string()),
            ..Variant::default()
        };

        let shirt_md_black = Variant {
            id: "shirtMDBlack".to_string(),
            slug: "shirtMDBlack".to_string(),
            size: Some("MD".to_string()),
            color: Some("Black".to_string()),
            ..Variant::default()
        };

        let shirt_lg_black = Variant {
            id: "shirtLGBlack".to_string(),
            slug: "shirtLGBlack".to_string(),
            size: Some("LG".to_string()),
            color: Some("Black".to_string()),
            ..Variant::default()
        };

        let shirt_xl = Variant {
            id: "shirtXLBlack".to_string(),
            slug: "shirtXLBlack".to_string(),
            size: Some("XL".to_string()),
            color: None,
            ..Variant::default()
        };

        let mut product = Product::default();
        product.variants = vec![
            shirt_xl.clone(),
            Variant {
                color: None,
                ..shirt_md_black.clone()
            },
            Variant {
                color: None,
                ..shirt_lg_black.clone()
            },
        ];

        let response = VariantWithTypes::get(
            Some(shirt_xl_black.slug.clone()),
            vec![
                "size".to_string(),
                "color".to_string(),
                "material".to_string(),
                "style".to_string(),
            ],
            product.clone(),
        )
        .await;

        let expected_response = VariantWithTypes {
            variant: shirt_xl,
            types: vec![ProductListType {
                name: "size".to_string(),
                variants: vec![
                    VariantWithType {
                        id: shirt_xl_black.id.clone(),
                        slug: shirt_xl_black.slug.clone(),
                        value: "XL".to_string(),
                        selected: true,
                    },
                    VariantWithType {
                        id: shirt_md_black.id.clone(),
                        slug: shirt_md_black.slug.clone(),
                        value: "MD".to_string(),
                        selected: false,
                    },
                    VariantWithType {
                        id: shirt_lg_black.id.clone(),
                        slug: shirt_lg_black.slug.clone(),
                        value: "LG".to_string(),
                        selected: false,
                    },
                ],
            }],
            product,
        };

        assert_eq!(response, expected_response);
    }

    #[tokio::test]
    async fn test_get_variant_with_types_1() {
        use crate::variant::variant::{
            ProductListType, Variant, VariantWithType, VariantWithTypes,
        };

        let shirt_xl_green = Variant {
            id: "shirtXLGreen".to_string(),
            slug: "shirtXLGreen".to_string(),
            size: Some("XL".to_string()),
            color: Some("Green".to_string()),
            ..Variant::default()
        };

        let shirt_md_green = Variant {
            id: "shirtMDGreen".to_string(),
            slug: "shirtMDGreen".to_string(),
            size: Some("MD".to_string()),
            color: Some("Green".to_string()),
            ..Variant::default()
        };

        let shirt_lg_green = Variant {
            id: "shirtLGGreen".to_string(),
            slug: "shirtLGGreen".to_string(),
            size: Some("LG".to_string()),
            color: Some("Green".to_string()),
            ..Variant::default()
        };

        let shirt_xl_black = Variant {
            id: "shirtXLBlack".to_string(),
            slug: "shirtXLBlack".to_string(),
            size: Some("XL".to_string()),
            color: Some("Black".to_string()),
            ..Variant::default()
        };

        let shirt_md_black = Variant {
            id: "shirtMDBlack".to_string(),
            slug: "shirtMDBlack".to_string(),
            size: Some("MD".to_string()),
            color: Some("Black".to_string()),
            ..Variant::default()
        };

        let shirt_lg_black = Variant {
            id: "shirtLGBlack".to_string(),
            slug: "shirtLGBlack".to_string(),
            size: Some("LG".to_string()),
            color: Some("Black".to_string()),
            ..Variant::default()
        };

        let mut product = Product::default();
        product.variants = vec![
            shirt_xl_black.clone(),
            shirt_md_black.clone(),
            shirt_lg_black.clone(),
            shirt_xl_green.clone(),
            shirt_md_green.clone(),
            shirt_lg_green.clone(),
        ];

        let response = VariantWithTypes::get(
            Some(shirt_xl_black.slug.clone()),
            vec![
                "size".to_string(),
                "color".to_string(),
                "material".to_string(),
                "style".to_string(),
            ],
            product.clone(),
        )
        .await;

        let expected_response = VariantWithTypes {
            variant: shirt_xl_black.clone(),
            types: vec![
                ProductListType {
                    name: "size".to_string(),
                    variants: vec![
                        VariantWithType {
                            id: shirt_xl_black.id.clone(),
                            slug: shirt_xl_black.slug.clone(),
                            value: "XL".to_string(),
                            selected: true,
                        },
                        VariantWithType {
                            id: shirt_md_black.id.clone(),
                            slug: shirt_md_black.slug.clone(),
                            value: "MD".to_string(),
                            selected: false,
                        },
                        VariantWithType {
                            id: shirt_lg_black.id.clone(),
                            slug: shirt_lg_black.slug.clone(),
                            value: "LG".to_string(),
                            selected: false,
                        },
                    ],
                },
                ProductListType {
                    name: "color".to_string(),
                    variants: vec![
                        VariantWithType {
                            id: shirt_xl_black.id.clone(),
                            slug: shirt_xl_black.slug.clone(),
                            value: "Black".to_string(),
                            selected: true,
                        },
                        VariantWithType {
                            id: shirt_xl_green.id.clone(),
                            slug: shirt_xl_green.slug.clone(),
                            value: "Green".to_string(),
                            selected: false,
                        },
                    ],
                },
            ],
            product,
        };
        assert_eq!(response, expected_response);
    }
}
