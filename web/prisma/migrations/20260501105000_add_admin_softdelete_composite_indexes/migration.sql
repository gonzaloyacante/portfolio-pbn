-- Composite indexes for admin list endpoints with soft-delete filters.
-- Goal: reduce scan cost for common patterns:
--   WHERE deletedAt IS NULL ORDER BY sortOrder/createdAt/date

CREATE INDEX IF NOT EXISTS "categories_deletedAt_sortOrder_idx"
  ON "categories"("deletedAt", "sortOrder");

CREATE INDEX IF NOT EXISTS "services_deletedAt_sortOrder_idx"
  ON "services"("deletedAt", "sortOrder");

CREATE INDEX IF NOT EXISTS "services_deletedAt_createdAt_idx"
  ON "services"("deletedAt", "createdAt");

CREATE INDEX IF NOT EXISTS "testimonials_deletedAt_sortOrder_idx"
  ON "testimonials"("deletedAt", "sortOrder");

CREATE INDEX IF NOT EXISTS "testimonials_deletedAt_createdAt_idx"
  ON "testimonials"("deletedAt", "createdAt");

CREATE INDEX IF NOT EXISTS "contacts_deletedAt_createdAt_idx"
  ON "contacts"("deletedAt", "createdAt");

CREATE INDEX IF NOT EXISTS "bookings_deletedAt_date_idx"
  ON "bookings"("deletedAt", "date");
