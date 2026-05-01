-- Optimize dashboard/chart analytics queries that filter explicit view events.
-- Replaces broad wildcard scan patterns with a focused partial index strategy.
CREATE INDEX IF NOT EXISTS "analytic_logs_view_events_dashboard_idx"
  ON "analytic_logs" ("timestamp" DESC)
  WHERE "isBot" = false
    AND "eventType" IN (
      'HOME_VIEW',
      'GALLERY_VIEW',
      'GALLERY_DETAIL_VIEW',
      'ABOUT_VIEW',
      'CONTACT_VIEW',
      'PAGE_VIEW',
      'CATEGORY_VIEW',
      'PROJECT_DETAIL_VIEW'
    );
