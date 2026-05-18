-- Add independent home hero scrim flags for desktop and mobile.
-- Keep legacy heroScrimEdge temporarily for compatibility while the new editor/UI
-- migrates to separate booleans.

ALTER TABLE "home_settings"
  ADD COLUMN IF NOT EXISTS "heroScrimShowLeft" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "heroScrimShowRight" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "heroScrimShowTop" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "heroScrimMobileShowLeft" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "heroScrimMobileShowRight" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "heroScrimMobileShowTop" BOOLEAN NOT NULL DEFAULT true;
