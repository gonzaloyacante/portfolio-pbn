-- TestimonialSettings.showOnAll exists in Prisma schema but was never shipped via migrate.
-- Fixes production: column `testimonial_settings.showOnAll` does not exist.

-- AlterTable (IF NOT EXISTS: develop puede tener la columna por db:push previo; prod Neon main la necesita)
ALTER TABLE "testimonial_settings" ADD COLUMN IF NOT EXISTS "showOnAll" BOOLEAN NOT NULL DEFAULT false;
