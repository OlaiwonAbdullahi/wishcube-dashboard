"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyWalletFunding } from "@/lib/wallet";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Loading03Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  WalletAdd02Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

type VerifyState = "verifying" | "success" | "error" | "invalid_ref";

interface ResultMeta {
  newBalance?: number;
  message?: string;
}

function VerifyPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [state, setState] = useState<VerifyState>("verifying");
  const [meta, setMeta] = useState<ResultMeta>({});

  useEffect(() => {
    const ref = searchParams.get("reference") || searchParams.get("trxref");

    if (!ref || ref.trim() === "") {
      // No reference at all — wrong URL
      setState("invalid_ref");
      return;
    }

    const verify = async () => {
      try {
        const res = await verifyWalletFunding(ref);

        if (res.success && res.data) {
          setState("success");
          setMeta({ newBalance: res.data.newBalance });
        } else {
          // API returned failure — could be wrong ref, expired, already used, etc.
          setState("error");
          setMeta({
            message:
              res.message ||
              "We could not verify this transaction. The reference may be invalid, expired, or already used.",
          });
        }
      } catch {
        setState("error");
        setMeta({
          message:
            "A network error occurred while verifying your payment. Please check your internet connection and try again.",
        });
      }
    };

    verify();
  }, [searchParams]);

  /* ── VERIFYING ─────────────────────────────────────────── */
  if (state === "verifying") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 font-space">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full bg-[#191A23]/5 flex items-center justify-center">
            <HugeiconsIcon
              icon={Loading03Icon}
              size={32}
              color="#191A23"
              strokeWidth={1.5}
              className="animate-spin"
            />
          </div>
          <p className="text-lg font-bold text-[#191A23]">
            Verifying your payment…
          </p>
          <p className="text-sm text-neutral-500">
            Please wait, this only takes a second.
          </p>
        </div>
      </div>
    );
  }

  /* ── SUCCESS ────────────────────────────────────────────── */
  if (state === "success") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 font-space">
        <div className="w-full max-w-md rounded-sm border-2 border-[#191A23] border-b-4 bg-white p-8 space-y-6 shadow-[4px_4px_0px_0px_rgba(25,26,35,0.15)] text-center">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 border-2 border-green-400 flex items-center justify-center">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={32}
                color="#16a34a"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Copy */}
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-[#191A23]">
              Payment Successful!
            </h1>
            <p className="text-sm text-neutral-500">
              Your wallet has been topped up successfully.
            </p>
          </div>

          {/* New balance pill */}
          {meta.newBalance !== undefined && (
            <div className="inline-flex items-center gap-2 bg-[#F3F3F3] border border-[#191A23]/20 rounded-sm px-4 py-2">
              <HugeiconsIcon
                icon={WalletAdd02Icon}
                size={16}
                color="#191A23"
                strokeWidth={1.5}
              />
              <span className="text-sm font-bold text-[#191A23]">
                New balance:{" "}
                <span className="text-green-600">
                  ₦{meta.newBalance.toLocaleString()}
                </span>
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              id="go-to-wallet-btn"
              onClick={() => router.push("/dashboard/wallet")}
              className="w-full rounded-sm bg-[#191A23] text-white border-b-4 border-b-black hover:bg-[#191A23]/90 active:border-b-2 active:translate-y-0.5 transition-all font-bold py-5"
            >
              View My Wallet
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="w-full font-bold text-[#191A23]/70 hover:text-[#191A23]"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ── INVALID REFERENCE (no ref in URL) ─────────────────── */
  if (state === "invalid_ref") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 font-space">
        <div className="w-full max-w-md rounded-sm border-2 border-[#191A23] border-b-4 bg-white p-8 space-y-6 shadow-[4px_4px_0px_0px_rgba(25,26,35,0.15)] text-center">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 border-2 border-yellow-400 flex items-center justify-center">
              <HugeiconsIcon
                icon={AlertCircleIcon}
                size={32}
                color="#ca8a04"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Copy */}
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-[#191A23]">Invalid Link</h1>
            <p className="text-sm text-neutral-500 leading-relaxed">
              This verification link is missing a transaction reference. If you
              were redirected here from Paystack, please contact support.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              id="fund-wallet-again-btn"
              onClick={() => router.push("/dashboard/wallet")}
              className="w-full rounded-sm bg-[#191A23] text-white border-b-4 border-b-black hover:bg-[#191A23]/90 active:border-b-2 active:translate-y-0.5 transition-all font-bold py-5"
            >
              Go to Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ── ERROR (wrong ref / expired / network) ─────────────── */
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 font-space">
      <div className="w-full max-w-md rounded-sm border-2 border-[#191A23] border-b-4 bg-white p-8 space-y-6 shadow-[4px_4px_0px_0px_rgba(25,26,35,0.15)] text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-100 border-2 border-red-400 flex items-center justify-center">
            <HugeiconsIcon
              icon={AlertCircleIcon}
              size={32}
              color="#dc2626"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Copy */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-[#191A23]">
            Verification Failed
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            {meta.message}
          </p>
        </div>

        {/* Reference display for debugging / support */}
        {searchParams.get("reference") || searchParams.get("trxref") ? (
          <div className="bg-[#F3F3F3] rounded-sm border border-[#191A23]/10 px-4 py-2 text-left">
            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400 mb-1">
              Reference
            </p>
            <p className="text-xs font-mono text-[#191A23] break-all">
              {searchParams.get("reference") || searchParams.get("trxref")}
            </p>
          </div>
        ) : null}

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <Button
            id="retry-fund-btn"
            onClick={() => router.push("/dashboard/wallet")}
            className="w-full rounded-sm bg-[#191A23] text-white border-b-4 border-b-black hover:bg-[#191A23]/90 active:border-b-2 active:translate-y-0.5 transition-all font-bold py-5"
          >
            <HugeiconsIcon
              icon={WalletAdd02Icon}
              size={18}
              color="white"
              strokeWidth={1.5}
              className="mr-2"
            />
            Try Funding Again
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="w-full font-bold text-[#191A23]/70 hover:text-[#191A23]"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={16}
              color="currentColor"
              strokeWidth={1.5}
              className="mr-1"
            />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#191A23]" />
        </div>
      }
    >
      <VerifyPageInner />
    </Suspense>
  );
}
