import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-[#134235] mb-4">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Página no encontrada</h2>
        <p className="text-slate-500 mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#134235] text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-sm"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
