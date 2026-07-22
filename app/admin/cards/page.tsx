"use client";

import React, { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cards02Icon } from "@hugeicons/core-free-icons";
import { getAdminCards } from "@/lib/admin";
import { toast } from "sonner";

interface AdminCard {
  _id: string;
  recipientName: string;
  senderName: string;
  occasion: string;
  status: string;
  downloadCount: number;
  createdAt: string;
  userId?: { name?: string; email?: string };
}

export default function AdminCardsPage() {
  const [cards, setCards] = useState<AdminCard[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const res = await getAdminCards();
        if (res.success && res.data) {
          setCards(res.data.cards);
          setTotal(res.data.total);
        } else {
          toast.error(res.message || "Failed to load cards");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#191A23] uppercase tracking-tight">
            Card Management
          </h1>
          <p className="text-sm font-medium text-neutral-500 uppercase mt-1 tracking-wider">
            {loading ? "Loading…" : `${total} cards created on the platform`}
          </p>
        </div>
        <div className="p-3 rounded-sm border-2 border-[#191A23] bg-amber-50">
          <HugeiconsIcon icon={Cards02Icon} size={24} className="text-amber-500" />
        </div>
      </div>

      <div className="border-2 border-[#191A23] rounded-sm shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-[#191A23] bg-neutral-50">
                {["Recipient", "Occasion", "Created By", "Status", "Downloads", "Created"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-neutral-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#191A23]/10">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-3 bg-neutral-100 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : cards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <HugeiconsIcon icon={Cards02Icon} size={32} className="text-neutral-200" />
                      <p className="text-sm font-bold uppercase text-neutral-400">No cards yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                cards.map((card) => (
                  <tr key={card._id} className="hover:bg-[#F3F3F3] transition-colors">
                    <td className="px-5 py-4 text-sm font-bold text-[#191A23]">{card.recipientName}</td>
                    <td className="px-5 py-4 text-xs font-medium text-neutral-500">{card.occasion}</td>
                    <td className="px-5 py-4 text-xs">
                      <p className="font-bold text-[#191A23]">{card.userId?.name || "Unknown"}</p>
                      <p className="text-neutral-400">{card.userId?.email || ""}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded-sm border border-[#191A23]/20 text-[10px] font-black uppercase text-neutral-600">
                        {card.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-[#191A23]">{card.downloadCount}</td>
                    <td className="px-5 py-4 text-xs text-neutral-400">
                      {new Date(card.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
