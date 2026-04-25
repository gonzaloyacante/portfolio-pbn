/*
  Warnings:

  - You are about to drop the column `cancelledBy` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `confirmedBy` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `feedbackRating` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `feedbackSent` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `feedbackText` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `reminderCount` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `reminderSentAt` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `iconName` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `projectCount` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `assignedTo` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `leadScore` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `leadSource` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `readBy` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `repliedBy` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `smtpFrom` on the `email_settings` table. All the data in the column will be lost.
  - You are about to drop the column `smtpFromName` on the `email_settings` table. All the data in the column will be lost.
  - You are about to drop the column `smtpHost` on the `email_settings` table. All the data in the column will be lost.
  - You are about to drop the column `smtpPassword` on the `email_settings` table. All the data in the column will be lost.
  - You are about to drop the column `smtpPort` on the `email_settings` table. All the data in the column will be lost.
  - You are about to drop the column `smtpUser` on the `email_settings` table. All the data in the column will be lost.
  - You are about to drop the column `seoAlt` on the `project_images` table. All the data in the column will be lost.
  - You are about to drop the column `lastViewedAt` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `likeCount` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `shareCount` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `bookingCount` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `iconName` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `businessHours` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `cookiePolicyUrl` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `facebookPixelId` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `privacyPolicyUrl` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `termsOfServiceUrl` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `moderatedBy` on the `testimonials` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `testimonials` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "categories_viewCount_idx";

-- DropIndex
DROP INDEX "contacts_assignedTo_idx";

-- DropIndex
DROP INDEX "contacts_leadScore_idx";

-- DropIndex
DROP INDEX "contacts_status_priority_idx";

-- DropIndex
DROP INDEX "projects_viewCount_idx";

-- DropIndex
DROP INDEX "testimonials_viewCount_idx";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "cancelledBy",
DROP COLUMN "confirmedBy",
DROP COLUMN "feedbackRating",
DROP COLUMN "feedbackSent",
DROP COLUMN "feedbackText",
DROP COLUMN "reminderCount",
DROP COLUMN "reminderSentAt";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "color",
DROP COLUMN "iconName",
DROP COLUMN "projectCount",
DROP COLUMN "viewCount";

-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "assignedTo",
DROP COLUMN "leadScore",
DROP COLUMN "leadSource",
DROP COLUMN "readBy",
DROP COLUMN "repliedBy",
DROP COLUMN "userAgent";

-- AlterTable
ALTER TABLE "email_settings" DROP COLUMN "smtpFrom",
DROP COLUMN "smtpFromName",
DROP COLUMN "smtpHost",
DROP COLUMN "smtpPassword",
DROP COLUMN "smtpPort",
DROP COLUMN "smtpUser";

-- AlterTable
ALTER TABLE "project_images" DROP COLUMN "seoAlt";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "lastViewedAt",
DROP COLUMN "likeCount",
DROP COLUMN "shareCount",
DROP COLUMN "version";

-- AlterTable
ALTER TABLE "services" DROP COLUMN "bookingCount",
DROP COLUMN "color",
DROP COLUMN "iconName",
DROP COLUMN "viewCount";

-- AlterTable
ALTER TABLE "site_settings" DROP COLUMN "businessHours",
DROP COLUMN "cookiePolicyUrl",
DROP COLUMN "facebookPixelId",
DROP COLUMN "privacyPolicyUrl",
DROP COLUMN "termsOfServiceUrl";

-- AlterTable
ALTER TABLE "testimonials" DROP COLUMN "moderatedBy",
DROP COLUMN "viewCount";
