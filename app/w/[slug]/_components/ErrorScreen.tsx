"use client";

import React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Time01Icon,
  SparklesIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

export function ErrorScreen({ expired = false }: { expired?: boolean }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="text-center space-y-5 p-10 bg-white rounded-3xl shadow-xl max-w-sm w-full">
        <div className="size-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
          <HugeiconsIcon
            icon={expired ? Time01Icon : SparklesIcon}
            size={28}
            color="#94a3b8"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {expired ? "This page has expired" : "Page not found"}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            {expired
              ? "The link is no longer active."
              : "This link is incorrect or has been removed."}
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors"
        >
          Create your own
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="white" />
        </Link>
      </div>
    </div>
  );
}
