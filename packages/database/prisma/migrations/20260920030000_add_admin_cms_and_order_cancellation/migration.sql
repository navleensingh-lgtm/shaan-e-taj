-- Migration: Add Admin CMS, Order Cancellation and Social Config
ALTER TABLE "Order"
ADD COLUMN IF NOT EXISTS "cancellationReason" TEXT,
ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "cancelledBy" TEXT;

ALTER TABLE "SiteSettings"
ADD COLUMN IF NOT EXISTS "homepageCms" JSONB,
ADD COLUMN IF NOT EXISTS "socialConfig" JSONB,
ADD COLUMN IF NOT EXISTS "supportedCurrencies" TEXT[] DEFAULT ARRAY['INR', 'USD', 'CAD', 'GBP', 'EUR', 'AUD']::TEXT[];
