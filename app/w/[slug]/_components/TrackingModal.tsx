/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  TruckIcon,
  Cancel01Icon,
  PackageIcon,
  Tick01Icon,
  ContainerIcon,
  DeliveryTruck01Icon,
  Alert01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { confirmDelivery } from "@/lib/gifts";

const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

const formatRemaining = (ms: number) => {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours >= 1) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export function TrackingModal({
  accent,
  font,
  onClose,
  onConfirmed,
  tracking,
  orderId,
  token,
}: {
  accent: string;
  font: string;
  onClose: () => void;
  onConfirmed?: () => void;
  tracking: any;
  orderId?: string;
  token?: string;
}) {
  const steps = [
    { key: "processing", label: "Processing", icon: PackageIcon },
    { key: "out_for_delivery", label: "Out for Delivery", icon: TruckIcon },
    { key: "in_transit", label: "In Transit", icon: ContainerIcon },
    {
      key: "awaiting_confirmation",
      label: "Awaiting Conf.",
      icon: DeliveryTruck01Icon,
    },
    { key: "delivered", label: "Delivered", icon: Tick01Icon },
  ];
  const currentStatus = tracking.status;
  const history = tracking.statusHistory || [];
  const isDisputed = currentStatus === "disputed";
  // Disputes only ever happen from the awaiting_confirmation stage (3 failed
  // OTP attempts), so treat that as the reference point for the timeline.
  const effectiveStatus = isDisputed ? "awaiting_confirmation" : currentStatus;

  const [code, setCode] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [confirmedNow, setConfirmedNow] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const deadline = tracking.awaitingConfirmationAt
    ? new Date(tracking.awaitingConfirmationAt).getTime() + FORTY_EIGHT_HOURS_MS
    : null;
  const remainingMs = deadline ? deadline - now : null;
  const windowExpired = remainingMs !== null && remainingMs <= 0;

  const getStepStatus = (key: string) => {
    if (isDisputed && key === "awaiting_confirmation") return "disputed";
    const statusIdx = steps.findIndex((s) => s.key === effectiveStatus);
    const stepIdx = steps.findIndex((s) => s.key === key);
    if (stepIdx < statusIdx) return "completed";
    if (stepIdx === statusIdx) return "current";
    return "pending";
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !token || code.trim().length !== 6) return;
    setIsConfirming(true);
    setConfirmError(null);
    try {
      const res = await confirmDelivery(orderId, token, code.trim());
      if (res.success) {
        setConfirmedNow(true);
        toast.success("Delivery confirmed!");
        onConfirmed?.();
      } else {
        setConfirmError(res.message || "Incorrect code. Please try again.");
      }
    } catch {
      setConfirmError("Something went wrong. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ fontFamily: font }}
      >
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className="size-9 rounded-xl flex items-center justify-center"
              style={{ background: accent + "15" }}
            >
              <HugeiconsIcon icon={TruckIcon} size={18} color={accent} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Tracking Your Gift
              </h3>
              <p className="text-xs text-slate-400">
                Order #{tracking.trackingNumber || "N/A"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} color="#64748b" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Timeline */}
          <div className="space-y-6">
            {steps.map((step, idx) => {
              const status = getStepStatus(step.key);
              const hist = history.find((h: any) => h.status === step.key);
              return (
                <div key={step.key} className="flex gap-4 relative">
                  {idx !== steps.length - 1 && (
                    <div
                      className={cn(
                        "absolute left-4 top-8 bottom-0 w-0.5 -translate-x-1/2",
                        status === "completed"
                          ? "bg-emerald-500"
                          : "bg-slate-100",
                      )}
                    />
                  )}
                  <div
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center shrink-0 z-10",
                      status === "completed"
                        ? "bg-emerald-500"
                        : status === "disputed"
                          ? "bg-red-500"
                          : status === "current"
                            ? "bg-white border-2"
                            : "bg-slate-50 border border-slate-200",
                    )}
                    style={status === "current" ? { borderColor: accent } : {}}
                  >
                    {status === "completed" ? (
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        size={14}
                        color="white"
                      />
                    ) : status === "disputed" ? (
                      <HugeiconsIcon
                        icon={Alert01Icon}
                        size={14}
                        color="white"
                      />
                    ) : (
                      <HugeiconsIcon
                        icon={step.icon}
                        size={14}
                        color={status === "current" ? accent : "#94a3b8"}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4
                      className={cn(
                        "text-sm font-bold",
                        status === "pending"
                          ? "text-slate-400"
                          : status === "disputed"
                            ? "text-red-600"
                            : "text-slate-800",
                      )}
                    >
                      {status === "disputed" ? "Disputed" : step.label}
                    </h4>
                    {hist && (
                      <div className="text-xs text-slate-500 mt-0.5 space-y-1">
                        <p>
                          {new Date(hist.updatedAt).toLocaleString("en-NG", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {hist.note && (
                          <p className="italic text-slate-400">
                            &ldquo;{hist.note}&rdquo;
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Disputed banner */}
          {isDisputed && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-center space-y-2">
                <p className="text-xs font-bold text-red-600 flex items-center justify-center gap-2">
                  <HugeiconsIcon icon={Alert01Icon} size={14} color="#dc2626" />
                  Delivery Disputed
                </p>
                <p className="text-[12px] text-red-500 leading-relaxed max-w-[280px] mx-auto">
                  Too many incorrect codes were entered, so this order is now
                  under manual review by our team. Your funds remain safely
                  held in escrow until it&apos;s resolved — we&apos;ll email
                  you with an update.
                </p>
              </div>
            </div>
          )}

          {/* Confirmation Code / self-confirm form */}
          {currentStatus === "awaiting_confirmation" && (
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
              <div
                className="p-4 rounded-xl border text-center space-y-3"
                style={{
                  background: accent + "08",
                  borderColor: accent + "20",
                }}
              >
                <p
                  className="text-xs font-bold flex items-center justify-center gap-2"
                  style={{ color: accent }}
                >
                  <HugeiconsIcon icon={PackageIcon} size={14} color={accent} />
                  Confirm Receipt
                </p>

                <p className="text-[12px] text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                  Read this 6-digit code out to the vendor or delivery person
                  when you receive your gift — or confirm it yourself below if
                  they&apos;re unable to.
                </p>

                {!windowExpired && remainingMs !== null && (
                  <p className="text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 inline-block">
                    Self-confirm window closes in {formatRemaining(remainingMs)}
                  </p>
                )}

                {confirmedNow ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-600 text-sm font-bold pt-1">
                    <HugeiconsIcon icon={Tick01Icon} size={16} color="#059669" />
                    Delivery confirmed!
                  </div>
                ) : windowExpired ? (
                  <p className="text-[12px] text-slate-400 italic pt-1">
                    The 48-hour self-confirm window has passed. Please contact
                    the vendor if your gift hasn&apos;t arrived.
                  </p>
                ) : orderId && token ? (
                  <form onSubmit={handleConfirm} className="space-y-2 pt-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="6-digit code"
                      className="w-full text-center tracking-[0.3em] font-bold text-sm px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2"
                      style={{ ["--tw-ring-color" as string]: accent + "50" }}
                    />
                    {confirmError && (
                      <p className="text-[11px] text-red-500 font-medium">
                        {confirmError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={isConfirming || code.length !== 6}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90 disabled:opacity-40"
                      style={{ background: accent }}
                    >
                      {isConfirming ? (
                        <HugeiconsIcon
                          icon={Loading03Icon}
                          size={13}
                          color="white"
                          className="animate-spin"
                        />
                      ) : (
                        <HugeiconsIcon icon={Tick01Icon} size={13} color="white" />
                      )}
                      {isConfirming ? "Confirming…" : "I've received it — confirm"}
                    </button>
                  </form>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
