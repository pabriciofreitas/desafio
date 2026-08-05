import { Demand, DemandStatus } from "../types/demand";
import { simulateHttp } from "./api";

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

export async function listDemands(): Promise<Demand[]> {
  return simulateHttp(initialDemands.map((item) => ({ ...item })));
}

export async function createDemand(data: {
  title: string;
  description: string;
  requester: string;
  impact: number;
  urgency: number;
}): Promise<Demand> {
  const newDemand: Demand = {
    id: String(Date.now()),
    title: data.title,
    description: data.description,
    requester: data.requester as "Pabricio" | "Vitor",
    impact: data.impact,
    urgency: data.urgency,
    priority: computePriority(data.impact, data.urgency),
    status: "Pendente",
    createdAt: new Date().toISOString().slice(0, 10),
  };

  return simulateHttp(newDemand);
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
  const updatedDemand: Demand = {
    id,
    title: data.title,
    description: data.description,
    requester: data.requester as "Pabricio" | "Vitor",
    impact: data.impact,
    urgency: data.urgency,
    status: data.status,
    priority: computePriority(data.impact, data.urgency),
    createdAt: data.createdAt,
  };

  return simulateHttp(updatedDemand);
}

export async function updateDemandStatus(id: string, status: DemandStatus): Promise<{ id: string; status: DemandStatus }> {
  return simulateHttp({ id, status });
}

export async function deleteDemand(id: string): Promise<{ id: string }> {
  return simulateHttp({ id });
}
