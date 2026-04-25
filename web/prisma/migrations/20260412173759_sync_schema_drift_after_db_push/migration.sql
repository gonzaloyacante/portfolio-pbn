/*
  Warnings:

  - You are about to drop the column `emailLabel` on the `contact_settings` table. All the data in the column will be lost.
  - You are about to drop the column `formTitle` on the `contact_settings` table. All the data in the column will be lost.
  - You are about to drop the column `messageLabel` on the `contact_settings` table. All the data in the column will be lost.
  - You are about to drop the column `nameLabel` on the `contact_settings` table. All the data in the column will be lost.
  - You are about to drop the column `phoneLabel` on the `contact_settings` table. All the data in the column will be lost.
  - You are about to drop the column `preferenceLabel` on the `contact_settings` table. All the data in the column will be lost.
  - You are about to drop the column `sendAnotherLabel` on the `contact_settings` table. All the data in the column will be lost.
  - You are about to drop the column `submitLabel` on the `contact_settings` table. All the data in the column will be lost.
  - You are about to drop the column `successMessage` on the `contact_settings` table. All the data in the column will be lost.
  - You are about to drop the column `successTitle` on the `contact_settings` table. All the data in the column will be lost.
  - You are about to drop the column `showProjectsPage` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `testimonials` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "category_images" ADD COLUMN     "height" INTEGER,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "width" INTEGER;

-- AlterTable
ALTER TABLE "contact_settings" DROP COLUMN "emailLabel",
DROP COLUMN "formTitle",
DROP COLUMN "messageLabel",
DROP COLUMN "nameLabel",
DROP COLUMN "phoneLabel",
DROP COLUMN "preferenceLabel",
DROP COLUMN "sendAnotherLabel",
DROP COLUMN "submitLabel",
DROP COLUMN "successMessage",
DROP COLUMN "successTitle",
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "instagramPostUrl" TEXT,
ADD COLUMN     "instagramUsername" TEXT DEFAULT '',
ADD COLUMN     "showInstagram" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showInstagramEmbed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "instagramUser" TEXT,
ADD COLUMN     "isImportant" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "home_settings" ALTER COLUMN "ctaLink" SET DEFAULT '/portfolio';

-- AlterTable
ALTER TABLE "site_settings" DROP COLUMN "showProjectsPage",
ADD COLUMN     "navbarBrandColor" TEXT,
ADD COLUMN     "navbarBrandColorDark" TEXT,
ADD COLUMN     "navbarBrandFont" TEXT,
ADD COLUMN     "navbarBrandFontSize" INTEGER DEFAULT 30,
ADD COLUMN     "navbarBrandFontUrl" TEXT,
ADD COLUMN     "navbarBrandText" TEXT DEFAULT 'Paola BN',
ADD COLUMN     "navbarShowBrand" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showGalleryPage" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "testimonials" DROP COLUMN "projectId",
ADD COLUMN     "categoryId" TEXT;

-- CreateIndex
CREATE INDEX "category_images_isFeatured_idx" ON "category_images"("isFeatured");
