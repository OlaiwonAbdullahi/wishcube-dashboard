"use client";

import { useEffect, useState, Suspense } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Wallet02Icon,
  WalletAdd02Icon,
  Loading03Icon,
  ArrowLeft01Icon,
  Money04Icon,
  ShieldCheck,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getWalletBalance, fundWallet } from "@/lib/wallet";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import TransactionList from "@/app/dashboard/wallet/_components/transaction-list";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

function WalletPageInner() {
  const router = useRouter();

  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [funding, setFunding] = useState(false);

  const fetchBalance = async () => {
    setBalanceLoading(true);
    const res = await getWalletBalance();
    if (res.success && res.data) {
      setBalance(res.data.walletBalance);
    } else {
      toast.error(res.message || "Could not fetch balance");
    }
    setBalanceLoading(false);
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleFund = async () => {
    const parsed = parseFloat(amount);
    if (!parsed || parsed < 100) {
      toast.error("Minimum funding amount is ₦100");
      return;
    }
    setFunding(true);
    const callbackUrl = `${window.location.origin}/dashboard/wallet/verify`;
    const res = await fundWallet(parsed, callbackUrl);
    if (res.success && res.data) {
      window.location.href = res.data.paymentUrl;
    } else {
      toast.error(res.message || "Failed to initialize payment");
      setFunding(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FAFAFA] to-[#F5F5F5] font-space">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="flex items-center gap-4">
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
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#191A23]">
              My Wallet
            </h1>
            <p className="text-sm text-neutral-500">
              Manage your funds and top up your balance
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-sm border-2 border-[#191A23] border-b-4 bg-[#191A23] text-white p-6 shadow-[4px_4px_0px_0px_rgba(25,26,35,0.3)]">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-12 -left-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">
                Wallet Balance
              </p>
              {balanceLoading ? (
                <div className="h-10 w-36 bg-white/10 rounded animate-pulse" />
              ) : (
                <p className="text-4xl font-black tracking-tight">
                  ₦{(balance ?? 0).toLocaleString()}
                </p>
              )}
              <p className="text-xs text-white/40 font-medium mt-1">
                Nigerian Naira (NGN)
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <HugeiconsIcon
                icon={Wallet02Icon}
                size={24}
                color="white"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>

        {/* Fund Wallet Card */}
        <div className="rounded-sm border-2 border-[#191A23] border-b-4 bg-white p-6 space-y-6 shadow-[4px_4px_0px_0px_rgba(25,26,35,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#E6D1FF] border border-[#191A23] flex items-center justify-center">
              <HugeiconsIcon
                icon={WalletAdd02Icon}
                size={20}
                color="#191A23"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h2 className="text-base font-black text-[#191A23]">
                Fund Wallet
              </h2>
              <p className="text-xs text-neutral-500">Minimum amount: ₦100</p>
            </div>
          </div>

          {/* Quick amount selector */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide text-neutral-400">
              Quick select
            </p>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(String(preset))}
                  className={cn(
                    "py-2 px-3 rounded-sm text-sm font-bold border transition-all",
                    amount === String(preset)
                      ? "bg-[#191A23] text-white border-[#191A23]"
                      : "bg-[#F3F3F3] text-[#191A23] border-[#191A23]/20 hover:border-[#191A23]/60 hover:bg-[#191A23]/5",
                  )}
                >
                  ₦{preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount input */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide text-neutral-400">
              Or enter custom amount
            </p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#191A23]/50">
                ₦
              </span>
              <Input
                id="wallet-amount"
                type="number"
                min={100}
                placeholder="e.g. 3500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7 border-[#191A23]/30 focus-visible:ring-[#191A23] rounded-sm font-bold text-[#191A23]"
              />
            </div>
          </div>

          <Button
            id="fund-wallet-btn"
            onClick={handleFund}
            disabled={funding || !amount}
            className="w-full rounded-sm bg-[#191A23] text-white border-b-4 border-b-black hover:bg-[#191A23]/90 active:border-b-2 active:translate-y-0.5 transition-all font-bold py-5 text-sm"
          >
            {funding ? (
              <span className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Loading03Icon}
                  size={16}
                  color="white"
                  strokeWidth={1.5}
                  className="animate-spin"
                />
                Initializing payment…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Money04Icon}
                  size={18}
                  color="white"
                  strokeWidth={1.5}
                />
                {amount && parseFloat(amount) >= 100
                  ? `Pay ₦${parseFloat(amount).toLocaleString()} via Paystack`
                  : "Proceed to Payment"}
              </span>
            )}
          </Button>
        </div>

        {/* Transactions List */}
        <TransactionList />

        {/* Security note */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
          <HugeiconsIcon
            icon={ShieldCheck}
            size={14}
            color="currentColor"
            strokeWidth={1.5}
          />
          <span>
            Payments are processed securely via Paystack. Your card details are
            never stored.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function WalletPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#191A23]" />
        </div>
      }
    >
      <WalletPageInner />
    </Suspense>
  );
}
