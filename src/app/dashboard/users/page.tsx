"use client";

import { useEffect, useState, useCallback } from "react";
import { UserPlus, Trash2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("VENDEDOR");
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch("/api/users", { signal });
      if (res.ok) setUsers(await res.json());
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchUsers(controller.signal);
    return () => controller.abort();
  }, [fetchUsers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    });

    if (res.ok) {
      setEmail(""); setPassword("");
      fetchUsers();
      toast.success("Usuario registrado correctamente.");
    } else {
      const data = await res.json();
      toast.error("Error al registrar", { description: data.error });
    }
    setLoading(false);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("¿Eliminar este usuario? No se puede deshacer.")) return;
    
    const res = await fetch(`/api/users?id=${userId}`, { method: "DELETE" });
    if (res.ok) {
      fetchUsers();
      toast.success("Usuario eliminado permanentemente.");
    } else {
      const data = await res.json();
      toast.error("Error al eliminar", { description: data.error });
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pt-20 md:pt-8 relative z-10">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">Gestión de Usuarios</h1>
        <p className="text-slate-500 text-sm md:text-base font-medium mt-1">Administra los accesos de tus empleados</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="glass-card p-6 h-fit">
          <h2 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
            <UserPlus className="w-5 h-5 text-slate-600" /> Nuevo Usuario
          </h2>
          <form onSubmit={handleCreate} className="space-y-3 md:space-y-4">
            <input
              type="email" placeholder="Correo electrónico" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 md:p-3 text-sm md:text-base glass-input rounded-xl"
            />
            <input
              type="password" placeholder="Contraseña" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 md:p-3 text-sm md:text-base glass-input rounded-xl"
            />
            <select 
              value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 md:p-3 text-sm md:text-base glass-input rounded-xl [&>option]:bg-white"
            >
              <option value="VENDEDOR">Vendedor</option>
              <option value="ADMIN">Administrador (Premium)</option>
            </select>
            <button
              disabled={loading}
              className="w-full py-2.5 md:py-3 text-sm md:text-base bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all mt-2 shadow-sm"
            >
              {loading ? "Creando..." : "Registrar Empleado"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[400px]">
              <thead className="bg-slate-50 border-b border-[#e3e2df]">
                <tr>
                  <th className="p-4 font-bold text-slate-600 text-sm uppercase tracking-wider">Usuario</th>
                  <th className="p-4 font-bold text-slate-600 text-sm uppercase tracking-wider">Rol</th>
                  <th className="p-4 font-bold text-slate-600 text-sm text-right uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-[#e3e2df] hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 flex-shrink-0">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <span className="text-slate-800 font-bold text-sm md:text-base truncate max-w-[150px] md:max-w-none">{u.email}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        u.role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-700" :
                        u.role === "ADMIN" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== "SUPER_ADMIN" && (
                        <button onClick={() => handleDelete(u.id)} className="text-destructive/60 hover:text-destructive p-2 transition-colors" aria-label={`Eliminar ${u.email}`}>
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}