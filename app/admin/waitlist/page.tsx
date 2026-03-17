"use client";

import React, { useEffect, useState } from "react";
import { getWaitlist } from "@/lib/admin";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail02Icon, Copy01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";

export default function WaitlistPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    setLoading(true);
    try {
      const response = await getWaitlist();
      if (response.success) {
        const list =
          response.data?.waitlist || (response as any).waitlist || [];
        const waitlistTotal =
          response.data?.total || (response as any).total || 0;

        setWaitlist(Array.isArray(list) ? list : []);
        setTotal(waitlistTotal);
      } else {
        toast.error(response.message || "Failed to fetch waitlist");
        setWaitlist([]);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      setWaitlist([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyEmails = () => {
    const emails = waitlist.map((entry) => entry.email).join(", ");
    navigator.clipboard.writeText(emails);
    toast.success("All emails copied to clipboard!");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#191A23] uppercase tracking-tight">
            Waitlist Management
          </h1>
          <p className="text-sm font-medium text-neutral-500 uppercase mt-1 tracking-wider">
            Total subscribers: {total}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleCopyEmails}
            disabled={waitlist.length === 0}
            className="flex items-center gap-2 px-4 py-3 bg-[#B4F8C8] border-2 border-[#191A23] rounded-sm font-black uppercase text-xs text-[#191A23] hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all disabled:opacity-50"
          >
            <HugeiconsIcon icon={Copy01Icon} size={16} />
            Copy All Emails
          </button>
          <div className="p-3 rounded-sm border-2 border-[#191A23] bg-indigo-50">
            <HugeiconsIcon
              icon={Mail02Icon}
              size={24}
              className="text-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-[#191A23] rounded-sm shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F3F3F3] border-b-2 border-[#191A23]">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">
                  Name
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">
                  Signup Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-[#191A23] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs font-bold uppercase text-neutral-400">
                        Loading waitlist...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (waitlist || []).length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-sm font-bold text-neutral-400 uppercase"
                  >
                    No subscribers found
                  </td>
                </tr>
              ) : (
                (waitlist || []).map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-[#191A23] flex items-center justify-center text-[10px] font-black uppercase text-indigo-700">
                          {entry.name.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-[#191A23]">
                          {entry.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-neutral-500 underline-offset-4 hover:underline cursor-pointer decoration-[#191A23]/20">
                      {entry.email}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase">
                      {new Date(entry.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
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
