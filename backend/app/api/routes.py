from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_async_session
from ..schemas.demand import (
    DemandCreate,
    DemandRead,
    DemandStatusUpdate,
    DemandSummary,
    DemandUpdate,
)
from ..services.demand_service import (
    NotFoundError,
    change_status,
    create_demand,
    delete_demand,
    get_demand,
    get_demands,
    get_summary,
    update_demand,
)

router = APIRouter(prefix="/demands", tags=["demands"])


@router.get("/", response_model=list[DemandRead])
async def list_demands(
    status: str | None = None,
    requester: str | None = None,
    impact: int | None = None,
    session: AsyncSession = Depends(get_async_session),
):
    return await get_demands(session, status=status, requester=requester, impact=impact)


@router.get("/{demand_id}", response_model=DemandRead)
async def retrieve_demand(demand_id: UUID, session: AsyncSession = Depends(get_async_session)):
    try:
        return await get_demand(session, demand_id)
    except NotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error))


@router.post("/", response_model=DemandRead, status_code=status.HTTP_201_CREATED)
async def create_new_demand(demand_create: DemandCreate, session: AsyncSession = Depends(get_async_session)):
    return await create_demand(session, demand_create)


@router.put("/{demand_id}", response_model=DemandRead)
async def update_existing_demand(
    demand_id: UUID,
    demand_update: DemandUpdate,
    session: AsyncSession = Depends(get_async_session),
):
    try:
        return await update_demand(session, demand_id, demand_update)
    except NotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error))


@router.patch("/{demand_id}/status", response_model=DemandRead)
async def patch_demand_status(
    demand_id: UUID,
    status_update: DemandStatusUpdate,
    session: AsyncSession = Depends(get_async_session),
):
    try:
        return await change_status(session, demand_id, status_update)
    except NotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error))


@router.delete("/{demand_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_demand(demand_id: UUID, session: AsyncSession = Depends(get_async_session)):
    try:
        await delete_demand(session, demand_id)
    except NotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error))


@router.get("/summary", response_model=DemandSummary)
async def demands_summary(session: AsyncSession = Depends(get_async_session)):
    return await get_summary(session)
