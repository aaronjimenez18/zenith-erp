import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ERP Zenith",
    short_name: "Zenith",
    description: "ERP multi-tenant para pymes: inventario, POS, gastos, dashboard con KPIs y asistente IA.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f6f5f3",
    theme_color: "#134235",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
