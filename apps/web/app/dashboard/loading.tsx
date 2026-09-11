export default function DashboardLoading() {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded bg-surface-raised" />
          <div className="h-4 w-80 rounded bg-surface-raised" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 rounded-xl border border-border bg-surface" />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-72 rounded-xl border border-border bg-surface" />
          <div className="h-72 rounded-xl border border-border bg-surface" />
        </div>
      </div>
    </div>
  );
}
