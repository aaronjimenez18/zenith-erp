"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Algo salió mal</h1>
        <p className="text-slate-500 mb-8">
          Ocurrió un error inesperado. Intenta de nuevo.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-[#134235] text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-sm"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
