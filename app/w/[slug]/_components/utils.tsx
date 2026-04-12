"use client";

import React, { useEffect, useState } from "react";

export function useDynamicFont(font: string | undefined) {
  useEffect(() => {
    if (!font || font === "Inter") return;
    const id = `gfont-${font.replace(/\s/g, "-")}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;500;600;700;800&display=swap`;
    document.head.appendChild(link);
  }, [font]);
}

export function useCountdown(target?: string | null) {
  const [diff, setDiff] = useState<number | null>(null);
  useEffect(() => {
    if (!target) return;
    const tick = () => setDiff(new Date(target).getTime() - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (diff === null) return null;
  if (diff <= 0) return { past: true, d: 0, h: 0, m: 0, s: 0 };
  const s = Math.floor(diff / 1000);
  return {
    past: false,
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export function renderMessage(text: string) {
  return text.split("\n").map((line, li, arr) => {
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return (
      <React.Fragment key={li}>
        {parts.map((part, pi) => {
          if (part.startsWith("**") && part.endsWith("**"))
            return <strong key={pi}>{part.slice(2, -2)}</strong>;
          if (part.startsWith("*") && part.endsWith("*"))
            return <em key={pi}>{part.slice(1, -1)}</em>;
          return <span key={pi}>{part}</span>;
        })}
        {li < arr.length - 1 && <br />}
      </React.Fragment>
    );
  });
}
