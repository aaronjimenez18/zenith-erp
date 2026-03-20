Zenith ERP - SaaS Multi-tenant

Bienvenido al repositorio de Zenith ERP, un sistema de gestión empresarial diseñado para escalar. Este proyecto utiliza tecnologías modernas para garantizar velocidad, seguridad y una experiencia de usuario de primer nivel.

Stack Tecnológico
Framework: Next.js 14/15 (App Router)

Base de Datos: Neon (PostgreSQL Serverless)

ORM: Prisma

Estilos: Tailwind CSS

Lenguaje: TypeScript

Requisitos Previos
Antes de iniciar, asegúrate de tener instalado:

Node.js (v20.x o superior recomendada)

npm o pnpm

Una cuenta en Neon.tech (para la base de datos)

Configuración Inicial
Sigue estos pasos para levantar el proyecto en tu entorno local:

1. Clonar el proyecto e instalar dependencias
   Bash
   git clone
   cd erp-saas
   npm install
2. Configurar variables de entorno
   Crea un archivo .env en la raíz del proyecto y añade tu cadena de conexión:
   DATABASE_URL="confidencial"
   NEXTAUTH_SECRET="un_secreto_muy_largo_y_aleatorio"
   NEXTAUTH_URL="http://localhost:3000"

3. Sincronizar Prisma
   Este paso es vital para que TypeScript reconozca los modelos de la base de datos y las tablas se creen correctamente en Neon:

Bash

# Genera el cliente de TypeScript

npx prisma generate

# Sincroniza el esquema con la base de datos

npx prisma db push 4. (Opcional) Cargar datos de prueba
Si quieres iniciar con productos y negocios ya creados:

Bash
npx prisma db seed 5. Correr el servidor
Bash
npm run dev
La aplicación estará disponible en http://localhost:3000/dashboard/inventory

Estructura del Proyecto
src/app: Rutas y lógica de páginas (Next.js App Router).

src/components: Componentes reutilizables de la interfaz.

src/lib: Configuraciones globales (Cliente de Prisma, utilidades).

prisma/: Esquema de la base de datos y migraciones.

Comandos Útiles de Desarrollo
npx prisma studio: Abre una interfaz visual para editar la base de datos en el navegador.

npm run build: Genera la versión de producción.

npm run lint: Revisa errores de estilo y buenas prácticas en el código.
