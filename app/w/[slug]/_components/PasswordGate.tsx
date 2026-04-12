"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockPasswordIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

export function PasswordGate({
  accent,
  font,
  recipientName,
  hasError,
  onUnlock,
}: {
  accent: string;
  font: string;
  recipientName: string;
  hasError: boolean;
  onUnlock: (input: string) => void;
}) {
  const [input, setInput] = useState("");

  const attempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onUnlock(input.trim());
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, ${accent}18 0%, white 60%)`,
        fontFamily: `'${font}', 'Inter', sans-serif`,
      }}
    >
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-3">
          <div
            className="size-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: accent }}
          >
            <HugeiconsIcon icon={LockPasswordIcon} size={28} color="white" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-slate-800"
              style={{ fontFamily: font }}
            >
              Private Page
            </h1>
            <p
              className="text-sm text-slate-500 mt-1"
              style={{ fontFamily: font }}
            >
              {recipientName}&apos;s WishCube is password-protected.
              <br />
              Enter the password to continue.
            </p>
          </div>
        </div>

        <form
          onSubmit={attempt}
          className={cn(
            "bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4 transition-all",
            hasError && "animate-bounce",
          )}
        >
          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold text-slate-600"
              style={{ fontFamily: font }}
            >
              Password
            </label>
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter password…"
              autoFocus
              className={cn(
                "w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2",
                hasError
                  ? "border-red-300 bg-red-50 focus:ring-red-200"
                  : "border-slate-200 focus:ring-opacity-30",
              )}
              style={
                {
                  fontFamily: font,
                  "--tw-ring-color": accent + "50",
                } as React.CSSProperties
              }
            />
            {hasError && (
              <p
                className="text-xs text-red-500 font-medium"
                style={{ fontFamily: font }}
              >
                Incorrect password. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ background: accent, fontFamily: font }}
          >
            <HugeiconsIcon icon={LockPasswordIcon} size={14} color="white" />
            Unlock
          </button>
        </form>

        <p
          className="text-center text-xs text-slate-400"
          style={{ fontFamily: font }}
        >
          Made with ♥ via{" "}
          <Link href="/" className="font-semibold" style={{ color: accent }}>
            WishCube
          </Link>
        </p>
      </div>
    </div>
  );
}
