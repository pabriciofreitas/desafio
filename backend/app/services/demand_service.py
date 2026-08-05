from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from ..repositories.demand_repository import (
    create_demand as repo_create_demand,
    delete_demand as repo_delete_demand,
    get_demand as repo_get_demand,
    get_summary as repo_get_summary,
    list_demands as repo_list_demands,
    update_demand as repo_update_demand,
    update_demand_status as repo_update_demand_status,
)
from ..schemas.demand import DemandCreate, DemandStatusUpdate, DemandUpdate


class NotFoundError(Exception):
    pass


def calculate_priority(impact: int, urgency: int) -> int:
    return impact * 2 + urgency


async def get_demands(
    session: AsyncSession,
    status: str | None = None,
    requester: str | None = None,
    impact: int | None = None,
):
    return await repo_list_demands(session, status=status, requester=requester, impact=impact)


async def get_demand(session: AsyncSession, demand_id: UUID):
    demand = await repo_get_demand(session, demand_id)
    if not demand:
        raise NotFoundError("Demanda não encontrada")
    return demand


async def create_demand(session: AsyncSession, demand_create: DemandCreate):
    demand_data = {
        "title": demand_create.title,
        "description": demand_create.description,
        "requester": demand_create.requester,
        "impact": demand_create.impact,
        "urgency": demand_create.urgency,
        "status": "Pendente",
    }
    return await repo_create_demand(session, demand_data)


async def update_demand(session: AsyncSession, demand_id: UUID, demand_update: DemandUpdate):
    demand = await repo_get_demand(session, demand_id)
    if not demand:
        raise NotFoundError("Demanda não encontrada")

    return await repo_update_demand(session, demand, demand_update.model_dump())


async def change_status(session: AsyncSession, demand_id: UUID, status_data: DemandStatusUpdate):
    demand = await repo_get_demand(session, demand_id)
    if not demand:
        raise NotFoundError("Demanda não encontrada")

    return await repo_update_demand_status(session, demand, status_data.status)


async def delete_demand(session: AsyncSession, demand_id: UUID) -> None:
    demand = await repo_get_demand(session, demand_id)
    if not demand:
        raise NotFoundError("Demanda não encontrada")
    await repo_delete_demand(session, demand)


async def get_summary(session: AsyncSession) -> dict[str, int]:
    return await repo_get_summary(session)
