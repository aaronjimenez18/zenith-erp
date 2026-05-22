"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/sidebar";

export function MobileHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/40 backdrop-blur-xl border-b border-white/40 flex items-center justify-between px-4 z-40 float-shadow">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-600 hover:bg-white/50 rounded-xl transition-colors"
          aria-label="Abrir menú"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[10px] bg-primary shadow-sm flex items-center justify-center text-white text-sm font-bold">
            Z
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Zenith ERP</h2>
        </div>
        <div className="w-10" />
      </div>

      {/* Mobile sidebar drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl border-r border-white/30 animate-in slide-in-from-left duration-300">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-3 right-3 p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors z-50 bg-white/80 backdrop-blur-sm"
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
}