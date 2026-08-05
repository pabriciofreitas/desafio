"use client";

import { useEffect, useMemo, useState } from "react";
import { Demand, DemandStatus } from "../types/demand";
import { DemandList } from "../components/DemandList";
import { EmptyState } from "../components/EmptyState";
import { Filters } from "../components/Filters";
import { NewDemandForm } from "../components/NewDemandForm";
import { SummaryCards } from "../components/SummaryCards";

const requesters = ["Pabricio", "Vitor"] as string[];
const statuses: DemandStatus[] = ["Pendente", "Em andamento", "Concluída", "Cancelada"];

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

function priorityWeight(priority: Demand["priority"]) {
  return priority === "Alta" ? 3 : priority === "Média" ? 2 : 1;
}

export default function Home() {
  const [tab, setTab] = useState<"summary" | "demands">("summary");
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [requesterFilter, setRequesterFilter] = useState("");
  const [impactFilter, setImpactFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => {
      setDemands(initialDemands);
      setLoading(false);
    }, 700);
    return () => window.clearTimeout(timer);
  }, []);

  const visibleDemands = useMemo(() => {
    return demands
      .filter((demand) => (statusFilter ? demand.status === statusFilter : true))
      .filter((demand) => (requesterFilter ? demand.requester === requesterFilter : true))
      .filter((demand) => (impactFilter ? demand.impact === Number(impactFilter) : true))
      .sort((a, b) => {
        const priorityDiff = priorityWeight(b.priority) - priorityWeight(a.priority);
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [demands, statusFilter, requesterFilter, impactFilter]);

  const handleStatusChange = (id: string, status: DemandStatus) => {
    setDemands((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const handleCreateDemand = (data: { title: string; description: string; requester: string; impact: number; urgency: number }) => {
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
    setDemands((current) => [newDemand, ...current]);
    setTab("demands");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-6 rounded-[2rem] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Gestão de demandas</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              ZEEWAY - Painel de produto
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Duas telas simples: resumo e listagem com filtros. Sem autenticação.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setTab("summary")}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${tab === "summary" ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-100"}`}
            >
              Resumo
            </button>
            <button
              type="button"
              onClick={() => setTab("demands")}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${tab === "demands" ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-100"}`}
            >
              Demandas
            </button>
          </div>
        </header>

        {tab === "summary" ? (
          <div className="space-y-6">
            <SummaryCards demands={demands} />
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Como usar</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Nesta tela você vê um resumo rápido das demandas. Clique em "Demandas" para aplicar filtros, alterar status e cadastrar novas solicitações.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Listagem de demandas</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Mostrando prioridades da mais alta para a mais baixa.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {visibleDemands.length} resultados
                  </div>
                </div>
                <div className="mt-6">
                  <Filters
                    status={statusFilter}
                    requester={requesterFilter}
                    impact={impactFilter}
                    requesters={requesters as string[]}
                    statuses={statuses}
                    onChange={(field, value) => {
                      if (field === "status") setStatusFilter(value);
                      if (field === "requester") setRequesterFilter(value);
                      if (field === "impact") setImpactFilter(value);
                    }}
                  />
                </div>
              </div>

              {loading ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
                  Carregando demandas...
                </div>
              ) : error ? (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-700 shadow-sm">
                  {error}
                </div>
              ) : visibleDemands.length === 0 ? (
                <EmptyState title="Nenhuma demanda encontrada" description="Ajuste os filtros ou crie uma nova demanda." />
              ) : (
                <DemandList demands={visibleDemands} statuses={statuses} onStatusChange={handleStatusChange} />
              )}
            </div>
            <NewDemandForm requesters={requesters as string[]} onCreate={handleCreateDemand} />
          </div>
        )}
      </div>
    </div>
  );
}
