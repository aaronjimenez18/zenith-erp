import type { Metadata } from "next";
import LoginForm from "./login.client";

export const metadata: Metadata = {
  title: "Iniciar Sesión",
  description: "Accede a tu panel de control de ERP Zenith con tu correo y contraseña.",
};

export default function LoginPage() {
  return <LoginForm />;
}
