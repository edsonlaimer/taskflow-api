# TaskFlow API

API REST simples de lista de tarefas (to-do list), usada como projeto de exemplo na disciplina **DevOps na Prática — Fase 1: Configuração e Automação Inicial**.

## Stack

- Node.js + Express
- Jest + Supertest (testes automatizados)
- ESLint (padronização de código)
- Docker (empacotamento da aplicação)
- GitHub Actions (integração contínua)
- Terraform (infraestrutura como código, provedor AWS)

## Endpoints

| Método | Rota          | Descrição                       |
|--------|---------------|----------------------------------|
| GET    | /health       | Health check                    |
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

## Docker

```bash
docker build -t taskflow-api .
docker run -p 3000:3000 taskflow-api
```

## Integração Contínua (CI)

O pipeline em `.github/workflows/ci.yml` roda automaticamente a cada `push` ou `pull request` para a branch `main` e executa, em sequência: instalação de dependências, lint, testes automatizados e build da imagem Docker. Qualquer falha em uma dessas etapas barra a integração do código.

## Infraestrutura como Código (IaC)

Os scripts em `infra/` usam Terraform para provisionar, na AWS, uma instância EC2 com Docker instalado, pronta para executar o container da aplicação, além do security group necessário. Para provisionar:

```bash
cd infra
terraform init
terraform plan
terraform apply
```
