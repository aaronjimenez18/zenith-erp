"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/sidebar";

export function MobileHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-slate-900 flex items-center justify-between px-4 z-40">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-white hover:bg-slate-800 rounded-lg"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-bold text-white">Zenith ERP</h2>
        <div className="w-10" />
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 text-white hover:bg-slate-800 rounded-lg"
            >
              <X size={24} />
            </button>
            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
}