-- Migration: Remove all Json? fields from schema
-- Replace AnalyticLog.eventData Json? with typed columns pageUrl + consentLevel
-- Remove unused AnalyticLog.metadata column
-- Convert SecurityEvent.details from JSONB to TEXT (schema was already updated, DB still JSONB)

-- Step 1: Add explicit typed columns to analytic_logs
ALTER TABLE "analytic_logs"
  ADD COLUMN IF NOT EXISTS "pageUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "consentLevel" TEXT;

-- Step 2: Migrate existing eventData to new columns
-- Column name in DB is camelCase "eventData" (as created in original migration)
UPDATE "analytic_logs"
SET
  "pageUrl" = "eventData"->>'url',
  "consentLevel" = COALESCE("eventData"->>'_consentLevel', "eventData"->>'consentLevel')
WHERE "eventData" IS NOT NULL;

-- Step 3: Drop eventData (JSONB) column
ALTER TABLE "analytic_logs" DROP COLUMN IF EXISTS "eventData";

-- Step 4: Drop unused metadata column
ALTER TABLE "analytic_logs" DROP COLUMN IF EXISTS "metadata";

-- Step 5: Convert security_events.details from JSONB to TEXT
ALTER TABLE "security_events"
  ALTER COLUMN "details" TYPE TEXT USING details::TEXT;
