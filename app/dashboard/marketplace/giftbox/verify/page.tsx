/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Loading03Icon,
  ShoppingBag01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { verifyGiftPayment } from "@/lib/gifts";
import { usePaystackVerify } from "@/lib/use-paystack-verify";

function VerifyGiftInner() {
  const router = useRouter();
  const { state, data, message } = usePaystackVerify(verifyGiftPayment);
  const gift = data?.gift ?? null;
  const status =
    state === "verifying" || state === "pending"
      ? "loading"
      : state === "success"
        ? "success"
        : "error";

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-space flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-sm border-2 border-[#191A23] border-b-4 bg-white shadow-[4px_4px_0px_0px_rgba(25,26,35,0.12)] p-8 text-center space-y-5">
          {status === "loading" && (
            <>
              <div className="w-16 h-16 rounded-full bg-[#F3F3F3] flex items-center justify-center mx-auto">
                <HugeiconsIcon icon={Loading03Icon} size={32} color="#191A23" strokeWidth={1.5} className="animate-spin" />
              </div>
              <h1 className="text-xl font-black text-[#191A23]">
                {state === "pending" ? "Still processing…" : "Verifying Payment…"}
              </h1>
              <p className="text-sm text-neutral-500">
                {state === "pending"
                  ? "Paystack hasn't confirmed this payment yet — we'll keep checking automatically."
                  : "Please wait while we confirm your gift purchase."}
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 rounded-full bg-[#B4F8C8]/40 border-2 border-green-200 flex items-center justify-center mx-auto">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={32} color="#16a34a" strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl font-black text-[#191A23]">Gift Purchased! 🎁</h1>
              <p className="text-sm text-neutral-500">{message}</p>

              {gift && (
                <div className="rounded-sm border border-[#191A23]/10 bg-[#F9F9FB] p-4 text-left space-y-2">
                  {gift.productSnapshot?.name && (
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500 font-medium uppercase tracking-wide">Gift</span>
                      <span className="font-black text-[#191A23]">{gift.productSnapshot.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500 font-medium uppercase tracking-wide">Paid</span>
                    <span className="font-black text-[#191A23]">₦{gift.amountPaid?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500 font-medium uppercase tracking-wide">Status</span>
                    <span className="font-black capitalize text-amber-600">{gift.status}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500 font-medium uppercase tracking-wide">Escrow</span>
                    <span className="font-black text-[#191A23] capitalize">{gift.escrowStatus}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => router.push("/dashboard/marketplace/giftbox")}
                  className="w-full rounded-sm bg-[#191A23] text-white border-b-4 border-b-black hover:bg-[#191A23]/90 active:border-b-2 active:translate-y-0.5 transition-all font-bold py-5 gap-2"
                >
                  <HugeiconsIcon icon={ShoppingBag01Icon} size={16} color="white" strokeWidth={1.5} />
                  View My Gift Box
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/dashboard/marketplace")}
                  className="w-full font-bold text-sm text-neutral-500"
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto">
                <HugeiconsIcon icon={Cancel01Icon} size={32} color="#EF4444" strokeWidth={1.5} />
              </div>
              <h1 className="text-xl font-black text-[#191A23]">Verification Failed</h1>
              <p className="text-sm text-neutral-500">{message}</p>
              <Button
                onClick={() => router.push("/dashboard/marketplace")}
                className="w-full rounded-sm bg-[#191A23] text-white border-b-4 border-b-black font-bold py-5"
              >
                Back to Marketplace
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyGiftPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#191A23]" />
      </div>
    }>
      <VerifyGiftInner />
    </Suspense>
  );
}
