-- Ensure the column exists before 20260510203000 changes its default.
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroImmersiveEnabled" BOOLEAN NOT NULL DEFAULT false;
