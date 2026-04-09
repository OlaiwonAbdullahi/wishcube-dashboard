"use client";

import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Confetti,
  Notification03Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

const FEATURES = [
  "Real-time collaborative countdowns",
  "Shared wish lists & group gifting",
  "Live party notifications & reminders",
  "Custom party themes & invites",
];

export default function PartyRoomPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-space flex flex-col">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 flex flex-col gap-8">
        {/* Back button */}
        <div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="rounded-sm border border-[#191A23]/20 hover:bg-[#191A23]/5"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={18}
              color="#191A23"
              strokeWidth={1.5}
            />
          </Button>
        </div>

        {/* Main card */}
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
          {/* Icon */}
          <div className="relative">
            <div className="w-24 h-24 rounded-sm border-2 border-[#191A23] border-b-4 bg-[#F8D1FF] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(25,26,35,0.2)]">
              <HugeiconsIcon
                icon={Confetti}
                size={44}
                color="#191A23"
                strokeWidth={1.5}
              />
            </div>
            {/* Floating dot accents */}
            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#9151FF] border-2 border-white" />
            <span className="absolute -bottom-2 -left-3 w-3 h-3 rounded-full bg-[#F59E0B] border-2 border-white" />
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-[#191A23]/20 bg-white text-[10px] font-black uppercase tracking-widest text-[#191A23]/50">
              Coming Soon
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#191A23]">
              Party Room 🎉
            </h1>
            <p className="text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
              We&apos;re building something special. Party Room will make group
              celebrations effortless — from countdowns to shared wishlists.
            </p>
          </div>

          {/* Feature teaser list */}
          <div className="w-full max-w-sm rounded-sm border-2 border-[#191A23] border-b-4 bg-white shadow-[4px_4px_0px_0px_rgba(25,26,35,0.1)] p-5 text-left space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              What&apos;s coming
            </p>
            {FEATURES.map((feat, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-sm bg-[#F8D1FF] border border-[#191A23]/20 flex items-center justify-center shrink-0 text-[10px] font-black text-[#191A23]">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-[#191A23]">
                  {feat}
                </span>
              </div>
            ))}
          </div>

          {/* Notify CTA */}
          <Button
            className="rounded-sm bg-[#191A23] text-white border-b-4 border-b-black hover:bg-[#191A23]/90 active:border-b-2 active:translate-y-0.5 transition-all font-bold px-6 py-5 text-sm"
            onClick={() => router.push("/dashboard")}
          >
            <HugeiconsIcon
              icon={Notification03Icon}
              size={16}
              color="white"
              strokeWidth={1.5}
              className="mr-2"
            />
            Notify Me When It&apos;s Ready
          </Button>
        </div>
      </div>
    </div>
  );
}
