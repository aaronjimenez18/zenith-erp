import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "ERP Zenith — Gestión integral para tu negocio",
  description:
    "ERP multi-tenant para pymes: inventario, punto de venta, gastos, dashboard con KPIs y asistente con IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${plusJakartaSans.variable} ${geistMono.variable} ${newsreader.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
