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
    const controller = new AbortController();

    if (!token) {
      setStatus("error");
      setErrorMessage("Token no proporcionado");
      return () => controller.abort();
    }

    async function verifyEmail() {
      try {
        const response = await fetch(`/api/auth/verify?token=${token}`, { signal: controller.signal });
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          setStatus("error");
          setErrorMessage(data.error || "No se pudo verificar el correo.");
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setStatus("error");
        setErrorMessage("No pudimos conectar con el servidor. Verifica tu internet.");
      }
    }

    verifyEmail();

    return () => controller.abort();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4">
      <div className="bg-white rounded-3xl p-10 shadow-sm w-full max-w-sm text-center">
        {status === "loading" && (
          <>
            <h2 className="mb-4 text-slate-800 text-2xl font-bold">
              Verificando...
            </h2>
            <p className="text-slate-500 mb-6">
              Por favor espera mientras verificamos tu correo electrónico...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="mb-4 text-slate-800 text-2xl font-bold">
              ¡Email Verificado!
            </h2>
            <p className="text-slate-500 mb-6">
              Tu correo electrónico ha sido verificado exitosamente. Serás redirigido automáticamente en unos segundos.
            </p>
            <Button asChild className="w-full py-3">
              <Link href="/login">Ir a iniciar sesión</Link>
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="mb-4 text-slate-800 text-2xl font-bold">
              Error de Verificación
            </h2>
            <p className="text-red-600 font-medium mb-2">
              {errorMessage}
            </p>
            <p className="text-slate-500 mb-6">
              El enlace de verificación puede haber expirado o ser inválido.
            </p>
            <Button asChild className="w-full py-3">
              <Link href="/login">Ir a iniciar sesión</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
