"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { PackageSearch01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface EmptyStateProps {
  icon?: any;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-8 rounded-sm border-2 border-dashed border-[#191A23]/15 bg-white space-y-4">
      <div className="w-14 h-14 rounded-sm border-2 border-[#191A23]/10 bg-[#F5F5F5] flex items-center justify-center">
        {Icon ? (
          <Icon className="w-7 h-7 text-neutral-400" />
        ) : (
          <HugeiconsIcon icon={PackageSearch01Icon} size={28} className="text-neutral-400" />
        )}
      </div>
      <div className="space-y-1">
        <h3 className={cn("font-black text-base uppercase tracking-tight text-[#191A23]")}>
          {title}
        </h3>
        <p className="text-xs text-neutral-400 font-medium max-w-xs">{description}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
