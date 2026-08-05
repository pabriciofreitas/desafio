from typing import AsyncGenerator

import asyncpg

from .config import settings


pool: asyncpg.Pool | None = None


async def init_db_pool() -> None:
    global pool
    if pool is not None:
        return
    pool = await asyncpg.create_pool(
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        database=settings.DB_NAME,
        min_size=1,
        max_size=10,
    )
    async with pool.acquire() as conn:
        await conn.execute(
           """
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            CREATE TABLE IF NOT EXISTS demands (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                requester VARCHAR(150) NOT NULL,
                impact INTEGER NOT NULL CHECK (impact BETWEEN 1 AND 5),
                urgency INTEGER NOT NULL CHECK (urgency BETWEEN 1 AND 5),
                status VARCHAR(20) NOT NULL DEFAULT 'Pendente',
                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
            );

            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_update_demands'
                ) THEN
                    CREATE TRIGGER trg_update_demands
                    BEFORE UPDATE ON demands
                    FOR EACH ROW
                    EXECUTE FUNCTION update_updated_at_column();
                END IF;
            END;
            $$;
            """
        )


async def close_db_pool() -> None:
    global pool
    if pool is not None:
        await pool.close()
        pool = None


async def get_db() -> AsyncGenerator[asyncpg.Connection, None]:
    if pool is None:
        await init_db_pool()
    assert pool is not None
    async with pool.acquire() as connection:
        yield connection
