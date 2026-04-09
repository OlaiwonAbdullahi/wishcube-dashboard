"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Loading03Icon,
  ArrowLeft01Icon,
  Crown02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { verifySubscription, SubscriptionStatusData } from "@/lib/subscriptions";

function VerifySubscriptionInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [data, setData] = useState<SubscriptionStatusData | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      setMessage("No payment reference found.");
      return;
    }

    const verify = async () => {
      const res = await verifySubscription(reference);
      if (res.success && res.data) {
        setData(res.data);
        setStatus("success");
        setMessage(res.message || "Subscription activated successfully!");
      } else {
        setStatus("error");
        setMessage(res.message || "Could not verify subscription.");
      }
    };

    verify();
  }, [reference]);

  const tierLabel = data?.tier
    ? data.tier.charAt(0).toUpperCase() + data.tier.slice(1)
    : "";

  const tierColors: Record<string, string> = {
    pro: "#9151FF",
    premium: "#F59E0B",
  };
  const accentColor = data?.tier ? tierColors[data.tier] || "#191A23" : "#191A23";

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-space flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Card */}
        <div className="rounded-sm border-2 border-[#191A23] border-b-4 bg-white shadow-[4px_4px_0px_0px_rgba(25,26,35,0.12)] p-8 text-center space-y-5">
          {status === "loading" && (
            <>
              <div className="w-16 h-16 rounded-full bg-[#F3F3F3] border-2 border-[#191A23]/10 flex items-center justify-center mx-auto">
                <HugeiconsIcon
                  icon={Loading03Icon}
                  size={32}
                  color="#191A23"
                  strokeWidth={1.5}
                  className="animate-spin"
                />
              </div>
              <h1 className="text-xl font-black text-[#191A23]">Verifying Payment…</h1>
              <p className="text-sm text-neutral-500">
                Please wait while we confirm your subscription.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto border-2"
                style={{
                  backgroundColor: `${accentColor}18`,
                  borderColor: `${accentColor}40`,
                }}
              >
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={32}
                  color={accentColor}
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <div
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border mb-3"
                  style={{
                    background: `${accentColor}18`,
                    borderColor: `${accentColor}40`,
                    color: accentColor,
                  }}
                >
                  <HugeiconsIcon icon={Crown02Icon} size={12} color={accentColor} strokeWidth={2} />
                  {tierLabel} Plan
                </div>
                <h1 className="text-2xl font-black text-[#191A23]">You&apos;re all set! 🎉</h1>
                <p className="text-sm text-neutral-500 mt-1">{message}</p>
              </div>

              {data && (
                <div className="rounded-sm border border-[#191A23]/10 bg-[#F9F9FB] p-4 text-left space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500 font-medium uppercase tracking-wide">Plan</span>
                    <span className="font-black text-[#191A23]">{tierLabel}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500 font-medium uppercase tracking-wide">Status</span>
                    <span className="font-black text-green-600 capitalize">{data.status}</span>
                  </div>
                  {data.expiry && (
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500 font-medium uppercase tracking-wide">Expires</span>
                      <span className="font-black text-[#191A23]">
                        {new Date(data.expiry).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full rounded-sm bg-[#191A23] text-white border-b-4 border-b-black hover:bg-[#191A23]/90 active:border-b-2 active:translate-y-0.5 transition-all font-bold py-5"
              >
                Back to Dashboard
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto">
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={32}
                  color="#EF4444"
                  strokeWidth={1.5}
                />
              </div>
              <h1 className="text-xl font-black text-[#191A23]">Verification Failed</h1>
              <p className="text-sm text-neutral-500">{message}</p>
              <Button
                onClick={() => router.push("/dashboard/pricing")}
                variant="outline"
                className="w-full rounded-sm border-2 border-[#191A23] font-bold"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} color="#191A23" className="mr-2" />
                Back to Pricing
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifySubscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#191A23]" />
        </div>
      }
    >
      <VerifySubscriptionInner />
    </Suspense>
  );
}
