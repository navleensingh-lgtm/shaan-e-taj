#!/bin/sh
# The first command establishes the one-time baseline. On later deployments it
# reports that the baseline is already applied, which is expected.
npx prisma migrate resolve --applied 20260919000000_baseline_existing_schema --schema ../../packages/database/prisma/schema.prisma || true
npx prisma migrate deploy --schema ../../packages/database/prisma/schema.prisma
