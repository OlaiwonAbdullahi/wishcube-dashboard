/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  TruckIcon,
  Cancel01Icon,
  PackageIcon,
  Tick01Icon,
  ContainerIcon,
  DeliveryTruck01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

export function TrackingModal({
  accent,
  font,
  onClose,
  tracking,
}: {
  accent: string;
  font: string;
  onClose: () => void;
  tracking: any;
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
  console.log(tracking);
  const currentStatus = tracking.status;
  const history = tracking.statusHistory || [];

  const getStepStatus = (key: string) => {
    const statusIdx = steps.findIndex((s) => s.key === currentStatus);
    const stepIdx = steps.findIndex((s) => s.key === key);
    if (stepIdx < statusIdx) return "completed";
    if (stepIdx === statusIdx) return "current";
    return "pending";
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
                          : "text-slate-800",
                      )}
                    >
                      {step.label}
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

          {/* Confirmation Code Display */}
          {currentStatus === "awaiting_confirmation" && (
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
              <div
                className="p-4 rounded-xl border text-center"
                style={{
                  background: accent + "08",
                  borderColor: accent + "20",
                }}
              >
                <p
                  className="text-xs font-bold flex items-center justify-center gap-2 mb-3"
                  style={{ color: accent }}
                >
                  <HugeiconsIcon icon={PackageIcon} size={14} color={accent} />
                  Confirm Receipt
                </p>

                <p className="text-[12px] text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                  Provide this 6-digit code sent to your email to the vendor or
                  delivery person when you receive your gift. This confirms the
                  delivery was successful.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
