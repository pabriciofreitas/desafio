from fastapi import FastAPI

from .api.routes import router as demand_router

app = FastAPI(
    title="Zeeway Demand API",
    version="0.1.0",
    description="API REST para gerenciamento de demandas de produto.",
)

app.include_router(demand_router)
