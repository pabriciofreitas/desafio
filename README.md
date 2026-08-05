# Zeeway Demand Manager

Aplicação de gerenciamento de demandas de produto, com front-end em Next.js e back-end em FastAPI.

## Descrição

Painel de demandas que permite cadastrar, listar, filtrar, atualizar status e excluir demandas. A prioridade é calculada no servidor usando a fórmula:

```text
Prioridade = (Impacto × 2) + Urgência
```

A aplicação exibe demandas ordenadas da maior prioridade para a menor e oferece resumo com totais por status.

## Tecnologias utilizadas

- Front-end: Next.js, React, TypeScript, Tailwind CSS
- Back-end: Python, FastAPI, asyncpg
- Banco de dados: PostgreSQL local
- Ferramentas de teste: pytest, pytest-asyncio

## Estrutura do projeto

- `/backend`: implementação da API Python
- `/frontend`: aplicação Next.js
- `/backend/app`: código FastAPI, schemas, serviços e rotas
- `/frontend/app`: interface e componentes React

## Instalação

### 1. Banco de dados

Crie um banco PostgreSQL local e configure as variáveis de ambiente no diretório `backend`.

Exemplo de `.env` em `backend/`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=desafiozeeway
DB_USER=postgres
DB_PASSWORD=sua_senha
APP_HOST=0.0.0.0
APP_PORT=8000
DEBUG=true
```

### 2. Back-end

Entre na pasta `backend` e instale as dependências:

```bash
cd backend
python -m pip install -r requirements.txt
```

### 3. Front-end

Entre na pasta `frontend` e instale as dependências:

```bash
cd frontend
npm install
```

### 4. Variáveis do front-end

Crie `frontend/.env.local` com a URL da API:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Execução local

### Iniciar back-end

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Iniciar front-end

```bash
cd frontend
npm run dev
```

Acesse a aplicação em `http://localhost:3000`.

## Endpoints disponíveis

- `GET /demands/` - lista demandas
- `GET /demands/{id}` - consulta demanda
- `POST /demands/` - cria demanda
- `PUT /demands/{id}` - atualiza demanda
- `PATCH /demands/{id}/status` - altera status
- `DELETE /demands/{id}` - exclui demanda
- `GET /summary` - resumo de demandas

## Decisões técnicas

- Usei PostgreSQL local para persistência, em vez de um banco remoto, para evitar dependências de rede e problemas de DNS/IPv6.
- A API usa `asyncpg` e SQL puro.
- A prioridade é calculada no backend e retornada como número para a UI.
- O front-end consome a API via `frontend/service/api.ts` e mantém estado de carregamento e erro.

## Limitações conhecidas

- Não há autenticação
- Não há paginação nem busca por texto
- Não há testes de front-end implementados
- A UI é básica, mas responsiva em telas comuns

## Melhorias futuras

- Adicionar busca por título/descrição
- Adicionar paginação e ordenação configurável
- Adicionar testes de componente React
- Adicionar Docker / Docker Compose
- Adicionar histórico de alterações de status
- Implementar deploy automatizado

## Testes

### Back-end

Execute:

```bash
cd backend
python -m pytest
```

### Casos cobertos

- Regra de cálculo de prioridade
- Endpoint de criação de demanda

## Ferramentas de IA utilizadas

- ChatGPT / GitHub Copilot para suporte na escrita de código, ajustes de front-end e criação da documentação.

## Tempo dedicado

Aproximadamente  4h de desenvolvimento, priorizando funcionalidade funcional e clareza do código.
