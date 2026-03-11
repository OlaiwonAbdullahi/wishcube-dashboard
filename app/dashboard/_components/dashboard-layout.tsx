"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./sidebar";
import { DashboardHeader } from "./header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider className="bg-[#F3F3F3] font-space text-[#191A23]">
      <DashboardSidebar />
      <div className="h-svh overflow-hidden lg:p-2 w-full bg-[#191A23]/5 z-20">
        <div className="lg:border lg:border-[#191A23] lg:rounded-sm lg:border-b-8 overflow-hidden flex flex-col h-full w-full bg-white">
          <DashboardHeader />
          <main className="w-full flex-1 overflow-auto bg-white">
            <div className="px-4 sm:px-6 py-8 space-y-8">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
