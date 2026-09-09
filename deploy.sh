#!/usr/bin/env bash
# Script de deploy do TaskFlow API.
#
# Uso na instância que hospeda a aplicação (ex.: a EC2 provisionada pelo Terraform
# em infra/). Assume que o Docker e o Docker Compose já estão instalados
# (ver infra/main.tf, que instala o Docker via user_data).
#
# O que este script faz:
#   1. Autentica no GitHub Container Registry (GHCR).
#   2. Baixa (pull) a imagem mais recente publicada pelo pipeline de CD.
#   3. Sobe (ou substitui) o container em execução via docker-compose.
#   4. Confirma que a aplicação respondeu no /health após o restart.

set -euo pipefail

IMAGE="ghcr.io/edsonlaimer/taskflow-api:latest"
HEALTH_URL="http://localhost:3000/health"
MAX_RETRIES=10

echo "==> Autenticando no GHCR..."
# GHCR_TOKEN deve ser um token com permissão read:packages, exportado como variável
# de ambiente ou passado como secret do GitHub Actions ao chamar este script.
echo "${GHCR_TOKEN:?defina a variável GHCR_TOKEN antes de rodar este script}" \
  | docker login ghcr.io -u edsonlaimer --password-stdin

echo "==> Baixando a imagem mais recente: ${IMAGE}"
docker pull "${IMAGE}"

echo "==> Subindo o container com docker-compose..."
IMAGE="${IMAGE}" docker compose up -d --force-recreate

echo "==> Aguardando a aplicação responder em ${HEALTH_URL}..."
for i in $(seq 1 "${MAX_RETRIES}"); do
  if curl -fsS "${HEALTH_URL}" > /dev/null; then
    echo "==> Deploy concluído com sucesso. Aplicação saudável."
    exit 0
  fi
  echo "Aguardando aplicação subir... (tentativa ${i}/${MAX_RETRIES})"
  sleep 3
done

echo "==> ERRO: aplicação não respondeu em /health após o deploy." >&2
exit 1
