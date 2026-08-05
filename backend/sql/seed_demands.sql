-- Script de seed para demandas padrão
-- Execute após criar a tabela demands no banco local

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO demands (
    title,
    description,
    requester,
    impact,
    urgency,
    status,
    created_at,
    updated_at
) VALUES
(
    'Implementar login',
    'Adicionar autenticação de usuários com email e senha.',
    'Pabricio',
    5,
    4,
    'Pendente',
    NOW(),
    NOW()
),
(
    'Dashboard de relatórios',
    'Criar tela de relatórios com filtros e gráficos.',
    'Julia',
    4,
    3,
    'Em andamento',
    NOW(),
    NOW()
),
(
    'Exportar em PDF',
    'Permitir exportação das demandas em PDF.',
    'Vitor',
    3,
    2,
    'Concluída',
    NOW(),
    NOW()
),
(
    'Ajustar sintonia de prioridade',
    'Validar cálculo de prioridade automaticamente no backend.',
    'Ana',
    2,
    5,
    'Pendente',
    NOW(),
    NOW()
);
