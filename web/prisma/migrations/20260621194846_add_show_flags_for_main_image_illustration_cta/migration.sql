-- AlterTable
ALTER TABLE "home_settings" ADD COLUMN     "showCtaButton" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showHeroMainImage" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showIllustration" BOOLEAN NOT NULL DEFAULT true;
