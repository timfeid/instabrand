/*
  Warnings:

  - You are about to drop the column `is_default` on the `variants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug,product_id]` on the table `variants` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "variants_is_default_product_id_key";

-- AlterTable
ALTER TABLE "variants" DROP COLUMN "is_default",
ADD COLUMN     "display_order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "variants_slug_product_id_key" ON "variants"("slug", "product_id");
