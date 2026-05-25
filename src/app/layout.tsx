import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f5f3",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://zenitherp.com"),
  title: {
    default: "ERP Zenith — Gestión integral para tu negocio",
    template: "%s — ERP Zenith",
  },
  description:
    "ERP multi-tenant para pymes: inventario, punto de venta, gastos, dashboard con KPIs y asistente con IA.",
  openGraph: {
    title: "ERP Zenith — Gestión integral para tu negocio",
    description:
      "ERP multi-tenant para pymes: inventario, punto de venta, gastos, dashboard con KPIs y asistente con IA.",
    url: "https://zenitherp.com",
    siteName: "ERP Zenith",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "ERP Zenith — Dashboard de gestión empresarial",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ERP Zenith — Gestión integral para tu negocio",
    description:
      "ERP multi-tenant para pymes: inventario, punto de venta, gastos, dashboard con KPIs y asistente con IA.",
    images: ["/icon.svg"],
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  alternates: {
    canonical: "https://zenitherp.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <link rel="preconnect" href="https://js.stripe.com" />
      <body className={`${plusJakartaSans.variable} ${geistMono.variable} ${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
