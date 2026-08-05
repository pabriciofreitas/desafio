# Back-end MVP — ZEEWAY | Teste Técnico

## Objetivo

Desenvolver uma API REST utilizando **Python + FastAPI** responsável pelo gerenciamento das demandas de produto.

Toda a regra de negócio, validações e persistência deverão ser realizadas no Back-end.

---

# Stack da Aplicação

## Linguagem

- Python 3.12+

## Framework

- FastAPI

## Banco de Dados

- PostgreSQL

## ORM

- SQLAlchemy 2.x

## Validação

- Pydantic v2

## Servidor

- Uvicorn

## Testes

- Pytest

---

# Regras de Negócio

Cada demanda deverá possuir os seguintes campos:

| Campo | Tipo | Obrigatório |
|--------|------|-------------|
| id | UUID | Sim |
| title | VARCHAR(255) | Sim |
| description | TEXT | Sim |
| requester | VARCHAR(150) | Sim |
| impact | INTEGER | Sim |
| urgency | INTEGER | Sim |
| priority | INTEGER | Sim |  NÃO PRECISA SER SALVO NO BANCO PODE SER CALCULADO NA HORA DA CONSULTA
| status | VARCHAR(20) | Sim |
| created_at | TIMESTAMP | Sim |
| updated_at | TIMESTAMP | Sim |

---

# Regra da Prioridade

A prioridade **não poderá ser enviada pelo Front-end**.

Ela será calculada exclusivamente pelo servidor.

```text
Prioridade = (Impacto × 2) + Urgência
```

Exemplo

```
Impacto = 5
Urgência = 4

Prioridade = 14
```

Sempre que impacto ou urgência forem alterados, a prioridade deverá ser recalculada.

---

# Validações

## Title

- obrigatório
- mínimo 3 caracteres

## Description

- obrigatório

## Requester

- obrigatório

## Impact

- inteiro
- mínimo 1
- máximo 5

## Urgency

- inteiro
- mínimo 1
- máximo 5

## Status

Valores permitidos:

- Pendente
- Em andamento
- Concluída
- Cancelada

---

# Endpoints Obrigatórios

## Listar demandas

```
GET /demands
```

Filtros opcionais

```
status
requester
impact
```

As demandas deverão ser retornadas ordenadas por:

```
priority DESC
created_at DESC
```

---

## Buscar demanda

```
GET /demands/{id}
```

---

## Criar demanda

```
POST /demands
```

O servidor deverá:

- validar os dados
- calcular prioridade
- definir status inicial = Pendente
- gerar created_at

---

## Atualizar demanda

```
PUT /demands/{id}
```

Campos permitidos:

- title
- description
- requester
- impact
- urgency

Sempre recalcular prioridade.

---

## Alterar Status

```
PATCH /demands/{id}/status
```

---

## Excluir Demanda

```
DELETE /demands/{id}
```

---

## Resumo

```
GET /demands/summary
```

Resposta

```json
{
    "total": 10,
    "pending": 4,
    "in_progress": 3,
    "completed": 2,
    "cancelled": 1
}
```

---

# Estrutura do Projeto

```
backend/
│
├── app/
│   ├── main.py
│   │
│   ├── core/
│   │     ├── config.py
│   │     └── database.py
│   │
│   ├── models/
│   │     └── demand.py
│   │
│   ├── schemas/
│   │     └── demand.py
│   │
│   ├── repositories/
│   │     └── demand_repository.py
│   │
│   ├── services/
│   │     └── demand_service.py
│   │
│   ├── api/
│   │     └── routes.py
│   │
│   └── tests/
│         ├── test_priority.py
│         └── test_routes.py
│
├── requirements.txt
│
└── sql/
      └── database.sql
```

---

# Responsabilidades

## Routes

- Receber requisições
- Validar entrada
- Chamar Services

---

## Services

- Regras de negócio
- Cálculo da prioridade
- Resumo
- Atualizações

---

## Repository

- Comunicação com PostgreSQL

---

## Models

- Mapeamento SQLAlchemy

---

## Schemas

- Validação utilizando Pydantic

---

# Tratamento de Erros

Retornar corretamente:

- 200
- 201
- 204
- 400
- 404
- 422
- 500

---

# Testes Obrigatórios

## Teste da regra de prioridade

```
(impact * 2) + urgency
```

---

## Teste de endpoint

```
POST /demands
```

Validar:

- HTTP 201
- prioridade calculada
- status inicial = Pendente

---

# Documentação

Disponibilizar automaticamente:

```
/docs
```

```
/redoc
```

---

# MVP Final

A API deverá permitir:

- Criar demanda
- Listar demandas
- Buscar demanda
- Atualizar demanda
- Alterar status
- Excluir demanda
- Filtrar demandas
- Calcular prioridade no servidor
- Persistir dados no PostgreSQL
- Retornar resumo do dashboard
- Documentação automática
- Testes básicos             