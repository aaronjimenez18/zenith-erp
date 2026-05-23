"use client";

type LandingPageLoaderProps = {
  percent: number;
  exiting?: boolean;
};

export function LandingPageLoader({ percent, exiting = false }: LandingPageLoaderProps) {
  return (
    <div
      className={`landing-loader-screen ${exiting ? "landing-loader-screen--exit" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={`Cargando sitio, ${percent} por ciento`}
    >
      <div className="landing-loader-screen__inner">
        <p className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1a]">
          Zenith <span className="text-[#2d5a4c]">ERP</span>
        </p>

        <div className="w-48 overflow-hidden rounded-full bg-[#e3e2df]">
          <div
            className="h-1 rounded-full bg-gradient-to-r from-[#2d5a4c] to-[#134235] transition-[width] duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#717975]">
          {percent}%
        </p>
      </div>
    </div>
  );
}
