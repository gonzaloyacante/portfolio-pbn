-- Align DB default with prisma/schema/settings.prisma.
ALTER TABLE "testimonial_settings"
  ALTER COLUMN "sliderAutoAdvanceMs" SET DEFAULT 10000;
