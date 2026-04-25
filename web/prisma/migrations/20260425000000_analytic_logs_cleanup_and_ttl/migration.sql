-- Migration: Analytic logs cleanup + TTL index
-- Removes old analytic_logs rows (> 90 days) that were accumulating
-- and causing slow queries + unnecessary compute on Neon free tier.
-- Also adds a partial index to speed up the most common dashboard queries.

-- Step 1: Delete logs older than 90 days (keep recent data only)
-- This is a one-time cleanup; ongoing TTL is handled by the app.
DELETE FROM "analytic_logs"
WHERE timestamp < NOW() - INTERVAL '90 days';

-- Step 2: Add partial index for the most common dashboard query pattern
-- (non-bot _VIEW events by timestamp) — avoids full table scans.
CREATE INDEX CONCURRENTLY IF NOT EXISTS "analytic_logs_dashboard_idx"
  ON "analytic_logs" ("timestamp" DESC)
  WHERE "isBot" = false AND "eventType" LIKE '%_VIEW';

-- Step 3: Add index for rate-limit-style dedup queries (findFirst by IP + timestamp)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "analytic_logs_dedup_idx"
  ON "analytic_logs" ("ipAddress", "timestamp" DESC)
  WHERE "isBot" = false;
