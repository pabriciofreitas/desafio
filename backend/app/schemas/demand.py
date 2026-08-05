import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

DemandStatus = Literal["Pendente", "Em andamento", "Concluída", "Cancelada"]


class DemandBase(BaseModel):
    title: str = Field(..., min_length=3)
    description: str = Field(..., min_length=1)
    requester: str = Field(..., min_length=1)
    impact: int = Field(..., ge=1, le=5)
    urgency: int = Field(..., ge=1, le=5)


class DemandCreate(DemandBase):
    status: DemandStatus


class DemandUpdate(DemandBase):
    status: DemandStatus


class DemandStatusUpdate(BaseModel):
    status: DemandStatus


class DemandRead(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    requester: str
    impact: int
    urgency: int
    priority: int
    status: DemandStatus
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class DemandSummary(BaseModel):
    total: int
    pending: int
    in_progress: int
    completed: int
    cancelled: int
