#!/bin/sh
# The first command establishes the one-time baseline. On later deployments it
# reports that the baseline is already applied, which is expected.
npx prisma migrate resolve --applied 20260919000000_baseline_existing_schema --schema ../../packages/database/prisma/schema.prisma || true

MAX_RETRIES=5
RETRY_DELAY=3
ATTEMPT=1

until npx prisma migrate deploy --schema ../../packages/database/prisma/schema.prisma; do
  if [ $ATTEMPT -ge $MAX_RETRIES ]; then
    echo "Prisma migrate deploy failed after $MAX_RETRIES attempts"
    exit 1
  fi
  echo "Prisma migrate deploy failed on attempt $ATTEMPT. Retrying in ${RETRY_DELAY}s..."
  sleep $RETRY_DELAY
  ATTEMPT=$((ATTEMPT + 1))
done

