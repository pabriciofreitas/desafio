import uuid
from datetime import datetime

from sqlalchemy import CheckConstraint, Column, DateTime, Integer, String, Text, func, UUID
from sqlalchemy.orm import Mapped, mapped_column, column_property

from ..core.database import Base

ALLOWED_STATUS = ("Pendente", "Em andamento", "Concluída", "Cancelada")


class Demand(Base):
    __tablename__ = "demands"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    requester: Mapped[str] = mapped_column(String(150), nullable=False)
    impact: Mapped[int] = mapped_column(Integer, nullable=False)
    urgency: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, server_default="Pendente")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    priority: Mapped[int] = column_property((impact * 2) + urgency)

    __table_args__ = (
        CheckConstraint("impact BETWEEN 1 AND 5", name="check_impact_range"),
        CheckConstraint("urgency BETWEEN 1 AND 5", name="check_urgency_range"),
        CheckConstraint(
            "status IN ('Pendente','Em andamento','Concluída','Cancelada')",
            name="check_status",
        ),
    )
