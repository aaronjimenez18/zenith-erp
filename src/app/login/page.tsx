"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Al usar cookies httpOnly, el navegador la guarda automáticamente
        router.push("/dashboard");
        router.refresh(); // Refrescamos para que el layout detecte al usuario
      } else {
        alert(data.error || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      alert("Hubo un error al intentar iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      height: "100vh", backgroundColor: "#f4f4f4", fontFamily: "sans-serif"
    }}>
      <form onSubmit={handleLogin} style={{
        display: "flex", flexDirection: "column", gap: "15px",
        padding: "35px", backgroundColor: "white", borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)", width: "320px",
      }}>
        <h1 style={{ textAlign: "center", margin: "0", color: "#333" }}>BIENVENIDO</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "12px", fontWeight: "bold", color: "#555" }}>CORREO</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "12px", fontWeight: "bold", color: "#555" }}>CONTRASEÑA</label>
          <input
            type="password"
            placeholder="••••••••"
            
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px", backgroundColor: loading ? "#ccc" : "#0070f3",
            color: "white", border: "none", borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer", fontWeight: "bold",
            fontSize: "16px", marginTop: "5px"
          }}
        >
          {loading ? "Validando..." : "Entrar a mi cuenta"}
        </button>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#666" }}>
          ¿Eres nuevo?{" "}
          <a href="/register" style={{ color: "#0070f3", textDecoration: "none", fontWeight: "bold" }}>
            Registra tu negocio
          </a>
        </p>
      </form>
    </div>
  );
}