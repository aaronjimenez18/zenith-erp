import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://zenitherp.com",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "ERP Zenith",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description:
              "ERP multi-tenant para pymes: inventario, punto de venta, gastos, dashboard con KPIs y asistente con IA.",
            offers: [
              { "@type": "Offer", name: "Básico", price: "300", priceCurrency: "MXN", priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0] },
              { "@type": "Offer", name: "Premium", price: "800", priceCurrency: "MXN", priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0] },
            ],
          }),
        }}
      />
      <LandingPage />
    </>
  );
}
