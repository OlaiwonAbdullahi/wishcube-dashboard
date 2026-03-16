"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { StoreSidebar } from "./sidebar";
import { StoreHeader } from "./header";
import { useEffect, useState } from "react";
import { getAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface StoreLayoutProps {
  children: React.ReactNode;
}

export function StoreLayout({ children }: StoreLayoutProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    if (!auth) {
      router.push("/");
    } else if (auth.user.role !== "vendor") {
      router.push("/dashboard");
    } else {
      queueMicrotask(() => setIsAuthorized(true));
    }
    queueMicrotask(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F3F3F3]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#191A23]"></div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <SidebarProvider className="bg-[#F3F3F3] font-space text-[#191A23]">
      <StoreSidebar />
      <div className="h-svh overflow-hidden lg:p-2 w-full bg-[#191A23]/5 z-20">
        <div className="lg:border lg:border-[#191A23] lg:rounded-sm lg:border-b-8 overflow-hidden flex flex-col h-full w-full bg-white">
          <StoreHeader />
          <main className="w-full flex-1 overflow-auto bg-white">
            <div className="px-4 sm:px-6 py-8 space-y-8">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
