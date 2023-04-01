/*
  Warnings:

  - You are about to drop the column `display_order` on the `variants` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "variants_display_order_product_id_key";

-- AlterTable
ALTER TABLE "variants" DROP COLUMN "display_order";
