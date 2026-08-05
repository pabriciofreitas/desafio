-- Cria o banco se ainda não existir
CREATE DATABASE desafiozeeway;

-- Conecte no banco antes de executar os próximos comandos:
-- \c desafiozeeway

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS demands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requester VARCHAR(150) NOT NULL,
    impact INTEGER NOT NULL CHECK (impact BETWEEN 1 AND 5),
    urgency INTEGER NOT NULL CHECK (urgency BETWEEN 1 AND 5),
    priority INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pendente' CHECK (
        status IN ('Pendente','Em andamento','Concluída','Cancelada')
    ),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_demands ON demands;
CREATE TRIGGER trg_update_demands
BEFORE UPDATE ON demands
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

INSERT INTO demands (
    title,
    description,
    requester,
    impact,
    urgency,
    priority,
    status
) VALUES
(
    'Implementar Login',
    'Adicionar autenticação de usuários via email/senha.',
    'Pabricio',
    5,
    4,
    14,
    'Pendente'
),
(
    'Dashboard de Relatórios',
    'Criar gráficos e filtros para relatório de demandas.',
    'Julia',
    4,
    3,
    11,
    'Em andamento'
),
(
    'Exportar em PDF',
    'Permitir exportar lista de demandas em PDF.',
    'Vitor',
    3,
    2,
    8,
    'Concluída'
),
(
    'Ajustar prioridade',
    'Implementar lógica de prioridade automática.',
    'Ana',
    2,
    5,
    9,
    'Pendente'
);