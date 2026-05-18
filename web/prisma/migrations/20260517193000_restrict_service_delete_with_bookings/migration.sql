-- Preserve booking history when a service is purged from trash.
ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_serviceId_fkey";

ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_serviceId_fkey"
  FOREIGN KEY ("serviceId") REFERENCES "services"("id")
  ON DELETE RESTRICT
  ON UPDATE CASCADE;
