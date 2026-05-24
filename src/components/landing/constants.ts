import {
  BarChart3,
  Bot,
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";

export const NAV_LINKS = [
  { label: "Módulos", href: "#modulos" },
  { label: "Asistente IA", href: "#ia" },
  { label: "Roles", href: "#roles" },
  { label: "Precios", href: "#precios" },
] as const;

export type ModuleItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: "mint" | "neutral" | "rose";
};

export const MODULES: ModuleItem[] = [
  {
    title: "Dashboard",
    description:
      "Gráficos de tendencia, alertas de stock y ventas recientes.",
    icon: LayoutDashboard,
    accent: "mint",
  },
  {
    title: "Inventario",
    description:
      "Productos con SKU, códigos de barras, márgenes automáticos e imágenes.",
    icon: Package,
    accent: "neutral",
  },
  {
    title: "Punto de Venta",
    description:
      "POS ágil con carrito, búsqueda de productos y resumen de venta al instante.",
    icon: ShoppingCart,
    accent: "rose",
  },
  {
    title: "Gastos",
    description:
      "Registro y categorización de gastos.",
    icon: Receipt,
    accent: "mint",
  },
  {
    title: "Usuarios",
    description:
      "Gestión de equipo con roles diferenciados según tu plan de suscripción.",
    icon: Users,
    accent: "neutral",
  },
  {
    title: "Configuración",
    description:
      "Márgenes, datos del negocio y ajustes avanzados para el dueño.",
    icon: Settings,
    accent: "rose",
  },
];

export const AI_FEATURES = [
  "Responde consultas de datos en segundos",
  "Automatiza tareas repetitivas del día a día",
  "Genera proyecciones inteligentes de tu negocio",
] as const;

export const ROLES = [
  {
    name: "SUPER ADMIN",
    description:
      "Dueño del negocio. Acceso total: usuarios, configuración avanzada y eliminación del tenant.",
    icon: Settings,
  },
  {
    name: "ADMIN",
    description:
      "Dashboard, inventario, ventas, gastos e IA. Sin gestión de usuarios.",
    icon: BarChart3,
  },
  {
    name: "VENDEDOR",
    description:
      "Acceso a inventario y punto de venta. Ideal para el equipo de mostrador.",
    icon: ShoppingCart,
  },
] as const;

export const PLANS = [
  {
    id: "BASIC",
    name: "Básico",
    monthlyPrice: "300",
    annualPrice: "3,000",
    annualLabel: "$3,000/año (ahorra 2 meses)",
    description: "Ideal para emprendedores que están empezando.",
    features: [
      "Productos ilimitados",
      "Inventario y ventas",
      "Gastos y dashboard",
      "Hasta 3 usuarios VENDEDOR",
      "14 días de prueba gratis",
    ],
    highlighted: false,
    cta: "Empezar prueba gratis",
  },
  {
    id: "PREMIUM",
    name: "Premium",
    monthlyPrice: "800",
    annualPrice: "8,000",
    annualLabel: "$8,000/año (ahorra 2 meses)",
    description: "Para negocios que necesitan potencia e inteligencia.",
    features: [
      "Todo lo del plan Básico",
      "Asistente con IA",
      "Hasta 3 usuarios ADMIN",
      "Gestión de gastos avanzada",
      "14 días de prueba gratis",
    ],
    highlighted: true,
    badge: "MÁS VENDIDO",
    cta: "Empezar prueba gratis",
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    monthlyPrice: null,
    annualPrice: null,
    annualLabel: null,
    description: "Solución a medida para operaciones de gran escala.",
    features: [
      "Usuarios ilimitados",
      "Roles personalizados",
      "Soporte dedicado",
      "Integraciones a medida",
    ],
    highlighted: false,
    cta: "Contactar",
    contact: true,
  },
] as const;
