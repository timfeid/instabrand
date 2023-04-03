/*
  Warnings:

  - You are about to drop the column `userId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `order_variants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "order_variants" DROP CONSTRAINT "order_variants_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_variants" DROP CONSTRAINT "order_variants_price_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "userId",
ALTER COLUMN "customer_id" DROP NOT NULL;

-- DropTable
DROP TABLE "order_variants";

-- CreateTable
CREATE TABLE "lines_items" (
    "id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "productId" TEXT,

    CONSTRAINT "lines_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lines_items" ADD CONSTRAINT "lines_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lines_items" ADD CONSTRAINT "lines_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
