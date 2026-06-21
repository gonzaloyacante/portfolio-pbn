/*
  Warnings:

  - You are about to drop the column `bio` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "category_settings" ALTER COLUMN "gridColumns" SET DEFAULT 3;

-- AlterTable
ALTER TABLE "home_settings" ADD COLUMN     "ctaTabletFontSize" INTEGER DEFAULT 18,
ADD COLUMN     "ctaTabletOffsetX" INTEGER DEFAULT 0,
ADD COLUMN     "ctaTabletOffsetY" INTEGER DEFAULT 0,
ADD COLUMN     "heroMainImageTabletOffsetX" INTEGER DEFAULT 0,
ADD COLUMN     "heroMainImageTabletOffsetY" INTEGER DEFAULT 0,
ADD COLUMN     "heroTitle1TabletFontSize" INTEGER DEFAULT 80,
ADD COLUMN     "heroTitle1TabletOffsetX" INTEGER DEFAULT 0,
ADD COLUMN     "heroTitle1TabletOffsetY" INTEGER DEFAULT 0,
ADD COLUMN     "heroTitle2TabletFontSize" INTEGER DEFAULT 84,
ADD COLUMN     "heroTitle2TabletOffsetX" INTEGER DEFAULT 0,
ADD COLUMN     "heroTitle2TabletOffsetY" INTEGER DEFAULT 0,
ADD COLUMN     "illustrationTabletOffsetX" INTEGER DEFAULT 0,
ADD COLUMN     "illustrationTabletOffsetY" INTEGER DEFAULT 0,
ADD COLUMN     "illustrationTabletRotation" INTEGER DEFAULT 0,
ADD COLUMN     "illustrationTabletSize" INTEGER DEFAULT 80,
ADD COLUMN     "ownerNameTabletFontSize" INTEGER DEFAULT 36,
ADD COLUMN     "ownerNameTabletOffsetX" INTEGER DEFAULT 0,
ADD COLUMN     "ownerNameTabletOffsetY" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "bio";

-- CreateIndex
CREATE INDEX "category_images_isFeatured_categoryId_idx" ON "category_images"("isFeatured", "categoryId");
