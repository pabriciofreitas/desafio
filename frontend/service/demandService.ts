import { Demand, DemandStatus } from "../types/demand";
import api from "./api";

const initialDemands: Demand[] = [
  {
    id: "1",
    title: "Ajustar fluxo de aprovação",
    description: "Revisar a jornada de cadastro para reduzir fricção do usuário.",
    requester: "Pabricio",
    impact: 4,
    urgency: 5,
    priority: "Alta",
    status: "Pendente",
    createdAt: "2026-08-01",
  },
  {
    id: "2",
    title: "Melhorar relatório diário",
    description: "Incluir coluna de prioridade e filtro por solicitante.",
    requester: "Vitor",
    impact: 3,
    urgency: 3,
    priority: "Média",
    status: "Em andamento",
    createdAt: "2026-08-02",
  },
  {
    id: "3",
    title: "Corrigir alerta de e-mail",
    description: "Notificações estão sendo disparadas com dados incorretos.",
    requester: "Pabricio",
    impact: 2,
    urgency: 4,
    priority: "Média",
    status: "Concluída",
    createdAt: "2026-08-03",
  },
];

function computePriority(impact: number, urgency: number): Demand["priority"] {
  const score = impact + urgency;
  if (score >= 8) return "Alta";
  if (score >= 5) return "Média";
  return "Baixa";
}

function priorityLabelFromNumber(n: number) {
  if (n >= 8) return "Alta";
  if (n >= 5) return "Média";
  return "Baixa";
}

function mapBackendToDemand(row: any): Demand {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description,
    requester: row.requester,
    impact: row.impact,
    urgency: row.urgency,
    priority: typeof row.priority === "number" ? priorityLabelFromNumber(row.priority) : String(row.priority),
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
