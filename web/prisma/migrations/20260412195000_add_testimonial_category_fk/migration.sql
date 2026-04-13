-- Null out orphaned testimonial category references before adding the FK.
UPDATE "testimonials" AS t
SET "categoryId" = NULL
WHERE t."categoryId" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM "categories" AS c
    WHERE c."id" = t."categoryId"
  );

CREATE INDEX IF NOT EXISTS "testimonials_categoryId_idx" ON "testimonials"("categoryId");

ALTER TABLE "testimonials"
ADD CONSTRAINT "testimonials_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "categories"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
