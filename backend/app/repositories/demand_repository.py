from uuid import uuid4, UUID

from asyncpg import Connection


async def list_demands(
    connection: Connection,
    status: str | None = None,
    requester: str | None = None,
    impact: int | None = None,
) -> list[dict]:
    query = [
        "SELECT",
        "  id,",
        "  title,",
        "  description,",
        "  requester,",
        "  impact,",
        "  urgency,",
        "  status,",
        "  created_at,",
        "  updated_at,",
        "  impact * 2 + urgency AS priority",
        "FROM demands",
    ]
    args: list = []
    conditions: list[str] = []

    if status:
        conditions.append(f"status = ${len(args) + 1}")
        args.append(status)
    if requester:
        conditions.append(f"requester = ${len(args) + 1}")
        args.append(requester)
    if impact is not None:
        conditions.append(f"impact = ${len(args) + 1}")
        args.append(impact)

    if conditions:
        query.append("WHERE " + " AND ".join(conditions))

    query.append("ORDER BY priority DESC, created_at DESC")
    sql = "\n".join(query)
    rows = await connection.fetch(sql, *args)
    return [dict(row) for row in rows]


async def get_demand(connection: Connection, demand_id: UUID) -> dict | None:
    row = await connection.fetchrow(
        """
        SELECT
          id,
          title,
          description,
          requester,
          impact,
          urgency,
          status,
          created_at,
          updated_at,
          impact * 2 + urgency AS priority
        FROM demands
        WHERE id = $1
        """,
        demand_id,
    )
    return dict(row) if row else None


async def create_demand(connection: Connection, demand_data: dict) -> dict:
    row = await connection.fetchrow(
        """
        INSERT INTO demands (
          id,
          title,
          description,
          requester,
          impact,
          urgency,
          status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
          id,
          title,
          description,
          requester,
          impact,
          urgency,
          status,
          created_at,
          updated_at,
          impact * 2 + urgency AS priority
        """,
        uuid4(),
        demand_data["title"],
        demand_data["description"],
        demand_data["requester"],
        demand_data["impact"],
        demand_data["urgency"],
        demand_data.get("status", "Pendente"),
    )
    return dict(row)


async def update_demand(connection: Connection, demand_id: UUID, data: dict) -> dict | None:
    row = await connection.fetchrow(
        """
        UPDATE demands
        SET
          title = $1,
          description = $2,
          requester = $3,
          impact = $4,
          urgency = $5,
          status = $6,
          updated_at = now()
        WHERE id = $7
        RETURNING
          id,
          title,
          description,
          requester,
          impact,
          urgency,
          status,
          created_at,
          updated_at,
          impact * 2 + urgency AS priority
        """,
        data["title"],
        data["description"],
        data["requester"],
        data["impact"],
        data["urgency"],
        data["status"],
        demand_id,
    )
    return dict(row) if row else None


async def update_demand_status(connection: Connection, demand_id: UUID, status: str) -> dict | None:
    row = await connection.fetchrow(
        """
        UPDATE demands
        SET
          status = $1,
          updated_at = now()
        WHERE id = $2
        RETURNING
          id,
          title,
          description,
          requester,
          impact,
          urgency,
          status,
          created_at,
          updated_at,
          impact * 2 + urgency AS priority
        """,
        status,
        demand_id,
    )
    return dict(row) if row else None


async def delete_demand(connection: Connection, demand_id: UUID) -> None:
    await connection.execute("DELETE FROM demands WHERE id = $1", demand_id)


async def get_summary(connection: Connection) -> dict[str, int]:
    row = await connection.fetchrow(
        """
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'Pendente')::int AS pending,
          COUNT(*) FILTER (WHERE status = 'Em andamento')::int AS in_progress,
          COUNT(*) FILTER (WHERE status = 'Concluída')::int AS completed,
          COUNT(*) FILTER (WHERE status = 'Cancelada')::int AS cancelled
        FROM demands
        """,
    )
    return dict(row)
