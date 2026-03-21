# Agent Instructions for ERP SaaS

## Project Overview

This is a Next.js 16 ERP SaaS application with PostgreSQL, Prisma ORM, JWT authentication, and AI integration.

## Build/Lint/Test Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint

# Prisma commands
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema changes to database
npx prisma db studio    # Open Prisma Studio
npx prisma migrate dev  # Run migrations (creates SQL migration files)

# Database seeding
npm run db:seed
```

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** - no implicit any, strict null checks
- Always use explicit types for function parameters and return types
- Use `type` for simple type aliases, `interface` for complex shapes
- Use `as` casting sparingly; prefer proper type guards

### Imports

```typescript
// Use @/ alias for src imports
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

// React imports
import * as React from "react";

// Relative imports for sibling files
import { validateEmail } from "./validation";
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `ProductForm.tsx` |
| Functions | camelCase | `createProduct()` |
| Hooks | camelCase with `use` prefix | `useIsMobile()` |
| Variables | camelCase | `businessId` |
| Constants | camelCase or SCREAMING_SNAKE | `JWT_SECRET` |
| Types/Interfaces | PascalCase | `TokenPayload` |
| Files (components) | PascalCase | `Button.tsx` |
| Files (utilities) | kebab-case or camelCase | `use-mobile.ts`, `db.ts` |

### File Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboard pages
│   └── layout.tsx
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── shared/            # Shared components
│   └── *.tsx              # Feature components
├── hooks/                 # Custom React hooks
└── lib/                   # Utilities, auth, db, tools
    └── ai/                # AI-related utilities
```

### Component Patterns

```typescript
// Use class-variance-authority for variant components
import { cva, type VariantProps } from "class-variance-authority";

function Button({ variant = "default", ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }))} {...props} />;
}

// Use cn() utility for conditional classes
import { cn } from "@/lib/utils";
className={cn("base-class", condition && "conditional-class")}

// Server Actions
"use server";

export async function createProduct(formData: FormData) {
  // Server-side logic
}
```

### Error Handling

```typescript
// API Routes - return NextResponse with status codes
if (!user) {
  return NextResponse.json({ error: "User not found" }, { status: 401 });
}

// Server Actions - return error objects
export async function createProduct(formData: FormData) {
  try {
    // logic
    return { success: true };
  } catch (error: any) {
    console.error("Error:", error);
    return { error: error.message || "Unknown error" };
  }
}
```

### API Routes

```typescript
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  // Process request
  return NextResponse.json({ data: result });
}
```

### Authentication Patterns

- JWT tokens stored in httpOnly cookies
- Middleware validates tokens on protected routes (`/dashboard/*`)
- Server Actions use `jwtVerify` from `jose` library
- Utility functions in `src/lib/auth.ts` use `jsonwebtoken`

### Database (Prisma)

```typescript
import { db } from "@/lib/db";

// Always use db singleton pattern (already configured in src/lib/db.ts)
// Transactions for multiple operations
await db.$transaction(async (tx) => {
  // operations
});

// Use revalidatePath after mutations
import { revalidatePath } from "next/cache";
revalidatePath("/dashboard/inventory");
```

### Styling

- Tailwind CSS v4 with CSS variables
- Use `cn()` for merging Tailwind classes
- Follow shadcn/ui component patterns
- Use design tokens via CSS variables

### What to Avoid

- Don't use `console.log` in production code (use `console.error` for errors)
- Don't use `any` type; use proper typing
- Don't commit `.env` files or any secrets
- Don't use `require()` - use ESM imports
- Don't mix server and client code without proper "use client" directive
