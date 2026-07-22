"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const RULES: { label: string; test: (p: string) => boolean }[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "1 uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "1 lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "1 number", test: (p) => /[0-9]/.test(p) },
  { label: "1 special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export const isPasswordValid = (password: string) =>
  RULES.every((rule) => rule.test(password));

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
      {RULES.map((rule) => {
        const passed = rule.test(password);
        return (
          <li
            key={rule.label}
            className={cn(
              "flex items-center gap-1.5 text-[11px] font-medium transition-colors",
              passed ? "text-green-600" : "text-neutral-400",
            )}
          >
            {passed ? (
              <Check size={11} strokeWidth={3} />
            ) : (
              <X size={11} strokeWidth={2.5} />
            )}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
