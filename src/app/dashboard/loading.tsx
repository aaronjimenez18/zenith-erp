export default function DashboardLoading() {
  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 relative z-10 space-y-6 animate-pulse">
      <div className="h-8 bg-slate-200/50 rounded-xl w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-slate-200/50 rounded-2xl" />
        ))}
      </div>
      <div className="h-64 bg-slate-200/50 rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-48 bg-slate-200/50 rounded-2xl" />
        <div className="h-48 bg-slate-200/50 rounded-2xl" />
      </div>
    </div>
  );
}
