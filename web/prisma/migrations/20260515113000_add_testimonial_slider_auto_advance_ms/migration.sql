-- TestimonialSettings.sliderAutoAdvanceMs exists in Prisma schema but was never shipped via migrate.
-- Fixes environments where column `testimonial_settings.sliderAutoAdvanceMs` does not exist.

ALTER TABLE "testimonial_settings"
ADD COLUMN IF NOT EXISTS "sliderAutoAdvanceMs" INTEGER NOT NULL DEFAULT 5000;
