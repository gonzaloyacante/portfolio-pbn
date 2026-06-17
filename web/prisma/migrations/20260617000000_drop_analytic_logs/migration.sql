-- Drop analytic_logs table and all its indexes.
-- Custom analytics are permanently disabled (disabled since launch to avoid
-- Neon compute cost). The Flutter dashboard already shows a "use Google
-- Analytics" placeholder. No code writes to this table.
-- Confirmed safe: 558 rows are static pre-launch data, no FK references.

DROP TABLE IF EXISTS "analytic_logs";
