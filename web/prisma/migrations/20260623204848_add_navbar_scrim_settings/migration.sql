-- AlterTable
ALTER TABLE "home_settings" ADD COLUMN     "navbarScrimEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "navbarScrimHeightVh" INTEGER NOT NULL DEFAULT 45,
ADD COLUMN     "navbarScrimIntensity" INTEGER NOT NULL DEFAULT 80;
