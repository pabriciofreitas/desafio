import os

os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///:memory:")

import pytest
from fastapi import status as http_status
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.database import Base, get_async_session
from app.main import app


@pytest.fixture(scope="session")
async def engine():
    engine = create_async_engine(os.environ["DATABASE_URL"], future=True, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest.fixture
async def async_session(engine):
    session_factory = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    yield session_factory


@pytest.fixture(autouse=True)
def override_get_async_session(async_session):
    async def _override() -> AsyncSession:
        async with async_session() as session:
            yield session

    app.dependency_overrides[get_async_session] = _override
    yield
    app.dependency_overrides.pop(get_async_session, None)


@pytest.mark.asyncio
async def test_create_demand_endpoint():
    payload = {
        "title": "Teste de criação",
        "description": "Criar uma demanda via endpoint.",
        "requester": "Pabricio",
        "impact": 5,
        "urgency": 4,
    }

    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/demands/", json=payload)

    assert response.status_code == http_status.HTTP_201_CREATED
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["requester"] == payload["requester"]
    assert data["status"] == "Pendente"
    assert data["priority"] == 14
    assert "id" in data
