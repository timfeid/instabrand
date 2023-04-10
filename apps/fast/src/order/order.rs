use prisma_client_rust::QueryError;
use std::sync::Arc;
use ulid::Ulid;

use crate::{
    prisma::{self, OrderStatus, PrismaClient},
    product::service::product_with_relations,
    variant::variant::{variant_with_relations, Variant},
};
use rspc::Type;
use serde::{Deserialize, Serialize};

#[derive(Type, Serialize, Debug, Clone, PartialEq, Eq, Default)]
pub struct LineItem {
    variant: Variant,
    quantity: i32, // prob doesn't need to be i32?
}

#[derive(Type, Serialize, Debug, Clone, PartialEq, Eq, Default)]
pub struct Order {
    pub id: String,
    pub line_items: Vec<LineItem>,
    pub subtotal: String,
}

pub struct OrderWithDatabase {
    pub order: Order,
    pub db: Arc<PrismaClient>,
}

prisma::order::include!(order_with_relations {
    line_items: include {
        variant: include {
            product: include {
                images: include { image }
            }
        }
    }
});

impl From<order_with_relations::line_items::variant::Data> for variant_with_relations::Data {
    fn from(value: order_with_relations::line_items::variant::Data) -> Self {
        variant_with_relations::Data {
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

impl From<order_with_relations::Data> for Order {
    fn from(value: order_with_relations::Data) -> Self {
        let mut subtotal = 0;
        let mut line_items: Vec<LineItem> = vec![];

        for item in value.line_items {
            let name = item.variant.product.name.clone();
            subtotal = subtotal + (&item.variant.price_in_cents * &item.quantity);
            line_items.push(LineItem {
                quantity: item.quantity,
                variant: Variant::from_data(item.variant, &name),
            });
        }

        Order {
            id: value.id,
            line_items,
            subtotal: subtotal.to_string(),
        }
    }
}

#[derive(Type, Deserialize)]
pub struct CreateOrderLineItem {
    variant_id: String,
    quantity: i32,
}

#[derive(Type, Deserialize)]
pub struct CreateOrder {
    pub brand_id: String,
    pub status: OrderStatus,
    pub line_items: Vec<CreateOrderLineItem>,
    pub customer_id: Option<String>,
}

#[derive(Type, Deserialize)]
pub struct UpdateOrder {
    pub status: Option<OrderStatus>,
    pub line_items: Option<Vec<CreateOrderLineItem>>,
    pub customer_id: Option<String>,
}

impl Order {
    pub async fn find_by_id(db: Arc<PrismaClient>, id: String) -> Option<OrderWithDatabase> {
        if let Some(data) = db
            .order()
            .find_unique(prisma::order::id::equals(id))
            .include(order_with_relations::include())
            .exec()
            .await
            .unwrap()
        {
            return Some(OrderWithDatabase {
                db,
                order: Into::<Order>::into(data),
            });
        }

        None
    }

    pub async fn create(db: Arc<PrismaClient>, details: CreateOrder) -> Option<OrderWithDatabase> {
        if let Ok(data) = db
            .order()
            .create(
                Ulid::new().to_string(),
                1,
                details.status,
                prisma::brand::id::equals(details.brand_id),
                vec![],
            )
            .include(order_with_relations::include())
            .exec()
            .await
        {
            let mut order_with_database = OrderWithDatabase {
                db,
                order: Into::into(data),
            };

            order_with_database
                .sync_line_items(details.line_items)
                .await;

            return Some(order_with_database);
        }

        None
    }
}

impl OrderWithDatabase {
    pub async fn update(&mut self, details: UpdateOrder) -> (&mut Self, bool) {
        let mut updates = vec![prisma::order::customer_id::set(details.customer_id)];
        let mut updated = false;

        if let Some(status) = details.status {
            updates.push(prisma::order::status::set(status))
        }

        match self
            .db
            .order()
            .update(prisma::order::id::equals(self.order.id.clone()), updates)
            .include(order_with_relations::include())
            .exec()
            .await
        {
            Ok(data) => {
                self.order = Into::into(data);
                updated = true;
            }
            _ => (),
        }

        if updated {
            if let Some(line_items) = details.line_items {
                self.sync_line_items(line_items).await;
            }
        }

        (self, updated)
    }

    async fn sync_line_items(&mut self, line_items: Vec<CreateOrderLineItem>) -> &mut Self {
        let order_id = self.order.id.clone();
        let db = &self.db;

        db.line_item()
            .delete_many(vec![prisma::line_item::order_id::equals(order_id.clone())])
            .exec()
            .await
            .unwrap();

        let line_items_data = line_items
            .iter()
            .map(|i| {
                prisma::line_item::create_unchecked(
                    Ulid::new().to_string(),
                    i.variant_id.clone(),
                    order_id.clone(),
                    i.quantity,
                    vec![],
                )
            })
            .collect();

        db.line_item()
            .create_many(line_items_data)
            .exec()
            .await
            .unwrap();

        self.refresh_order().await;

        self
    }

    async fn refresh_order(&mut self) {
        if let Some(order) = Order::find_by_id(self.db.clone(), self.order.id.clone()).await {
            self.order = order.order;
        }
    }
}
