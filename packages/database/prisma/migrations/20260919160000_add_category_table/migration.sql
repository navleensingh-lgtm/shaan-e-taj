-- The production database predates the Category model.  Every statement is
-- guarded so this can safely reconcile an already-partially-provisioned DB
-- without touching existing product or customer data.
DO $$ BEGIN
  CREATE TYPE "CategoryKind" AS ENUM ('MAIN', 'SUB');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "imageUrl" TEXT,
  "kind" "CategoryKind" NOT NULL DEFAULT 'MAIN',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");
CREATE INDEX IF NOT EXISTS "Category_kind_sortOrder_idx" ON "Category"("kind", "sortOrder");
