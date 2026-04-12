"use client";

import React, { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GiftIcon, Cancel01Icon, Loading03Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { getBanks } from "@/lib/vendor";
import { BankDetails, DeliveryAddress, RedeemPayload } from "./types";

export function RedeemModal({
  accent,
  font,
  giftType,
  onClose,
  onSubmit,
  isLoading,
}: {
  accent: string;
  font: string;
  giftType: string;
  onClose: () => void;
  onSubmit: (payload: RedeemPayload) => void;
  isLoading: boolean;
}) {
  const isPhysical = giftType === "physical";

  const [bank, setBank] = useState<BankDetails>({
    accountName: "",
    accountNumber: "",
    bankCode: "",
    bankName: "",
  });

  const [banksList, setBanksList] = useState<{ name: string; code: string }[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(!isPhysical);

  useEffect(() => {
    if (!isPhysical) {
      getBanks()
        .then((res) => {
          if (res.success && res.data?.banks) {
            const fetchedBanks = res.data.banks;
            setBanksList(fetchedBanks);
            if (fetchedBanks.length > 0) {
              setBank((prev) => ({
                ...prev,
                bankName: prev.bankName || fetchedBanks[0].name,
                bankCode: prev.bankCode || fetchedBanks[0].code,
              }));
            }
          }
        })
        .finally(() => setLoadingBanks(false));
    }
  }, [isPhysical]);

  const [delivery, setDelivery] = useState<DeliveryAddress>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPhysical) {
      onSubmit({ deliveryAddress: delivery });
    } else {
      onSubmit({ bankDetails: bank });
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
              <HugeiconsIcon icon={GiftIcon} size={18} color={accent} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Redeem Your Gift
              </h3>
              <p className="text-xs text-slate-400">
                {isPhysical
                  ? "Enter your delivery address"
                  : "Enter your bank details to receive funds"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} color="#64748b" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isPhysical ? (
            <>
              {(
                [
                  { id: "fullName", label: "Full Name", placeholder: "Recipient's full name" },
                  { id: "email", label: "Email Address", placeholder: "your@email.com" },
                  { id: "phone", label: "Phone Number", placeholder: "08012345678" },
                  { id: "address", label: "Street Address", placeholder: "House number, street name" },
                  { id: "city", label: "City", placeholder: "City" },
                  { id: "state", label: "State", placeholder: "State" },
                ] as const
              ).map(({ id, label, placeholder }) => (
                <div key={id} className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600" style={{ fontFamily: font }}>
                    {label}
                  </label>
                  <input
                    type="text"
                    required
                    value={delivery[id]}
                    onChange={(e) => setDelivery({ ...delivery, [id]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 text-sm transition-all"
                    style={{ fontFamily: font }}
                  />
                </div>
              ))}
            </>
          ) : (
            <>
              {(
                [
                  { id: "accountName", label: "Account Name", type: "text", placeholder: "Full name as on account", maxLength: undefined },
                  { id: "accountNumber", label: "Account Number", type: "text", placeholder: "10-digit number", maxLength: 10 },
                ] as const
              ).map(({ id, label, type, placeholder, maxLength }) => (
                <div key={id} className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600" style={{ fontFamily: font }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    required
                    maxLength={maxLength}
                    value={bank[id]}
                    onChange={(e) => setBank({ ...bank, [id]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 text-sm transition-all"
                    style={{ fontFamily: font }}
                  />
                </div>
              ))}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600" style={{ fontFamily: font }}>
                  Bank
                </label>
                <select
                  value={bank.bankName}
                  onChange={(e) => {
                    const b = banksList.find((x) => x.name === e.target.value);
                    setBank({
                      ...bank,
                      bankName: e.target.value,
                      bankCode: b?.code ?? "",
                    });
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none text-sm bg-white appearance-none cursor-pointer"
                  style={{ fontFamily: font }}
                >
                  {loadingBanks ? (
                    <option>Loading banks...</option>
                  ) : (
                    banksList.map((b) => (
                      <option key={b.code} value={b.name}>
                        {b.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: accent, fontFamily: font }}
          >
            {isLoading ? (
              <>
                <HugeiconsIcon icon={Loading03Icon} size={16} color="white" className="animate-spin" />
                Processing…
              </>
            ) : (
              <>
                {isPhysical ? "Confirm Delivery Address" : "Confirm Redemption"}
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="white" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
