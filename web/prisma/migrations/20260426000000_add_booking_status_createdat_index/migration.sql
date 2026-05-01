-- Composite index for admin/dashboard queries filtering by booking status and time ordering.
-- Matches @@index([status, createdAt]) on Booking in schema.
CREATE INDEX IF NOT EXISTS "bookings_status_createdAt_idx" ON "bookings"("status", "createdAt");
