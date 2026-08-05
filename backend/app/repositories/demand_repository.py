from typing import Iterable
from uuid import UUID

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.demand import Demand


async def list_demands(
    session: AsyncSession,
    status: str | None = None,
    requester: str | None = None,
    impact: int | None = None,
) -> list[Demand]:
    statement = select(Demand)

    if status:
        statement = statement.where(Demand.status == status)
    if requester:
        statement = statement.where(Demand.requester == requester)
    if impact is not None:
        statement = statement.where(Demand.impact == impact)

    statement = statement.order_by(Demand.priority.desc(), Demand.created_at.desc())
    result = await session.execute(statement)
    return result.scalars().all()


async def get_demand(session: AsyncSession, demand_id: UUID) -> Demand | None:
    result = await session.execute(select(Demand).where(Demand.id == demand_id))
    return result.scalars().first()


async def create_demand(session: AsyncSession, demand_data: dict) -> Demand:
    demand = Demand(**demand_data)
    session.add(demand)
    await session.commit()
    await session.refresh(demand)
    return demand


async def update_demand(session: AsyncSession, demand: Demand, data: dict) -> Demand:
    for key, value in data.items():
        setattr(demand, key, value)

    await session.commit()
    await session.refresh(demand)
    return demand


async def update_demand_status(session: AsyncSession, demand: Demand, status: str) -> Demand:
    demand.status = status
    await session.commit()
    await session.refresh(demand)
    return demand


async def delete_demand(session: AsyncSession, demand: Demand) -> None:
    await session.delete(demand)
    await session.commit()


async def get_summary(session: AsyncSession) -> dict[str, int]:
    statement = select(
        func.count().label("total"),
        func.count().filter(Demand.status == "Pendente").label("pending"),
        func.count().filter(Demand.status == "Em andamento").label("in_progress"),
        func.count().filter(Demand.status == "Concluída").label("completed"),
        func.count().filter(Demand.status == "Cancelada").label("cancelled"),
    )

    result = await session.execute(statement)
    row = result.one()
    return {
        "total": int(row.total),
        "pending": int(row.pending),
        "in_progress": int(row.in_progress),
        "completed": int(row.completed),
        "cancelled": int(row.cancelled),
    }
