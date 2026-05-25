import type { Metadata } from "next";
import PricingPlans from "./pricing.client";

export const metadata: Metadata = {
  title: "Planes y Precios",
  description: "Conoce los planes de ERP Zenith. Desde $300/mes. Básico y Premium con 14 días de prueba gratis.",
};

export default function PricingPage() {
  return <PricingPlans />;
}
