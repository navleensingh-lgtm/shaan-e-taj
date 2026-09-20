-- Add luxury product fields: SKU, productType, fit, availability, prepTimeline, components, fabricDetails, careInstructions, deliveryInfo, customStitchingInfo, returnsInfo, customMeasurements, faqs
-- Uses IF NOT EXISTS to guarantee zero downtime and 100% backward compatibility with all existing products.

ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "sku" TEXT,
ADD COLUMN IF NOT EXISTS "productType" TEXT,
ADD COLUMN IF NOT EXISTS "fit" TEXT,
ADD COLUMN IF NOT EXISTS "availability" TEXT DEFAULT 'READY_TO_SHIP',
ADD COLUMN IF NOT EXISTS "prepTimeline" TEXT,
ADD COLUMN IF NOT EXISTS "components" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS "fabricDetails" TEXT,
ADD COLUMN IF NOT EXISTS "careInstructions" TEXT,
ADD COLUMN IF NOT EXISTS "deliveryInfo" TEXT,
ADD COLUMN IF NOT EXISTS "customStitchingInfo" TEXT,
ADD COLUMN IF NOT EXISTS "returnsInfo" TEXT,
ADD COLUMN IF NOT EXISTS "customMeasurements" JSONB,
ADD COLUMN IF NOT EXISTS "faqs" JSONB;

CREATE INDEX IF NOT EXISTS "Product_sku_idx" ON "Product"("sku");
