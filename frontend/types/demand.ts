export type DemandStatus = "Pendente" | "Em andamento" | "Concluída" | "Cancelada";

export interface Demand {
  id: string;
  title: string;
  description: string;
  requester: "Pabricio" | "Vitor";
  impact: number;
  urgency: number;
  priority: "Alta" | "Média" | "Baixa";
  status: DemandStatus;
  createdAt: string;
}
