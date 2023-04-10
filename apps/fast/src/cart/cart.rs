use serde::{Deserialize, Serialize};

use crate::order::order::{CreateOrderLineItem, Order};
use rspc::Type;

#[derive(Type, Deserialize)]
pub struct SetCart {
    pub brand_id: String,
    pub line_items: Vec<CreateOrderLineItem>,
}

#[derive(Type, Serialize)]
pub struct Cart {
    pub order: Order,
}
