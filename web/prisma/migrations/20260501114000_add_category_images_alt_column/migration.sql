-- Fix schema drift: ensure category_images.alt exists in all environments.
-- This column is defined in Prisma schema (CategoryImage.alt) and used by build-time queries.
ALTER TABLE "category_images"
ADD COLUMN IF NOT EXISTS "alt" TEXT;
