-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "ipAddress" TEXT;

-- CreateIndex
CREATE INDEX "contacts_ipAddress_createdAt_idx" ON "contacts"("ipAddress", "createdAt");
