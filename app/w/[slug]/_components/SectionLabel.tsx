/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";

export function SectionLabel({
  icon,
  label,
  accent,
  font,
}: {
  icon: any;
  label: string;
  accent: string;
  font: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div
        className="size-6 rounded-lg flex items-center justify-center"
        style={{ background: accent + "15" }}
      >
        <HugeiconsIcon icon={icon} size={12} color={accent} />
      </div>
      <p
        className="text-xs font-semibold uppercase tracking-wider text-slate-400"
        style={{ fontFamily: font }}
      >
        {label}
      </p>
    </div>
  );
}
