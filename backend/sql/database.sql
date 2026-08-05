-- =====================================================
-- ZEEWAY - Banco de Dados
-- PostgreSQL
-- =====================================================

CREATE DATABASE desafiozeeway;

-- Conectar no banco antes de executar os comandos abaixo
-- \c desafiozeeway


-- UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- =====================================================
-- Tabela de Demandas
-- =====================================================

CREATE TABLE demands (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    title VARCHAR(255) NOT NULL,

    description TEXT NOT NULL,

    requester VARCHAR(150) NOT NULL,

    impact INTEGER NOT NULL
        CHECK (impact BETWEEN 1 AND 5),

    urgency INTEGER NOT NULL
        CHECK (urgency BETWEEN 1 AND 5),

    priority INTEGER NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'Pendente'
        CHECK (
            status IN (
                'Pendente',
                'Em andamento',
                'Concluída',
                'Cancelada'
            )
        ),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW()

);


-- =====================================================
-- Índices
-- =====================================================

CREATE INDEX idx_demands_priority
ON demands(priority DESC);

CREATE INDEX idx_demands_status
ON demands(status);

CREATE INDEX idx_demands_requester
ON demands(requester);

CREATE INDEX idx_demands_impact
ON demands(impact);

CREATE INDEX idx_demands_created_at
ON demands(created_at DESC);


-- =====================================================
-- Atualização automática do updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()

RETURNS TRIGGER AS
$$

BEGIN

    NEW.updated_at = NOW();

    RETURN NEW;

END;

$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_update_demands

BEFORE UPDATE

ON demands

FOR EACH ROW

EXECUTE FUNCTION update_updated_at_column();


-- =====================================================
-- Dados iniciais (opcional)
-- =====================================================

INSERT INTO demands
(
    title,
    description,
    requester,
    impact,
    urgency,
    priority,
    status
)
VALUES
(
    'Implementar Login',
    'Adicionar autenticação de usuários.',
    'Pabricio',
    5,
    5,
    15,
    'Pendente'
),
(
    'Tela de Relatórios',
    'Criar dashboard de relatórios.',
    'Pabricio',
    4,
    3,
    11,
    'Em andamento'
),
(
    'Exportar PDF',
    'Permitir exportação dos dados.',
    'Vitor',
    3,
    2,
    8,
    'Concluída'
);