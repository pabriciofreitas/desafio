"use client";

import { useEffect, useMemo, useState } from "react";
import { Demand, DemandStatus } from "../types/demand";
import { DemandList } from "../components/DemandList";
import { EmptyState } from "../components/EmptyState";
import { Filters } from "../components/Filters";
import { NewDemandForm } from "../components/NewDemandForm";
import { SummaryCards } from "../components/SummaryCards";
import { createDemand, deleteDemand, listDemands, updateDemand, updateDemandStatus } from "../service/demandService";

const requesters: string[] = ["Pabricio", "Vitor"];
const statuses: DemandStatus[] = ["Pendente", "Em andamento", "Concluída", "Cancelada"];

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
  const [editingDemand, setEditingDemand] = useState<Demand | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apiDemands = await listDemands();
        setDemands(apiDemands);
        setError("");
      } catch {
        setError("Falha ao carregar demandas.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const handleStatusChange = async (id: string, status: DemandStatus) => {
    setLoading(true);
    try {
      await updateDemandStatus(id, status);
      setDemands((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
      setError("");
    } catch {
      setError("Falha ao atualizar status.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDemand = async (data: { title: string; description: string; requester: string; impact: number; urgency: number }) => {
    setLoading(true);
    try {
      const newItem = await createDemand(data);
      setDemands((current) => [newItem, ...current]);
      setEditingDemand(null);
      setTab("demands");
      setError("");
    } catch {
      setError("Falha ao criar demanda.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDemand = async (data: { title: string; description: string; requester: string; impact: number; urgency: number }) => {
    if (!editingDemand) return;

    setLoading(true);
    try {
      const updated = await updateDemand(editingDemand.id, {
        ...data,
        status: editingDemand.status,
        createdAt: editingDemand.createdAt,
      });
      setDemands((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setEditingDemand(null);
      setTab("demands");
      setError("");
    } catch {
      setError("Falha ao atualizar demanda.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDemand = async (id: string) => {
    setLoading(true);
    try {
      await deleteDemand(id);
      setDemands((current) => current.filter((item) => item.id !== id));
      if (editingDemand?.id === id) {
        setEditingDemand(null);
      }
      setError("");
    } catch {
      setError("Falha ao excluir demanda.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditDemand = (demand: Demand) => {
    setEditingDemand(demand);
    setTab("demands");
  };

  const handleCancelEdit = () => {
    setEditingDemand(null);
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
                    requesters={requesters}
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
                <DemandList
                  demands={visibleDemands}
                  statuses={statuses}
                  onStatusChange={handleStatusChange}
                  onEdit={handleEditDemand}
                  onDelete={handleDeleteDemand}
                />
              )}
            </div>
            <NewDemandForm
              requesters={requesters}
              initialData={editingDemand ? {
                title: editingDemand.title,
                description: editingDemand.description,
                requester: editingDemand.requester,
                impact: editingDemand.impact,
                urgency: editingDemand.urgency,
              } : undefined}
              onSubmit={editingDemand ? handleUpdateDemand : handleCreateDemand}
              onCancel={editingDemand ? handleCancelEdit : undefined}
              submitLabel={editingDemand ? "Salvar alterações" : "Adicionar"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
