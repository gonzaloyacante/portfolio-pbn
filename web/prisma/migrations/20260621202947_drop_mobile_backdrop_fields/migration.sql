/*
  Warnings:

  - You are about to drop the column `heroBackdropMobileObjectPosition` on the `home_settings` table. All the data in the column will be lost.
  - You are about to drop the column `heroBackdropMobileUrl` on the `home_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "home_settings" DROP COLUMN "heroBackdropMobileObjectPosition",
DROP COLUMN "heroBackdropMobileUrl";
