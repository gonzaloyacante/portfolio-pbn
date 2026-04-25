/*
  Warnings:

  - You are about to drop the column `thumbnailUrl` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `showProjectCount` on the `category_settings` table. All the data in the column will be lost.
  - You are about to drop the column `showFeaturedProjects` on the `home_settings` table. All the data in the column will be lost.
  - You are about to drop the `project_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "project_images" DROP CONSTRAINT "project_images_projectId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_categoryId_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "thumbnailUrl";

-- AlterTable
ALTER TABLE "category_settings" DROP COLUMN "showProjectCount";

-- AlterTable
ALTER TABLE "home_settings" DROP COLUMN "showFeaturedProjects",
ADD COLUMN     "showFeaturedImages" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "featuredTitle" SET DEFAULT 'Galería Destacada';

-- DropTable
DROP TABLE "project_images";

-- DropTable
DROP TABLE "project_settings";

-- DropTable
DROP TABLE "projects";

-- CreateTable
CREATE TABLE "category_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "category_images_categoryId_order_idx" ON "category_images"("categoryId", "order");

-- AddForeignKey
ALTER TABLE "category_images" ADD CONSTRAINT "category_images_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
