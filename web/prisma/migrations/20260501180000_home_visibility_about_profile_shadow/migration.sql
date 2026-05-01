-- Home: visibility toggles for hero titles and owner signature line
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "showHeroTitle1" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "showHeroTitle2" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "home_settings" ADD COLUMN IF NOT EXISTS "showOwnerName" BOOLEAN NOT NULL DEFAULT true;

-- About: configurable profile image shadow
ALTER TABLE "about_settings" ADD COLUMN IF NOT EXISTS "profileImageShadowEnabled" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "about_settings" ADD COLUMN IF NOT EXISTS "profileImageShadowBlur" INTEGER DEFAULT 24;
ALTER TABLE "about_settings" ADD COLUMN IF NOT EXISTS "profileImageShadowSpread" INTEGER DEFAULT 0;
ALTER TABLE "about_settings" ADD COLUMN IF NOT EXISTS "profileImageShadowOffsetX" INTEGER DEFAULT 0;
ALTER TABLE "about_settings" ADD COLUMN IF NOT EXISTS "profileImageShadowOffsetY" INTEGER DEFAULT 8;
ALTER TABLE "about_settings" ADD COLUMN IF NOT EXISTS "profileImageShadowColor" TEXT;
ALTER TABLE "about_settings" ADD COLUMN IF NOT EXISTS "profileImageShadowOpacity" INTEGER DEFAULT 35;
