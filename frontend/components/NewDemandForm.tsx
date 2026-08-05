import { FormEvent, useEffect, useState } from "react";

interface DemandFormData {
  title: string;
  description: string;
  requester: string;
  impact: number;
  urgency: number;
  status: string ;
}

interface NewDemandFormProps {
  requesters: string[];
  initialData?: DemandFormData;
  onSubmit: (data: DemandFormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function NewDemandForm({ requesters, initialData, onSubmit, onCancel, submitLabel = "Adicionar" }: NewDemandFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requester, setRequester] = useState(requesters[0] ?? "");
  const [impact, setImpact] = useState(3);
  const [urgency, setUrgency] = useState(3);
  const [status, setStatus] = useState("Pendente");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setRequester(initialData.requester);
      setImpact(initialData.impact);
      setUrgency(initialData.urgency);
      setStatus(initialData.status);
      setError("");
      return;
    }

    setTitle("");
    setDescription("");
    setRequester(requesters[0] ?? "");
    setImpact(3);
    setUrgency(3);
    setStatus("Pendente");
    setError("");
  }, [initialData, requesters]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !description.trim() || !requester) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    if (impact < 1 || impact > 5 || urgency < 1 || urgency > 5) {
      setError("Impacto e urgência devem estar entre 1 e 5.");
      return;
    }
    setError("");
    onSubmit({ title: title.trim(), description: description.trim(), requester, impact, urgency, status });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{initialData ? "Editar demanda" : "Nova demanda"}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {initialData ? "Atualize os dados e salve a demanda existente." : "Cadastre uma demanda rápida e veja a lista atualizar."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Cancelar
            </button>
          ) : null}
          <button
            type="submit"
            className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            {submitLabel}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col text-sm text-slate-700">
          Título
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-2 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
            placeholder="Nome da demanda"
          />
        </label>
        <label className="flex flex-col text-sm text-slate-700">
          Solicitante
          <select
            value={requester}
            onChange={(event) => setRequester(event.target.value)}
            className="mt-2 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
          >
            {requesters.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm text-slate-700 sm:col-span-2">
          Descrição
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="mt-2 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
            placeholder="Descreva brevemente a demanda"
          />
        </label>
        <label className="flex flex-col text-sm text-slate-700">
          Impacto (1 a 5)
          <input
            type="number"
            min={1}
            max={5}
            value={impact}
            onChange={(event) => setImpact(Number(event.target.value))}
            className="mt-2 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
          />
        </label>
        <label className="flex flex-col text-sm text-slate-700">
          Urgência (1 a 5)
          <input
            type="number"
            min={1}
            max={5}
            value={urgency}
            onChange={(event) => setUrgency(Number(event.target.value))}
            className="mt-2 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
          />
        </label>
        <label className="flex flex-col text-sm text-slate-700 sm:col-span-2">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
          >
            <option value="Pendente">Pendente</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Concluída">Concluída</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </label>
      </div>
      {error ? <p className="mt-4 rounded-2xl bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
    </form>
  );
}
