/*
  Warnings:

  - You are about to drop the column `metaDescription` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `metaKeywords` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `ogImage` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `canonicalUrl` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `layout` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `metaKeywords` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `ogImage` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `metaKeywords` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `services` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key]` on the table `about_settings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `category_settings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `contact_settings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `email_settings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `home_settings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `project_settings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `site_settings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `testimonial_settings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `theme_settings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "projects_isActive_isDeleted_idx";

-- DropIndex
DROP INDEX "projects_tags_idx";

-- AlterTable
ALTER TABLE "about_settings" ADD COLUMN     "key" TEXT NOT NULL DEFAULT 'singleton';

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "metaDescription",
DROP COLUMN "metaKeywords",
DROP COLUMN "metaTitle",
DROP COLUMN "ogImage";

-- AlterTable
ALTER TABLE "category_settings" ADD COLUMN     "key" TEXT NOT NULL DEFAULT 'singleton';

-- AlterTable
ALTER TABLE "contact_settings" ADD COLUMN     "key" TEXT NOT NULL DEFAULT 'singleton',
ADD COLUMN     "showEmail" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showLocation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showPhone" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showWhatsapp" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "email_settings" ADD COLUMN     "key" TEXT NOT NULL DEFAULT 'singleton';

-- AlterTable
ALTER TABLE "home_settings" ADD COLUMN     "key" TEXT NOT NULL DEFAULT 'singleton';

-- AlterTable
ALTER TABLE "project_settings" ADD COLUMN     "key" TEXT NOT NULL DEFAULT 'singleton';

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "canonicalUrl",
DROP COLUMN "layout",
DROP COLUMN "location",
DROP COLUMN "metaDescription",
DROP COLUMN "metaKeywords",
DROP COLUMN "metaTitle",
DROP COLUMN "ogImage",
DROP COLUMN "tags";

-- AlterTable
ALTER TABLE "services" DROP COLUMN "metaDescription",
DROP COLUMN "metaKeywords",
DROP COLUMN "metaTitle";

-- AlterTable
ALTER TABLE "site_settings" ADD COLUMN     "key" TEXT NOT NULL DEFAULT 'singleton';

-- AlterTable
ALTER TABLE "testimonial_settings" ADD COLUMN     "key" TEXT NOT NULL DEFAULT 'singleton';

-- AlterTable
ALTER TABLE "theme_settings" ADD COLUMN     "key" TEXT NOT NULL DEFAULT 'singleton';

-- CreateIndex
CREATE UNIQUE INDEX "about_settings_key_key" ON "about_settings"("key");

-- CreateIndex
CREATE INDEX "bookings_date_status_idx" ON "bookings"("date", "status");

-- CreateIndex
CREATE INDEX "bookings_status_deletedAt_idx" ON "bookings"("status", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "category_settings_key_key" ON "category_settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "contact_settings_key_key" ON "contact_settings"("key");

-- CreateIndex
CREATE INDEX "contacts_status_priority_idx" ON "contacts"("status", "priority");

-- CreateIndex
CREATE INDEX "contacts_isRead_deletedAt_idx" ON "contacts"("isRead", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "email_settings_key_key" ON "email_settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "home_settings_key_key" ON "home_settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "project_settings_key_key" ON "project_settings"("key");

-- CreateIndex
CREATE INDEX "projects_isActive_deletedAt_idx" ON "projects"("isActive", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_key_key" ON "site_settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "testimonial_settings_key_key" ON "testimonial_settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "theme_settings_key_key" ON "theme_settings"("key");
