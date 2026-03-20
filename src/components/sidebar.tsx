"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Banknote,
  Users,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inventario", href: "/dashboard/inventory", icon: Package },
  { name: "Ventas", href: "/dashboard/sales", icon: ShoppingCart },
  { name: "Gastos", href: "/dashboard/expenses", icon: Banknote },
  {
    name: "Asistente IA",
    href: "/dashboard/ai-assistant",
    icon: Sparkles,
    isAi: true,
  },
  { name: "Usuarios", href: "/dashboard/users", icon: Users },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-64 bg-slate-900 h-screen" />;

  return (
    <div className="flex flex-col h-screen w-64 bg-slate-900 text-slate-300 border-r border-slate-800">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Zenith ERP
        </h2>
        <p className="text-xs text-slate-500 mt-1">SaaS Multi-tenant</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 hover:text-white",
                item.isAi &&
                  !isActive &&
                  "text-purple-400 hover:text-purple-300",
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    "w-5 h-5",
                    isActive
                      ? "text-white"
                      : item.isAi
                        ? "text-purple-400"
                        : "text-slate-400",
                  )}
                />
                <span className="font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-red-900/20 hover:text-red-400 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
