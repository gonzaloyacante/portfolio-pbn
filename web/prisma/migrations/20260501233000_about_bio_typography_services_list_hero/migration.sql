-- About: tamaño ilustración decorativa + tipografía del título ("Hola, soy Paola.")
ALTER TABLE "about_settings" ADD COLUMN IF NOT EXISTS "illustrationMaxPx" INTEGER DEFAULT 112;
ALTER TABLE "about_settings" ADD COLUMN IF NOT EXISTS "illustrationMobileMaxPx" INTEGER DEFAULT 96;
ALTER TABLE "about_settings" ADD COLUMN IF NOT EXISTS "bioTitleFont" TEXT;
ALTER TABLE "about_settings" ADD COLUMN IF NOT EXISTS "bioTitleFontUrl" TEXT;
ALTER TABLE "about_settings" ADD COLUMN IF NOT EXISTS "bioTitleFontSize" INTEGER;
ALTER TABLE "about_settings" ADD COLUMN IF NOT EXISTS "bioTitleMobileFontSize" INTEGER;
ALTER TABLE "about_settings" ADD COLUMN IF NOT EXISTS "bioTitleColor" TEXT;
ALTER TABLE "about_settings" ADD COLUMN IF NOT EXISTS "bioTitleColorDark" TEXT;

-- Página pública listado servicios: hero configurable
CREATE TABLE "services_page_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'singleton',
    "listTitle" TEXT DEFAULT 'Mis Servicios',
    "listIntro" TEXT,
    "listTitleFont" TEXT,
    "listTitleFontUrl" TEXT,
    "listTitleFontSize" INTEGER,
    "listTitleMobileFontSize" INTEGER,
    "listTitleColor" TEXT,
    "listTitleColorDark" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_page_settings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "services_page_settings_key_key" ON "services_page_settings"("key");
