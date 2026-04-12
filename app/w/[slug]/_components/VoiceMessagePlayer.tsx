"use client";

import React, { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mic01Icon, StopIcon, PlayCircleIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

export function VoiceMessagePlayer({
  url,
  accent,
  font,
}: {
  url: string;
  accent: string;
  font: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onLoaded = () => setDuration(el.duration || 0);
    const onTime = () => {
      setElapsed(el.currentTime);
      setProgress(el.duration ? el.currentTime / el.duration : 0);
    };
    const onEnded = () => setPlaying(false);
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
    };
  }, []);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play();
      setPlaying(true);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    el.currentTime = ratio * duration;
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <audio ref={audioRef} src={url} preload="metadata" />

      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{ background: accent + "10" }}
      >
        <div
          className="size-7 rounded-lg flex items-center justify-center"
          style={{ background: accent + "20" }}
        >
          <HugeiconsIcon icon={Mic01Icon} size={14} color={accent} />
        </div>
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: accent, fontFamily: font }}
        >
          Voice Message
        </p>
        <p
          className="ml-auto text-[10px] text-slate-400"
          style={{ fontFamily: font }}
        >
          from the sender
        </p>
      </div>

      <div className="px-5 py-5 space-y-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="size-12 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-105 active:scale-95 shadow-md"
            style={{ background: accent }}
          >
            <HugeiconsIcon
              icon={playing ? StopIcon : PlayCircleIcon}
              size={20}
              color="white"
            />
          </button>

          <div className="flex items-center gap-[3px] flex-1 h-8">
            {Array.from({ length: 28 }).map((_, i) => {
              const h = [
                60, 40, 80, 50, 90, 35, 70, 55, 85, 45, 75, 50, 65, 80, 40, 95,
                55, 70, 45, 85, 50, 60, 75, 40, 90, 55, 65, 45,
              ][i];
              const filled = progress * 28 > i;
              return (
                <div
                  key={i}
                  className={cn(
                    "rounded-full transition-all",
                    playing && filled ? "animate-pulse" : "",
                  )}
                  style={{
                    width: "3px",
                    height: `${h}%`,
                    background: filled ? accent : "#E2E8F0",
                    animationDelay: `${i * 40}ms`,
                  }}
                />
              );
            })}
          </div>

          <span
            className="text-xs text-slate-400 tabular-nums shrink-0"
            style={{ fontFamily: font }}
          >
            {fmt(elapsed)}
            {duration > 0 && (
              <span className="text-slate-300"> / {fmt(duration)}</span>
            )}
          </span>
        </div>

        <div
          className="w-full h-1.5 bg-slate-100 rounded-full cursor-pointer overflow-hidden"
          onClick={seek}
        >
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${progress * 100}%`, background: accent }}
          />
        </div>

        <p
          className="text-xs text-slate-400 text-center"
          style={{ fontFamily: font }}
        >
          Tap play to hear a personal voice message 🎙️
        </p>
      </div>
    </div>
  );
}
