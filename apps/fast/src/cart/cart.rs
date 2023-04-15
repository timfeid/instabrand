use std::sync::Arc;

use serde::{Deserialize, Serialize};

use crate::{
    order::order::{CreateOrder, CreateOrderLineItem, Order, UpdateOrder},
    prisma::{OrderStatus, PrismaClient},
};
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

#[derive(Type, Deserialize, Debug, Serialize)]
pub struct SessionCart {
    pub line_items: Vec<CreateOrderLineItem>,
    pub id: String,
}

impl Cart {
    pub async fn create(db: Arc<PrismaClient>, details: SetCart) -> Option<Self> {
        if let Some(order) = Order::create(
            db,
            CreateOrder {
                status: OrderStatus::Cart,
                customer_id: None,
                brand_id: details.brand_id,
                line_items: details.line_items,
            },
        )
        .await
        {
            return Some(Cart { order: order.order });
        }
        None
    }

    pub async fn update(db: Arc<PrismaClient>, id: String, details: SetCart) -> Option<Self> {
        if let Some(mut order) = Order::find_by_id(db, id, None).await {
            order
                .update(UpdateOrder {
                    status: None,
                    line_items: Some(details.line_items),
                    customer_id: None,
                })
                .await;

            return Some(Cart { order: order.order });
        }

        None
    }

    pub async fn find_by_id(db: Arc<PrismaClient>, id: String) -> Option<Self> {
        if let Some(order) = Order::find_by_id(db, id, Some(OrderStatus::Cart)).await {
            return Some(Cart { order: order.order });
        }

        None
    }
}
