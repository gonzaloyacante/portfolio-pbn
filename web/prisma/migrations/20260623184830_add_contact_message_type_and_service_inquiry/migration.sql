-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "customService" TEXT,
ADD COLUMN     "messageType" TEXT NOT NULL DEFAULT 'GENERAL',
ADD COLUMN     "serviceId" TEXT;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
