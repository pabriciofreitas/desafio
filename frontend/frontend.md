# Front-end MVP — ZEEWAY | Teste Técnico

## Objetivo

Desenvolver uma aplicação em **Next.js + React + TypeScript** para gerenciamento de demandas de produto, consumindo uma API em Python.

---

# Tecnologias Obrigatórias

- Next.js
- React.js
- TypeScript

---

# Funcionalidades Obrigatórias

## 1. Listagem de Demandas

Criar a tela principal contendo uma lista de demandas.

Cada item deve exibir:

- Título
- Solicitante (deixe 2 solicitante fixo no front, Pabricio e Vitor)
- Impacto
- Urgência
- Prioridade
- Status
- Data de criação

### Regras

- Ordenar automaticamente da maior prioridade para a menor.
- Caso não existam demandas, exibir um estado vazio.

---

## 2. Cadastro de Demanda

Criar um formulário para cadastrar uma nova demanda.

Campos obrigatórios:

- Título
- Descrição
- Solicitante
- Impacto (1 a 5)
- Urgência (1 a 5)

### Validações

Validar no Front-end:

- Todos os campos obrigatórios
- Impacto entre 1 e 5
- Urgência entre 1 e 5

Após cadastro:

- Atualizar a listagem.

---

## 3. Alteração de Status

Permitir alterar o status da demanda.

Status disponíveis:

- Pendente
- Em andamento
- Concluída
- Cancelada

Pode ser realizado através de:

- Select
ou
- Menu de ações

---

## 4. Filtros

Permitir filtrar por:

- Status
- Solicitante
- Impacto

Os filtros podem ser combinados.

---

## 5. Resumo

Exibir um painel contendo:

- Total de demandas
- Demandas pendentes
- Demandas em andamento
- Demandas concluídas

---

# Comunicação com API

Consumir os endpoints do Back-end para:

- Listar demandas
- Criar demanda
- Atualizar demanda
- Alterar status
- Remover demanda (caso implementado)

---

# Requisitos Técnicos

A aplicação deve possuir:

- Componentes organizados
- Código legível
- Interface minimamente responsiva
- Estados de carregamento (Loading)
- Tratamento de erros
- Estado vazio quando não houver resultados

---

# Estrutura Sugerida

```
src/
│
├── app/
│   ├── page.tsx
│   └── layout.tsx
│
├── components/
│   ├── SummaryCards.tsx
│   ├── DemandList.tsx
│   ├── DemandCard.tsx
│   ├── DemandForm.tsx
│   ├── Filters.tsx
│   └── EmptyState.tsx
│
├── services/
│   └── api.ts
│
├── types/
│   └── demand.ts
│
├── hooks/
│   └── useDemands.ts
│
└── utils/
```

---

# Fluxo da Aplicação

1. Carregar demandas da API.
2. Exibir resumo.
3. Exibir filtros.
4. Exibir lista ordenada por prioridade.
5. Cadastrar nova demanda.
6. Alterar status.
7. Atualizar interface.

---



# MVP Final

## Deve ser possível:

- Visualizar demandas
- Cadastrar demanda
- Alterar status
- Filtrar demandas
- Visualizar resumo
- Consumir API (faça inicialmente simulado)
- Exibir Loading
- Exibir mensagens de erro
- Exibir estado vazio
- Interface responsiva