import type { Metadata } from "next";
import RegisterForm from "./register.client";

export const metadata: Metadata = {
  title: "Crear Cuenta",
  description: "Regístrate en ERP Zenith y comienza a gestionar tu negocio de forma inteligente.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
