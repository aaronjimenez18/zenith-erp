"use client";

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
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/user-context";


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
  { name: "Suscripción", href: "/dashboard/suscripcion", icon: CreditCard, roles: ["SUPER_ADMIN"] },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings, roles: ["SUPER_ADMIN", "ADMIN"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, loading } = useUser();

  const currentRole = user?.role || "VENDEDOR";
  const currentPlan = user?.plan || "BASIC";

  return (
    <div className="flex flex-col h-full w-64 glass-sidebar text-slate-700">
      <div className="p-6">
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-primary shadow-sm flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user?.businessName?.charAt(0).toUpperCase() || "Z"}
            </div>
            <span className="truncate">{user?.businessName || "Cargando..."}</span>
          </h2>
        <div className="flex items-center gap-2 mt-2 pl-12">
          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-sm uppercase tracking-wider">
            {currentRole}
          </span>
          {currentPlan === "PREMIUM" && (
            <span className="text-[10px] font-bold bg-[#134235]/10 text-[#134235] px-2.5 py-0.5 rounded-full border border-[#134235]/20 shadow-sm uppercase tracking-wider">
              PRO
            </span>
          )}
        </div>
      </div>

      <nav aria-label="Navegación principal" className="flex-1 px-4 py-2 space-y-1.5">
        {menuItems.map((item) => {
          const hasRoleAccess = item.roles.includes(currentRole);
          const isLockedByPlan = item.premiumOnly && currentPlan === "BASIC";

          if (!hasRoleAccess) return null;

          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={isLockedByPlan ? "#" : item.href}
              aria-disabled={isLockedByPlan || undefined}
              tabIndex={isLockedByPlan ? -1 : undefined}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-300 group relative font-medium text-sm focus-visible:ring-2 focus-visible:ring-[#134235]/30",
                isActive
                  ? "bg-[#134235]/10 text-[#134235] font-semibold"
                  : isLockedByPlan 
                    ? "opacity-50 cursor-not-allowed grayscale" 
                    : "hover:bg-slate-100 hover:text-slate-900",
                item.isAi && !isActive && !isLockedByPlan && "text-slate-500 hover:text-slate-700"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-[#134235]" : "text-slate-500 group-hover:text-slate-700"
                )} />
                <span>{item.name}</span>
              </div>
              {isLockedByPlan && <Lock className="w-3.5 h-3.5 text-slate-400" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#e3e2df]">
        <button 
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-colors font-medium text-sm focus-visible:ring-2 focus-visible:ring-[#134235]/30"
        >
          <LogOut className="w-5 h-5 text-slate-500 transition-colors" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}