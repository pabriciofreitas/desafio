# ZEEWAY | Teste Técnico

## Pessoa Desenvolvedora Full-Stack Pleno

**Prazo:** 1 dia

## Etapas

- **Etapa 1:** Desafio de código
- **Etapa 2:** Arquitetura sem código

As duas etapas são independentes: implementação e raciocínio sistêmico.

---

# Contexto

Na Zeeway, buscamos pessoas desenvolvedoras capazes de transformar uma necessidade de produto em uma solução funcional, tomando decisões técnicas com autonomia e mantendo atenção à experiência do usuário.

Neste desafio, você deverá construir uma pequena aplicação web para gerenciamento e priorização de demandas de produto.

O objetivo não é desenvolver um sistema completo ou extremamente sofisticado. Queremos entender sua capacidade de compreender um problema, definir uma solução adequada e entregar uma aplicação funcional de ponta a ponta.

O teste está dividido em duas etapas independentes:

- Entrega prática de código
- Etapa teórica de arquitetura (arquivo separado)

---

# Prazo

O prazo para realização do desafio é de **1 dia**.

## Orientação de escopo

Controle o escopo e priorize o que gera mais valor para o produto.

Caso não consiga implementar alguma funcionalidade, documente como ela seria desenvolvida.

---

# ETAPA 1 — Desafio Prático de Código

## Painel de Demandas de Produto

Uma equipe de produto precisa registrar, organizar e acompanhar solicitações de novas funcionalidades.

Cada demanda deverá conter:

- Título
- Descrição
- Solicitante
- Nível de impacto
- Nível de urgência
- Status
- Data de criação

Os níveis de impacto e urgência devem ser classificados de **1 a 5**.

## Cálculo da prioridade

```text
Prioridade = (Impacto × 2) + Urgência
```

Demandas com maior pontuação deverão aparecer primeiro por padrão.

---

# Funcionalidades Obrigatórias

## 1. Listagem de demandas

A tela principal deverá apresentar as demandas cadastradas.

Cada item deve exibir:

- Título
- Solicitante
- Impacto
- Urgência
- Pontuação de prioridade
- Status
- Data de criação

A listagem deve ser ordenada da maior prioridade para a menor.

---

## 2. Cadastro de demanda

O usuário deverá conseguir cadastrar uma nova demanda por meio de um formulário.

O formulário deverá possuir validações básicas:

- Front-end
- Back-end

---

## 3. Atualização de status

O usuário deverá conseguir alterar o status de uma demanda.

Status disponíveis:

- Pendente
- Em andamento
- Concluída
- Cancelada

---

## 4. Filtros

A aplicação deverá permitir filtrar por:

- Status
- Solicitante
- Impacto

---

## 5. Resumo do produto

A tela principal deverá apresentar:

- Total de demandas
- Quantidade de demandas pendentes
- Quantidade de demandas em andamento
- Quantidade de demandas concluídas

---

## 6. Persistência

As informações devem ser armazenadas em banco de dados.

Pode ser utilizado:

- SQLite
- PostgreSQL
- Outra opção devidamente justificada

---

# Requisitos Técnicos

## Front-end

Desenvolver utilizando:

- Next.js
- React.js
- TypeScript

Espera-se encontrar:

- Componentes organizados
- Comunicação adequada com a API
- Estados de carregamento
- Tratamento de erros
- Estado vazio para listas sem resultados
- Interface minimamente responsiva
- Código legível e de fácil manutenção

A biblioteca de componentes é livre.

---

## Back-end

Desenvolver em **Python**.

Framework livre, por exemplo:

- FastAPI
- Django
- Flask

A API deverá disponibilizar operações para:

- Criar demanda
- Listar demandas
- Consultar demanda
- Atualizar demanda
- Alterar status
- Remover demanda

Espera-se encontrar:

- Organização clara do projeto
- Validação dos dados
- Tratamento de erros
- Separação de responsabilidades
- Regras de negócio no back-end
- Cálculo da prioridade realizado no servidor

---

# Arquitetura

A solução deve seguir uma abordagem de **monólito**.

Priorizar:

- Simplicidade
- Coesão
- Facilidade de evolução

Não é necessário utilizar:

- Microsserviços
- Filas
- Infraestrutura complexa

Explique brevemente a estrutura escolhida no README.

---

# Git

O projeto deverá estar em um repositório Git.

Espera-se:

- Commits com mensagens claras
- Histórico demonstrando evolução
- Ausência de credenciais
- `.gitignore` configurado corretamente

Evite realizar todo o desenvolvimento em apenas um commit.

---

# Testes

Implemente ao menos:

- Um teste da regra de cálculo da prioridade
- Um teste de endpoint ou serviço do back-end

Testes adicionais são diferenciais.

---

# Uso de Inteligência Artificial

O uso de IA é permitido e incentivado.

Exemplos:

- ChatGPT
- Claude
- Cursor
- GitHub Copilot

Inclua no README:

- Ferramentas utilizadas
- Em quais partes ajudaram
- Como o código foi revisado

---

# Diferenciais

Itens opcionais:

- Paginação
- Busca por título ou descrição
- Ordenação configurável
- Atualização otimista da interface
- Docker ou Docker Compose
- Documentação automática da API
- Testes de front-end
- Histórico de alterações de status
- Deploy
- Uso de Elixir

Caso utilize Elixir, explique a decisão.

Também será considerado diferencial descrever no README como desenvolveria o back-end utilizando Elixir.

---

# Entrega da Etapa 1

Enviar:

- Link do repositório
- Instruções para execução local
- README
- Link da aplicação publicada (caso exista)

## README deve conter

1. Descrição da solução
2. Tecnologias utilizadas
3. Instalação e execução
4. Decisões técnicas
5. Limitações conhecidas
6. Melhorias futuras
7. Ferramentas de IA utilizadas
8. Tempo dedicado

---

# Observações

- Não esperamos uma aplicação perfeita.
- Não é necessário implementar autenticação completa.
- Não é necessário infraestrutura de produção.
- Bibliotecas externas podem ser utilizadas.
- Decisões simples e bem justificadas são preferíveis.
- Priorize uma solução funcional, clara e bem documentada.

---
