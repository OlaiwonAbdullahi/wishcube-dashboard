import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DashboardHeaderProps {
  userName: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-[#191A23] uppercase tracking-tight">
          Store Overview
        </h1>
        <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
          Welcome back,{" "}
          <span className="text-[#191A23] font-black">{userName}</span>.
          Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          asChild
          className="h-12 border-2 border-[#191A23] rounded-none bg-[#B4F8C8] text-[#191A23] font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] transition-all"
        >
          <Link
            href="/mystore/products/new"
            className="gap-2 flex items-center"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={18} />
            Add Product
          </Link>
        </Button>
      </div>
    </div>
  );
}
