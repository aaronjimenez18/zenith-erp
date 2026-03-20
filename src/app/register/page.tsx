"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("¡Cuenta creada! Ahora puedes iniciar sesión.");
        router.push("/login");
      } else {
        // Mostramos el error específico que viene del backend
        alert(data.error || "Hubo un problema al registrarse");
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <form
        onSubmit={handleRegister}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "40px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "350px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
          Registro Zenith ERP
        </h2>

        <input
          placeholder="Nombre de la Empresa"
          required
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        />

        <input
          type="email"
          placeholder="Correo Electrónico"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        />

        <input
          type="password"
          placeholder="Contraseña"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px",
            backgroundColor: loading ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          {loading ? "Creando cuenta..." : "Registrar Empresa"}
        </button>

        <p style={{ textAlign: "center", fontSize: "14px" }}>
          ¿Ya tienes cuenta?{" "}
          <a href="/login" style={{ color: "#0070f3" }}>
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  );
}
