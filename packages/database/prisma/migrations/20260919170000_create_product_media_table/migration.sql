-- Reconcile the production database with the existing ProductMedia Prisma
-- model. This only adds the missing relation table and does not alter product
-- rows or any existing production table.
CREATE TABLE IF NOT EXISTS "ProductMedia" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "kind" TEXT NOT NULL DEFAULT 'VIDEO',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProductMedia_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ProductMedia_productId_idx" ON "ProductMedia"("productId");

DO $$ BEGIN
  ALTER TABLE "ProductMedia"
    ADD CONSTRAINT "ProductMedia_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
