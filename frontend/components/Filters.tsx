import { ChangeEvent } from "react";

interface FiltersProps {
  status: string;
  requester: string;
  impact: string;
  requesters: string[];
  statuses: string[];
  onChange: (field: "status" | "requester" | "impact", value: string) => void;
}

export function Filters({ status, requester, impact, requesters, statuses, onChange }: FiltersProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Filtros</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col text-sm text-slate-700">
          Status
          <select
            value={status}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange("status", event.target.value)}
            className="mt-2 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          >
            <option value="">Todos</option>
            {statuses.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm text-slate-700">
          Solicitante
          <select
            value={requester}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange("requester", event.target.value)}
            className="mt-2 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          >
            <option value="">Todos</option>
            {requesters.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm text-slate-700">
          Impacto
          <select
            value={impact}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange("impact", event.target.value)}
            className="mt-2 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          >
            <option value="">Todos</option>
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
