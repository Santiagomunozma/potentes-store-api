/*
  Warnings:

  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Added the required column `updated_at` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color_id` to the `product_sells` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size_id` to the `product_sells` table without a default value. This is not possible if the table is not empty.

*/

-- Primero manejamos la tabla coupons
DO $$ 
BEGIN
    -- Si la columna updated_at no existe, la creamos
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'updated_at') THEN
        ALTER TABLE "coupons" ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;

    -- Si la columna created_at no existe, la creamos
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'created_at') THEN
        ALTER TABLE "coupons" ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;

    -- Actualizamos los registros nulos
    UPDATE coupons SET updated_at = CURRENT_TIMESTAMP WHERE updated_at IS NULL;
    UPDATE coupons SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;
END $$;

-- Creamos las tablas nuevas si no existen
CREATE TABLE IF NOT EXISTS "sizes" (
    "id" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "sizes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "colors" (
    "id" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "colors_pkey" PRIMARY KEY ("id")
);

-- Insertamos valores por defecto si no existen
INSERT INTO "sizes" ("id", "size", "created_at", "updated_at")
VALUES ('default_size', 'Default', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "colors" ("id", "color", "created_at", "updated_at")
VALUES ('default_color', 'Default', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Manejamos las columnas de product_sells
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_sells' AND column_name = 'color_id') THEN
        ALTER TABLE "product_sells" ADD COLUMN "color_id" TEXT NOT NULL DEFAULT 'default_color';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_sells' AND column_name = 'size_id') THEN
        ALTER TABLE "product_sells" ADD COLUMN "size_id" TEXT NOT NULL DEFAULT 'default_size';
    END IF;
END $$;

-- Eliminamos los valores por defecto después de que los datos estén actualizados
ALTER TABLE "product_sells" 
ALTER COLUMN "color_id" DROP DEFAULT,
ALTER COLUMN "size_id" DROP DEFAULT;

-- Eliminamos la columna stock de products si existe
ALTER TABLE "products" DROP COLUMN IF EXISTS "stock";

-- Agregamos la columna coupon_code a sells si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sells' AND column_name = 'coupon_code') THEN
        ALTER TABLE "sells" ADD COLUMN "coupon_code" TEXT;
    END IF;
END $$;

-- Modificamos el tipo de dato de password en users
ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE VARCHAR(255);

-- Creamos la tabla inventories si no existe
CREATE TABLE IF NOT EXISTS "inventories" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "size_id" TEXT NOT NULL,
    "color_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- Agregamos las foreign keys si no existen
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'product_sells_color_id_fkey') THEN
        ALTER TABLE "product_sells" ADD CONSTRAINT "product_sells_color_id_fkey" 
        FOREIGN KEY ("color_id") REFERENCES "colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'product_sells_size_id_fkey') THEN
        ALTER TABLE "product_sells" ADD CONSTRAINT "product_sells_size_id_fkey" 
        FOREIGN KEY ("size_id") REFERENCES "sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'sells_coupon_code_fkey') THEN
        ALTER TABLE "sells" ADD CONSTRAINT "sells_coupon_code_fkey" 
        FOREIGN KEY ("coupon_code") REFERENCES "coupons"("code") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'inventories_product_id_fkey') THEN
        ALTER TABLE "inventories" ADD CONSTRAINT "inventories_product_id_fkey" 
        FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'inventories_size_id_fkey') THEN
        ALTER TABLE "inventories" ADD CONSTRAINT "inventories_size_id_fkey" 
        FOREIGN KEY ("size_id") REFERENCES "sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'inventories_color_id_fkey') THEN
        ALTER TABLE "inventories" ADD CONSTRAINT "inventories_color_id_fkey" 
        FOREIGN KEY ("color_id") REFERENCES "colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
