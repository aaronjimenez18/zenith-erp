// src/app/dashboard/layout.tsx
import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - hidden on mobile, visible on md+ */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Header with hamburger menu */}
      <div className="md:hidden">
        <MobileHeader />
      </div>

      <main className="flex-1 overflow-y-auto md:ml-0">{children}</main>
    </div>
  );
}
