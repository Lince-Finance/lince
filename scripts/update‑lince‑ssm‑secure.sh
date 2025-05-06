#!/usr/bin/env bash
set -euo pipefail

###############################################################################
# 0)  IDs de cuenta
###############################################################################
DEV_ACCOUNT_ID="128008213193"
LIVE_ACCOUNT_ID="524215333101"

###############################################################################
# 1)  ¿En qué cuenta estoy?
###############################################################################
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "↳  Ejecutando en cuenta $ACCOUNT_ID"

###############################################################################
# 2)  FRONTEND_URL (dev ↔︎ live)  – puedo sobre-escribir con env-var
###############################################################################
if [[ -n "${FRONTEND_URL:-}" ]]; then
  URL="$FRONTEND_URL"
elif [[ "$ACCOUNT_ID" == "$DEV_ACCOUNT_ID" ]]; then
  URL="https://app.lince.zone"
elif [[ "$ACCOUNT_ID" == "$LIVE_ACCOUNT_ID" ]]; then
  URL="https://app.lince.finance"
else
  echo "❌  Cuenta $ACCOUNT_ID desconocida; define FRONTEND_URL manualmente"
  exit 1
fi
echo "↳  FRONTEND_URL = $URL"

###############################################################################
# 3)  Resuelve el ARN de la CMK exportado por core-infra
###############################################################################
KMS_ARN=$(aws cloudformation list-exports \
           --query "Exports[?Name=='lince-KmsKeyArn'].Value" \
           --output text)

if [[ -z "$KMS_ARN" || "$KMS_ARN" == "None" ]]; then
  echo "❌  No he podido resolver lince-KmsKeyArn"
  exit 1
fi
echo "↳  Usando CMK: $KMS_ARN"

###############################################################################
# 4)  Parámetros que queremos securizar / actualizar
#     - Incluye los NUEVOS de Google & Apple IdP y Payments
###############################################################################
PARAMS=(
  # ─── Cognito / Auth ────────────────────────────────────────────────────
  /lince/AWS_CLIENT_ID
  /lince/AWS_CLIENT_SECRET
  /lince/GOOGLE_CLIENT_ID
  /lince/GOOGLE_CLIENT_SECRET
  /lince/APPLE_TEAM_ID
  /lince/APPLE_KEY_ID
  /lince/APPLE_CLIENT_ID
  /lince/APPLE_PRIVATE_KEY_PEM

  # ─── Payments (Onramper) ───────────────────────────────────────────────
  /lince/PAYMENTS_ONRAMPER_API_KEY
  /lince/PAYMENTS_ONRAMPER_SECRET_KEY

  # ─── Infra comunes ─────────────────────────────────────────────────────
  /lince/REDIS_URL
  /lince/FRONTEND_URL
)

###############################################################################
# 5)  Re-graba cada parámetro como SecureString + CMK
###############################################################################
for p in "${PARAMS[@]}"; do
  if [[ "$p" == "/lince/FRONTEND_URL" ]]; then
      VALUE="$URL"                              # siempre lo sobre-escribimos
  else
      VALUE=$(aws ssm get-parameter --name "$p" \
                --query 'Parameter.Value' --output text 2>/dev/null || true)
  fi

  # Si no existe todavía mostramos aviso, no abortamos
  if [[ -z "$VALUE" || "$VALUE" == "None" ]]; then
      echo "⚠︎  $p no existe todavía – lo creo vacío (update más tarde)"
  fi

  aws ssm put-parameter \
      --name      "$p" \
      --type      SecureString \
      --overwrite \
      --key-id    "$KMS_ARN" \
      --value     "$VALUE"

  echo "✔︎  $p actualizado"
done

echo "🏁  Todos los parámetros securizados"



#SE LANZA ASÍ
#chmod +x update‑lince‑ssm‑secure.sh
#./update‑lince‑ssm‑secure.sh