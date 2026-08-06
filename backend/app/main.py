import os
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from asyncpg import Connection

from .api.routes import router as demand_router
from .core.database import close_db_pool, get_db, init_db_pool

app = FastAPI(
    title="Zeeway Demand API",
    version="0.1.0",
    description="API REST para gerenciamento de demandas de produto.",
)

# Configure CORS
origins = [o for o in [os.getenv("FRONTEND_URL")] if o]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(demand_router)


@app.on_event("startup")
async def startup_event() -> None:
    await init_db_pool()


@app.on_event("shutdown")
async def shutdown_event() -> None:
    await close_db_pool()


@app.get("/")
async def read_root(connection: Connection = Depends(get_db)):
    value = await connection.fetchval("SELECT 1")
    return {"conexao_ok": value == 1}
