Zenith ERP

**Sistema de gestión empresarial todo-en-uno para pequeñas y medianas empresas.**

## Zenith ERP es una plataforma SaaS moderna que centraliza la administración de tu negocio: inventario, punto de venta, gastos, usuarios, facturación y análisis — todo en un solo lugar, accesible desde cualquier navegador.

Módulos

Inventario
Control de stock con tabla editable, búsqueda en tiempo real, códigos de barras, imágenes de producto y precios diferenciados (venta y mayoreo). Los productos se organizan automáticamente por negocio con SKU único.

Punto de Venta (POS)
Interfaz rápida de cobro con búsqueda de productos, carrito en vivo y descuento automático de stock al confirmar la venta. Diseñado para funcionar en tablets y pantallas táctiles.

Gastos
Registro y categorización de gastos operativos. Vista mensual para comparar ingresos vs egresos con gráficos de tendencia.

Dashboard
Panel central con KPIs clave: ingresos del mes, tendencias vs mes anterior, productos con stock bajo, ventas recientes y gráfico de ingresos vs gastos.

Usuarios
Gestión de roles con permisos granulares: **SUPER_ADMIN** (control total), **ADMIN** (operaciones diarias), **VENDEDOR** (solo POS e inventario). Los roles avanzados requieren plan PREMIUM.

Asistente IA
Asistente conversacional impulsado por Gemini AI. Responde preguntas sobre el negocio, genera reportes y puede crear productos mediante comandos de lenguaje natural.

Configuración
Ajustes de empresa, márgenes de ganancia automáticos (precio de venta y mayoreo basados en precio de compra), y gestión de suscripción.

Suscripción
Planes BASIC y PREMIUM con facturación mensual o anual vía Stripe. El plan PREMIUM desbloquea roles de administrador, asistente IA, funcionalidades multi-sucursal y más.

---

Stack Tecnológico

| Capa           | Tecnología                            |
| -------------- | ------------------------------------- |
| Frontend       | Next.js 16, React 19, TypeScript      |
| Estilos        | Tailwind CSS v4, shadcn/ui, Radix UI  |
| Base de datos  | PostgreSQL (Neon)                     |
| ORM            | Prisma 7                              |
| Autenticación  | JWT (jose) con cookies httpOnly       |
| Pagos          | Stripe (checkout + webhooks + portal) |
| IA             | Google Gemini AI                      |
| Animaciones    | GSAP, Lenis                           |
| Gráficos       | Recharts                              |
| Notificaciones | Sonner                                |

---

Licencia

**Software propietario — todos los derechos reservados.**

Este repositorio contiene el código fuente de Zenith ERP. No está permitido su uso, reproducción, modificación o distribución sin autorización explícita del titular.

---

Variables de entorno requeridas

| Variable                             | Descripción                    |
| ------------------------------------ | ------------------------------ |
| `DATABASE_URL`                       | Cadena de conexión PostgreSQL  |
| `JWT_SECRET`                         | Secreto para firmar tokens JWT |
| `STRIPE_SECRET_KEY`                  | Llave secreta de Stripe        |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Llave pública de Stripe        |
| `STRIPE_WEBHOOK_SECRET`              | Secreto del webhook de Stripe  |
| `GMAIL_USER`                         | Correo para notificaciones     |
| `GMAIL_PASS`                         | App Password de Gmail          |
| `GEMINI_API_KEY`                     | API key de Google Gemini       |
