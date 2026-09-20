-- Add heroVideoUrl to SiteSettings
ALTER TABLE "SiteSettings"
ADD COLUMN IF NOT EXISTS "heroVideoUrl" TEXT;
