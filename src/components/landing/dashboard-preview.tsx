type DashboardPreviewProps = {
  /** Versión compacta dentro del mockup de laptop (fallback CSS) */
  compact?: boolean;
};

export function DashboardPreview({ compact = false }: DashboardPreviewProps) {
  const bars = [40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 68];

  const inner = (
    <>
      <div
        className={`flex items-center gap-2 border-b border-[#e3e2df] bg-[#efeeea] ${compact ? "px-2 py-1.5" : "px-4 py-3"}`}
      >
        <span className="size-2 rounded-full bg-[#c0c8c3]" />
        <span className="size-2 rounded-full bg-[#c0c8c3]" />
        <span className="size-2 rounded-full bg-[#c0c8c3]" />
        <span
          className={`ml-1 font-semibold text-[#404945] ${compact ? "text-[9px]" : "text-xs"}`}
        >
          Zenith ERP — Dashboard
        </span>
      </div>
      <div className={`grid gap-3 ${compact ? "p-2" : "gap-4 p-5 sm:p-6"}`}>
        <div className={`grid grid-cols-3 ${compact ? "gap-1.5" : "gap-3"}`}>
          {[
            { label: "Ingresos", value: "$124,500" },
            { label: "Productos", value: "342" },
            { label: "Gastos", value: "$18,200" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className={`rounded-lg border border-[#e3e2df] bg-white ${compact ? "px-1.5 py-1.5" : "rounded-xl px-3 py-3"}`}
            >
              <p
                className={`font-bold uppercase tracking-wider text-[#717975] ${compact ? "text-[7px]" : "text-[10px]"}`}
              >
                {kpi.label}
              </p>
              <p
                className={`font-semibold text-[#134235] tabular-nums ${compact ? "text-[10px]" : "text-sm sm:text-base"}`}
              >
                {kpi.value}
              </p>
            </div>
          ))}
        </div>
        <div
          className={`rounded-lg border border-[#e3e2df] bg-white ${compact ? "p-2" : "rounded-xl p-4"}`}
        >
          {!compact && (
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[#717975]">
              Tendencia — Ingresos vs Gastos
            </p>
          )}
          <div className={`flex items-end gap-1 ${compact ? "h-12" : "h-28 gap-1.5"}`}>
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-[#2d5a4c] to-[#a0cfbe]"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );

  if (compact) {
    return (
      <div className="overflow-hidden rounded-lg border border-[#e3e2df] bg-[#faf9f5]">
        {inner}
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="absolute -inset-4 rounded-3xl bg-[#134235]/8 blur-2xl" aria-hidden />
      <div className="relative overflow-hidden rounded-2xl border border-[#e3e2df] bg-[#faf9f5] shadow-[0_20px_50px_rgba(19,66,53,0.12)]">
        {inner}
      </div>
      <div
        className="pointer-events-none absolute -bottom-6 left-1/2 h-8 w-4/5 -translate-x-1/2 rounded-[100%] bg-[#134235]/15 blur-xl"
        aria-hidden
      />
    </div>
  );
}
