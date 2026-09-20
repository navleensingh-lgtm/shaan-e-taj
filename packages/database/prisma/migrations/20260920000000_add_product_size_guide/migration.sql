-- Add size guide support to Product and SiteSettings
-- Uses IF NOT EXISTS to ensure safe, zero-downtime execution without affecting existing products.

ALTER TABLE "Product" 
ADD COLUMN IF NOT EXISTS "useMasterSizeGuide" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS "sizeGuide" JSONB;

ALTER TABLE "SiteSettings"
ADD COLUMN IF NOT EXISTS "masterSizeGuide" JSONB;
