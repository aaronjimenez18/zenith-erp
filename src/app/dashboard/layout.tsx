// src/app/dashboard/layout.tsx
import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { Toaster } from "sonner";
import { UserProvider } from "@/contexts/user-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
    <div className="flex h-screen dashboard-bg overflow-hidden relative">
      {/* Background ambient light effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-40 top-1/4 h-[600px] w-[600px] rounded-full bg-[#134235]/[0.03] blur-[150px]" />
        <div className="absolute -right-40 bottom-1/4 h-[500px] w-[500px] rounded-full bg-[#134235]/[0.02] blur-[120px]" />
      </div>

      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: { fontFamily: "var(--font-sans), system-ui, sans-serif" },
        }}
      />

      {/* Sidebar - hidden on mobile, visible on md+ */}
      <div className="hidden md:block z-20">
        <Sidebar />
      </div>

      {/* Mobile Header with hamburger menu */}
      <div className="md:hidden">
        <MobileHeader />
      </div>

      <main className="flex-1 overflow-y-auto md:ml-0 relative z-10">{children}</main>
    </div>
    </UserProvider>
  );
}
