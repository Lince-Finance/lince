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
# 2)  FRONTEND_URL (dev ↔︎ live)
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
# 3)  CMK exportado por core-infra
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
# 4)  Parámetros a securizar / actualizar
###############################################################################
PARAMS=(
  # ─── Cognito ───────────────────────────────────────────────────────────
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

  # ─── Advisor ───────────────────────────────────────────────────────────
  /lince/ADVISOR_OPENAI_API_KEY
  /lince/ADVISOR_SYSTEM_PROMPT
)

###############################################################################
# 5)  Re-graba cada parámetro como SecureString + CMK
###############################################################################
for p in "${PARAMS[@]}"; do
  if [[ "$p" == "/lince/FRONTEND_URL" ]]; then
    VALUE="$URL"                    # siempre sobre-escribimos
    echo "• $p ⇒ (override con FRONTEND_URL)"
  else
    # ¿Existe ya el parámetro?  (get-parameters admite --names)
    if aws ssm get-parameters --names "$p" --query 'Parameters' --output text | grep -q .; then
      VALUE=$(aws ssm get-parameter --name "$p" --with-decryption \
                 --query 'Parameter.Value' --output text)
      TYPE=$(aws ssm get-parameters --names "$p" \
                 --query 'Parameters[0].Type' --output text)
      VERSION=$(aws ssm get-parameter-history --name "$p" \
                 --query 'Parameters[-1].Version' --output text)
      echo "• $p ⇒ tipo=$TYPE versión=$VERSION"
    else
      echo "⚠︎  $p no existía – lo creo vacío (rellena después)"
      continue
    fi
  fi

  aws ssm put-parameter \
      --name   "$p" \
      --type   SecureString \
      --key-id "$KMS_ARN" \
      --overwrite \
      --value  "$VALUE"

  echo "✔︎  $p actualizado"
done

echo "🏁  Todos los parámetros securizados"

###############################################################################
# 6)  Uso
#   chmod +x update-lince-ssm-secure.sh
#   ./update-lince-ssm-secure.sh
###############################################################################
