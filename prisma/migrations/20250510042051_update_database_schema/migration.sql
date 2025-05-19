/*
  Warnings:

  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Added the required column `updated_at` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color_id` to the `product_sells` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size_id` to the `product_sells` table without a default value. This is not possible if the table is not empty.

*/

-- Primero creamos las tablas nuevas
CREATE TABLE "sizes" (
    "id" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "sizes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "colors" (
    "id" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "colors_pkey" PRIMARY KEY ("id")
);

-- Insertamos un tamaño y color por defecto
INSERT INTO "sizes" ("id", "size", "created_at", "updated_at")
VALUES ('default_size', 'Default', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "colors" ("id", "color", "created_at", "updated_at")
VALUES ('default_color', 'Default', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Agregamos las columnas a coupons
ALTER TABLE "coupons" 
ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Agregamos las columnas a product_sells
ALTER TABLE "product_sells" 
ADD COLUMN IF NOT EXISTS "color_id" TEXT NOT NULL DEFAULT 'default_color',
ADD COLUMN IF NOT EXISTS "size_id" TEXT NOT NULL DEFAULT 'default_size';

-- Eliminamos los valores por defecto después de que los datos estén actualizados
ALTER TABLE "product_sells" 
ALTER COLUMN "color_id" DROP DEFAULT,
ALTER COLUMN "size_id" DROP DEFAULT;

-- Eliminamos la columna stock de products
ALTER TABLE "products" DROP COLUMN IF EXISTS "stock";

-- Agregamos la columna coupon_code a sells
ALTER TABLE "sells" ADD COLUMN IF NOT EXISTS "coupon_code" TEXT;

-- Modificamos el tipo de dato de password en users
ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE VARCHAR(255);

-- Creamos la tabla inventories
CREATE TABLE "inventories" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "size_id" TEXT NOT NULL,
    "color_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- Agregamos las foreign keys
ALTER TABLE "product_sells" ADD CONSTRAINT "product_sells_color_id_fkey" 
FOREIGN KEY ("color_id") REFERENCES "colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "product_sells" ADD CONSTRAINT "product_sells_size_id_fkey" 
FOREIGN KEY ("size_id") REFERENCES "sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "sells" ADD CONSTRAINT "sells_coupon_code_fkey" 
FOREIGN KEY ("coupon_code") REFERENCES "coupons"("code") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "inventories" ADD CONSTRAINT "inventories_product_id_fkey" 
FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "inventories" ADD CONSTRAINT "inventories_size_id_fkey" 
FOREIGN KEY ("size_id") REFERENCES "sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "inventories" ADD CONSTRAINT "inventories_color_id_fkey" 
FOREIGN KEY ("color_id") REFERENCES "colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
