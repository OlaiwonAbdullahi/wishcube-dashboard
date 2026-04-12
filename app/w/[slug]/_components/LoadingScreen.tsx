"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { RocketIcon } from "@hugeicons/core-free-icons";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 gap-5">
      <div className="relative size-16">
        <div className="absolute inset-0 rounded-full border-4 border-violet-200 border-t-violet-500 animate-spin" />
        <div className="absolute inset-3 rounded-full bg-white flex items-center justify-center">
          <HugeiconsIcon icon={RocketIcon} size={18} color="#6366f1" />
        </div>
      </div>
      <p className="text-sm text-slate-400 font-medium animate-pulse">
        Opening your Wishcube…
      </p>
    </div>
  );
}
