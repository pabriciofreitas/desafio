import { Demand, DemandStatus } from "../types/demand";
import api from "./api";

function mapBackendToDemand(row: any): Demand {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description,
    requester: row.requester,
    impact: row.impact,
    urgency: row.urgency,
    priority: row.priority ,
    status: row.status,
    createdAt: (row.created_at || row.createdAt || new Date().toISOString()).slice(0, 10),
  } as Demand;
}

export async function listDemands(): Promise<Demand[]> {
  const rows = await api.get<any[]>("/demands/");
  return rows.map(mapBackendToDemand);
}

export async function createDemand(data: {
  title: string;
  description: string;
  requester: string;
  impact: number;
  urgency: number;
  status?: DemandStatus;
}): Promise<Demand> {
  const row = await api.post<any>("/demands/", {
    title: data.title,
    description: data.description,
    requester: data.requester,
    impact: data.impact,
    urgency: data.urgency,
    status: data.status,
  });
  return mapBackendToDemand(row);
}

export async function updateDemand(
  id: string,
  data: {
    title: string;
    description: string;
    requester: string;
    impact: number;
    urgency: number;
    status: DemandStatus;
    createdAt: string;
  }
): Promise<Demand> {
  const row = await api.put<any>(`/demands/${id}`, {
    title: data.title,
    description: data.description,
    requester: data.requester,
    impact: data.impact,
    urgency: data.urgency,
    status: data.status,
  });
  return mapBackendToDemand(row);
}

export async function updateDemandStatus(id: string, status: DemandStatus): Promise<{ id: string; status: DemandStatus }> {
  const row = await api.patch<any>(`/demands/${id}/status`, { status });
  return { id: String(row.id), status: row.status };
}

export async function deleteDemand(id: string): Promise<void> {
  await api.del(`/demands/${id}`);
  
}
