/*
  Warnings:

  - Added the required column `brand_id` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "customers" DROP CONSTRAINT "customers_user_id_fkey";

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "brand_id" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "customerId" TEXT;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
