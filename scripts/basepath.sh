#!/usr/bin/env bash
DOMAIN="auth.lince.zone"

echo "🔍 Buscando $DOMAIN en todas las regiones…"
REGIONS=$(aws ec2 describe-regions --query 'Regions[].RegionName' --output text)

for r in $REGIONS; do
  # ---- REST / API Gateway v1 -----------------------------------------------
  REST_MATCH=$(aws apigateway get-domain-names \
                 --region "$r" \
                 --query "items[?domainName=='${DOMAIN}'].domainName" \
                 --output text 2>/dev/null)

  if [[ "$REST_MATCH" == "$DOMAIN" ]]; then
    echo "• Encontrado en $r (REST v1)"
  fi

  # ---- HTTP/WebSocket / API Gateway v2 -------------------------------------
  HTTP_MATCH=$(aws apigatewayv2 get-domain-names \
                 --region "$r" \
                 --query "Items[?DomainName=='${DOMAIN}'].DomainName" \
                 --output text 2>/dev/null)

  if [[ "$HTTP_MATCH" == "$DOMAIN" ]]; then
    echo "• Encontrado en $r (HTTP/WebSocket v2)"
  fi
done
