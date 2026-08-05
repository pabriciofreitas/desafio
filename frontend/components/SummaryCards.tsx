import { Demand } from "../types/demand";

interface SummaryCardsProps {
  demands: Demand[];
}

const toCurrency = (value: number) => `${value}`;

export function SummaryCards({ demands }: SummaryCardsProps) {
  const total = demands.length;
  const pending = demands.filter((item) => item.status === "Pendente").length;
  const inProgress = demands.filter((item) => item.status === "Em andamento").length;
  const completed = demands.filter((item) => item.status === "Concluída").length;

  const cards = [
    { label: "Total de demandas", value: total, color: "bg-slate-900 text-white" },
    { label: "Pendentes", value: pending, color: "bg-white text-slate-900 border border-slate-200" },
    { label: "Em andamento", value: inProgress, color: "bg-white text-slate-900 border border-slate-200" },
    { label: "Concluídas", value: completed, color: "bg-white text-slate-900 border border-slate-200" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-3xl p-5 shadow-sm ${card.color}`}>
          <p className="text-sm font-medium text-slate-500">{card.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{toCurrency(card.value)}</p>
        </div>
      ))}
    </div>
  );
}
