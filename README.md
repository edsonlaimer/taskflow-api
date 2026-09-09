# TaskFlow API

API REST simples de lista de tarefas (to-do list), usada como projeto de exemplo na disciplina **DevOps na Prática**.

## Stack

- Node.js + Express
- Jest + Supertest (testes automatizados)
- ESLint (padronização de código)
- Docker + Docker Compose (empacotamento e orquestração)
- GitHub Actions (CI/CD)
- Terraform (infraestrutura como código, provedor AWS)

## Endpoints

| Método | Rota          | Descrição                       |
|--------|---------------|----------------------------------|
| GET    | /health       | Health check (com uptime)       |
| GET    | /tasks        | Lista todas as tarefas          |
| POST   | /tasks        | Cria uma nova tarefa            |
| PATCH  | /tasks/:id    | Atualiza uma tarefa existente   |
| DELETE | /tasks/:id    | Remove uma tarefa               |

## Rodando localmente

```bash
npm install
npm start        # inicia a API em http://localhost:3000
npm run lint      # roda o linter
npm test          # roda os testes automatizados com cobertura
```

## Integração Contínua (CI)

O job `build-and-test`, em `.github/workflows/ci.yml`, roda automaticamente a cada `push` ou `pull request` para a branch `main` e executa, em sequência: instalação de dependências, lint, testes automatizados e build da imagem Docker. Qualquer falha em uma dessas etapas barra a integração do código.

## Entrega Contínua (CD)

O job `publish-image`, no mesmo workflow, roda somente após o `build-and-test` passar e apenas em pushes reais na `main` (não em pull requests). Ele publica a imagem Docker no GitHub Container Registry (GHCR) com duas tags: `latest` e o SHA do commit, garantindo rastreabilidade de qual versão do código gerou cada imagem.

## Containers e Orquestração

- `Dockerfile`: empacota a aplicação em uma imagem Node.js Alpine.
- `docker-compose.yml`: orquestra o container em execução — mapeia a porta 3000, define política de restart automático (`unless-stopped`) e um healthcheck que consulta `/health` periodicamente.

Rodando localmente com Compose:

```bash
docker compose up -d --build
```

## Deploy

`deploy.sh` automatiza o deploy na instância que hospeda a aplicação: autentica no GHCR, baixa a imagem mais recente publicada pelo CD e sobe o container via `docker compose`, validando ao final que a aplicação respondeu em `/health`.

```bash
export GHCR_TOKEN=seu_token_com_permissao_read:packages
./deploy.sh
```

## Monitoramento e Logging

Cada requisição é registrada em formato estruturado (JSON) no `stdout` da aplicação — método, rota, status HTTP e tempo de resposta — servindo de base para coleta de logs e observabilidade. O endpoint `/health` retorna também o `uptime_s` do processo, um sinal básico de monitoramento.

## Infraestrutura como Código (IaC)

Os scripts em `infra/` usam Terraform para provisionar, na AWS, uma instância EC2 com Docker instalado, pronta para executar o container da aplicação, além do security group necessário. Para provisionar:

```bash
cd infra
terraform init
terraform plan
terraform apply
```
