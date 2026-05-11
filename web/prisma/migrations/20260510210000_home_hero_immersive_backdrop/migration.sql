-- Hero inmersivo: fondo full-bleed (imagen/vídeo/GIF) + scrim lateral configurable (CMS).

ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroImmersiveEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroBackdropMediaKind" TEXT NOT NULL DEFAULT 'auto';
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroBackdropUrl" TEXT;
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroBackdropPosterUrl" TEXT;
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroBackdropLoop" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroBackdropMuted" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroBackdropPlaysInline" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroBackdropObjectFit" TEXT NOT NULL DEFAULT 'cover';
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroBackdropObjectPosition" TEXT NOT NULL DEFAULT 'center';
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroBackdropMobileUrl" TEXT;
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroBackdropMobileObjectPosition" TEXT;
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroForegroundPortraitShow" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroScrimEdge" TEXT NOT NULL DEFAULT 'left';
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroScrimExtentPercent" INTEGER NOT NULL DEFAULT 45;
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroScrimOpacity" INTEGER NOT NULL DEFAULT 80;
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroScrimColor" TEXT;
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroScrimColorDark" TEXT;
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroScrimFeatherPercent" INTEGER NOT NULL DEFAULT 50;
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroBackdropTintOpacity" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroScrimMobileExtentPercent" INTEGER;
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "heroScrimMobileOpacity" INTEGER;
