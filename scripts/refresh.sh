#!/usr/bin/env bash
set -euo pipefail
AUTH=https://auth.lince.zone

TOKEN=''      # el XSRF-TOKEN
REFRESH=''
CF=''                    # _cf_clearance
# ----------------------------------------------------------------

COOKIE="XSRF-TOKEN=$TOKEN; refreshToken=$REFRESH; _cf_clearance=$CF"

echo -e "· Llamando /auth/refresh con las cookies de la sesión…\n"
curl -i -X POST "$AUTH/auth/refresh" \
     -H 'Accept: application/json' \
     -H 'Content-Type: application/json' \
     -H "x-csrf-token: $TOKEN" \
     -b "$COOKIE" \
     --data '{}'
