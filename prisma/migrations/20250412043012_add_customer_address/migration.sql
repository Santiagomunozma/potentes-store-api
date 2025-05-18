/*
  Warnings:

  - Added the required column `address` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product_sells" DROP CONSTRAINT "product_sells_sell_id_fkey";

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "address" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "product_sells" ADD CONSTRAINT "product_sells_sell_id_fkey" FOREIGN KEY ("sell_id") REFERENCES "sells"("id") ON DELETE CASCADE ON UPDATE CASCADE;
