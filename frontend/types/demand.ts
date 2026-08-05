export type DemandStatus = "Pendente" | "Em andamento" | "Concluída" | "Cancelada";

export interface Demand {
  id: string;
  title: string;
  description: string;
  requester: "Pabricio" | "Vitor";
  impact: number;
  urgency: number;
  priority: number;
  status: DemandStatus;
  createdAt: string;
}
