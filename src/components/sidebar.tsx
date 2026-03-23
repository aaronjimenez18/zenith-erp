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
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Definimos los items con sus restricciones
const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "ADMIN", "VENDEDOR"] },
  { name: "Inventario", href: "/dashboard/inventory", icon: Package, roles: ["SUPER_ADMIN", "ADMIN", "VENDEDOR"] },
  { name: "Ventas", href: "/dashboard/sales", icon: ShoppingCart, roles: ["SUPER_ADMIN", "ADMIN", "VENDEDOR"] },
  { name: "Gastos", href: "/dashboard/expenses", icon: Banknote, roles: ["SUPER_ADMIN", "ADMIN"] },
  { 
    name: "Asistente IA", 
    href: "/dashboard/ai-assistant", 
    icon: Sparkles, 
    isAi: true, 
    premiumOnly: true, 
    roles: ["SUPER_ADMIN", "ADMIN"] 
  },
  { name: "Usuarios", href: "/dashboard/users", icon: Users, roles: ["SUPER_ADMIN"] },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings, roles: ["SUPER_ADMIN", "ADMIN"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ role: string; plan: string } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Error al cargar usuario en Sidebar");
      }
    }
    fetchUser();
  }, []);

  const currentRole = user?.role || "VENDEDOR";
  const currentPlan = user?.plan || "BASIC";

  return (
    <div className="flex flex-col h-full w-64 bg-slate-900 text-slate-300 border-r border-slate-800">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Zenith ERP</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
            {currentRole}
          </span>
          {currentPlan === "PREMIUM" && (
            <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/30">
              PRO
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const hasRoleAccess = item.roles.includes(currentRole);
          const isLockedByPlan = item.premiumOnly && currentPlan === "BASIC";

          if (!hasRoleAccess) return null;

          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={isLockedByPlan ? "#" : item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-blue-600 text-white"
                  : isLockedByPlan 
                    ? "opacity-50 cursor-not-allowed grayscale" 
                    : "hover:bg-slate-800 hover:text-white",
                item.isAi && !isActive && !isLockedByPlan && "text-purple-400 hover:text-purple-300"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "w-5 h-5",
                  isActive ? "text-white" : item.isAi ? "text-purple-400" : "text-slate-400"
                )} />
                <span className="font-medium">{item.name}</span>
              </div>
              {isLockedByPlan && <Lock className="w-3 h-3 text-slate-500" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-red-900/20 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}