"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Token no proporcionado");
      return;
    }

    async function verifyEmail() {
      try {
        const response = await fetch(`/api/auth/verify?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          setStatus("error");
          setErrorMessage(data.error || "Error al verificar el email");
        }
      } catch {
        setStatus("error");
        setErrorMessage("Error de conexión");
      }
    }

    verifyEmail();
  }, [token, router]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f4f4f4",
      padding: "16px"
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "40px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "420px",
        textAlign: "center"
      }}>
        {status === "loading" && (
          <>
            <h2 style={{ marginBottom: "16px", color: "#333", fontSize: "24px", fontWeight: "bold" }}>
              Verificando...
            </h2>
            <p style={{ color: "#666", marginBottom: "24px" }}>
              Por favor espera mientras verificamos tu correo electrónico...
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "24px"
            }}>
              <div style={{
                height: "64px",
                width: "64px",
                borderRadius: "50%",
                backgroundColor: "#dcfce7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 style={{ marginBottom: "16px", color: "#333", fontSize: "24px", fontWeight: "bold" }}>
              ¡Email Verificado!
            </h2>
            <p style={{ color: "#666", marginBottom: "24px" }}>
              Tu correo electrónico ha sido verificado exitosamente. Serás redirigido automáticamente en unos segundos.
            </p>
            <Button asChild style={{ width: "100%", padding: "12px" }}>
              <Link href="/login">Ir a iniciar sesión</Link>
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "24px"
            }}>
              <div style={{
                height: "64px",
                width: "64px",
                borderRadius: "50%",
                backgroundColor: "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 style={{ marginBottom: "16px", color: "#333", fontSize: "24px", fontWeight: "bold" }}>
              Error de Verificación
            </h2>
            <p style={{ color: "#dc2626", marginBottom: "8px", fontWeight: "500" }}>
              {errorMessage}
            </p>
            <p style={{ color: "#666", marginBottom: "24px" }}>
              El enlace de verificación puede haber expirado o ser inválido.
            </p>
            <Button asChild style={{ width: "100%", padding: "12px" }}>
              <Link href="/login">Ir a iniciar sesión</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
