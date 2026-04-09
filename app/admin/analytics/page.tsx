"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Analytics01Icon } from "@hugeicons/core-free-icons";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#191A23] uppercase tracking-tight">
            Platform Analytics
          </h1>
          <p className="text-sm font-medium text-neutral-500 uppercase mt-1 tracking-wider">
            Detailed performance and growth metrics
          </p>
        </div>
        <div className="p-3 rounded-sm border-2 border-[#191A23] bg-cyan-50">
          <HugeiconsIcon icon={Analytics01Icon} size={24} className="text-cyan-500" />
        </div>
      </div>

      <div className="bg-white border-4 border-dashed border-[#191A23]/20 rounded-sm p-20 flex flex-col items-center justify-center text-center">
        <HugeiconsIcon icon={Analytics01Icon} size={48} className="text-[#191A23]/20 mb-4" />
        <h2 className="text-xl font-black uppercase text-[#191A23]/40">Analytics Dashboard Coming Soon</h2>
        <p className="text-sm font-bold uppercase text-[#191A23]/20 mt-2">Connecting to the analytics data stream...</p>
      </div>
    </div>
  );
}
