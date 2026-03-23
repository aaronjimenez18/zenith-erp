"use client";

import { useEffect, useState } from "react";
import { UserPlus, Trash2, ShieldCheck, User as UserIcon } from "lucide-react";

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

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    if (res.ok) setUsers(await res.json());
  };

  useEffect(() => { fetchUsers(); }, []);

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
      alert("Usuario creado con éxito");
    } else {
      const data = await res.json();
      alert(data.error);
    }
    setLoading(false);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    
    const res = await fetch(`/api/users?id=${userId}`, { method: "DELETE" });
    if (res.ok) {
      fetchUsers();
      alert("Usuario eliminado");
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pt-20 md:pt-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Gestión de Usuarios</h1>
        <p className="text-slate-500">Administra los accesos de tus empleados</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" /> Nuevo Usuario
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <input
              type="email" placeholder="Correo electrónico" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="password" placeholder="Contraseña" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <select 
              value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white"
            >
              <option value="VENDEDOR">Vendedor</option>
              <option value="ADMIN">Administrador (Premium)</option>
            </select>
            <button
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-300"
            >
              {loading ? "Creando..." : "Registrar Empleado"}
            </button>
          </form>
        </div>

        {/* Tabla de Usuarios */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-700">Usuario</th>
                <th className="p-4 font-semibold text-slate-700">Rol</th>
                <th className="p-4 font-semibold text-slate-700 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <span className="text-slate-700 font-medium">{u.email}</span>
                  </td>
                  <td className="p-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      u.role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-700" :
                      u.role === "ADMIN" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {u.role !== "SUPER_ADMIN" && (
                      <button onClick={() => handleDelete(u.id)} className="text-red-400 hover:text-red-600 p-2">
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
  );
}