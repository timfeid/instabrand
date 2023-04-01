/*
  Warnings:

  - A unique constraint covering the columns `[display_order,product_id]` on the table `variants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "variants_display_order_product_id_key" ON "variants"("display_order", "product_id");
