import { Demand, DemandStatus } from "../types/demand";

interface DemandCardProps {
  demand: Demand;
  statuses: DemandStatus[];
  onStatusChange: (id: string, status: DemandStatus) => void;
  onEdit: (demand: Demand) => void;
  onDelete: (id: string) => void;
}

export function DemandCard({ demand, statuses, onStatusChange, onEdit, onDelete }: DemandCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{demand.requester} • {demand.createdAt}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{demand.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{demand.description}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-800">Impacto: {demand.impact}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-800">Urgência: {demand.urgency}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-800">Prioridade: {demand.priority}</span>
        </div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-[1.6fr_1fr] lg:grid-cols-[1.5fr_1fr_0.8fr]">
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          Status: <span className="font-semibold text-slate-900">{demand.status}</span>
        </div>

        <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
          Alterar status
          <select
            value={demand.status}
            onChange={(event) => onStatusChange(demand.id, event.target.value as DemandStatus)}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onEdit(demand)}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(demand.id)}
            className="rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
