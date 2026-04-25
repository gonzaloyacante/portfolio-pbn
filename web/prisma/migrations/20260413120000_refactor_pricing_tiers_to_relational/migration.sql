-- CreateTable
CREATE TABLE "service_pricing_tiers" (
    "id"          TEXT NOT NULL,
    "serviceId"   TEXT NOT NULL,
    "name"        TEXT NOT NULL,
    "price"       TEXT NOT NULL DEFAULT '',
    "description" TEXT,
    "sortOrder"   INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "service_pricing_tiers_pkey" PRIMARY KEY ("id")
);

-- Migrate existing JSON data from services.pricingTiers to service_pricing_tiers
-- Uses PostgreSQL JSON functions to extract tier data
INSERT INTO "service_pricing_tiers" ("id", "serviceId", "name", "price", "description", "sortOrder")
SELECT
    gen_random_uuid()::TEXT,
    s.id,
    COALESCE(tier->>'name', ''),
    COALESCE(tier->>'price', ''),
    tier->>'description',
    (ordinality - 1)::INTEGER
FROM "services" s,
    LATERAL jsonb_array_elements(s."pricingTiers"::jsonb) WITH ORDINALITY AS t(tier, ordinality)
WHERE s."pricingTiers" IS NOT NULL
  AND s."pricingTiers"::text <> 'null'
  AND jsonb_typeof(s."pricingTiers"::jsonb) = 'array'
  AND jsonb_array_length(s."pricingTiers"::jsonb) > 0;

-- AddForeignKey
ALTER TABLE "service_pricing_tiers"
    ADD CONSTRAINT "service_pricing_tiers_serviceId_fkey"
    FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "service_pricing_tiers_serviceId_sortOrder_idx"
    ON "service_pricing_tiers"("serviceId", "sortOrder");

-- AlterTable: drop the old JSON column
ALTER TABLE "services" DROP COLUMN "pricingTiers";
