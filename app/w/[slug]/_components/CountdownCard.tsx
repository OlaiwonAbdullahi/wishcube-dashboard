"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon, Time01Icon } from "@hugeicons/core-free-icons";
import { useCountdown } from "./utils";

export function CountdownCard({
  target,
  accent,
  font,
}: {
  target: string;
  accent: string;
  font: string;
}) {
  const cd = useCountdown(target);
  if (!cd) return null;

  if (cd.past) {
    return (
      <div
        className="rounded-2xl p-5 text-center space-y-4"
        style={{ background: accent + "10", border: `1px solid ${accent}30` }}
      >
        <div className="flex flex-col items-center justify-center gap-2 py-4">
          <HugeiconsIcon
            icon={SparklesIcon}
            size={40}
            color={accent}
            className="animate-bounce"
          />
          <h3
            className="text-2xl font-black uppercase tracking-widest mt-2"
            style={{ color: accent, fontFamily: font }}
          >
            It&apos;s Today!
          </h3>
          <p
            className="text-sm font-medium text-slate-500"
            style={{ fontFamily: font }}
          >
            The special day has finally arrived 🎊
          </p>
        </div>
      </div>
    );
  }

  const units = [
    { label: "Days", val: cd.d },
    { label: "Hrs", val: cd.h },
    { label: "Min", val: cd.m },
    { label: "Sec", val: cd.s },
  ];
  return (
    <div
      className="rounded-2xl p-5 text-center space-y-4"
      style={{ background: accent + "10", border: `1px solid ${accent}30` }}
    >
      <div className="flex items-center justify-center gap-2">
        <HugeiconsIcon icon={Time01Icon} size={14} color={accent} />
        <p
          className="text-xs font-semibold text-slate-500 uppercase tracking-widest"
          style={{ fontFamily: font }}
        >
          Counting down to your special day
        </p>
      </div>
      <div className="flex justify-center gap-3">
        {units.map(({ label, val }) => (
          <div
            key={label}
            className="flex flex-col items-center bg-white rounded-xl px-3 py-2.5 min-w-[60px] shadow-sm"
          >
            <span
              className="text-2xl font-bold tabular-nums"
              style={{ color: accent, fontFamily: font }}
            >
              {String(val).padStart(2, "0")}
            </span>
            <span
              className="text-[9px] font-semibold uppercase text-slate-400 tracking-wider mt-0.5"
              style={{ fontFamily: font }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
