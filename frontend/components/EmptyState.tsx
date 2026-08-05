interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 shadow-sm">
      <p className="text-xl font-semibold text-slate-900">{title}</p>
      {description ? <p className="mt-3 text-sm leading-6">{description}</p> : null}
    </div>
  );
}
