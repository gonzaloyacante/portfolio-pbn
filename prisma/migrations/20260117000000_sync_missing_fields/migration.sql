-- AlterTable
ALTER TABLE "contacts" ADD COLUMN "phone" TEXT;

-- AlterTable
ALTER TABLE "theme_settings" ADD COLUMN "cardBgColor" TEXT NOT NULL DEFAULT '#ffaadd',
ADD COLUMN "darkCardBgColor" TEXT NOT NULL DEFAULT '#ffaadd';
