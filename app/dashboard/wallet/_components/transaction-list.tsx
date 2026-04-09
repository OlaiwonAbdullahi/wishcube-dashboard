"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDownLeft01Icon,
  ArrowUpRight01Icon,
  Loading03Icon,
  TransactionIcon,
} from "@hugeicons/core-free-icons";
import { getWalletTransactions, type Transaction } from "@/lib/wallet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await getWalletTransactions(page);
        if (alive) {
          if (res.success && res.data) {
            setTransactions(res.data.transactions);
            setTotalPages(res.data.pagination.pages);
          } else {
            toast.error(res.message || "Failed to fetch transactions");
          }
        }
      } catch (err) {
        if (alive) toast.error("An error occurred while fetching transactions");
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, [page]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, "0")}, ${date.getFullYear()} • ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-black text-[#191A23]">
          Recent Transactions
        </h3>
        <div className="rounded-sm border-2 border-[#191A23] bg-white p-8 flex flex-col items-center justify-center space-y-4">
          <HugeiconsIcon
            icon={Loading03Icon}
            size={32}
            className="animate-spin text-[#191A23]"
          />
          <p className="text-sm font-bold text-neutral-500">
            Loading your transactions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-[#191A23]">
          Recent Transactions
        </h3>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-sm border border-[#191A23]/20 disabled:opacity-30 hover:bg-[#191A23]/5 transition-colors"
            >
              <HugeiconsIcon
                icon={ArrowDownLeft01Icon}
                size={16}
                className="rotate-45"
              />
            </button>
            <span className="text-xs font-bold">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-sm border border-[#191A23]/20 disabled:opacity-30 hover:bg-[#191A23]/5 transition-colors"
            >
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={16}
                className="rotate-45"
              />
            </button>
          </div>
        )}
      </div>

      <div className="rounded-sm border-2 border-[#191A23] bg-white divide-y-2 divide-[#191A23]/10 overflow-hidden shadow-[4px_4px_0px_0px_rgba(25,26,35,0.05)]">
        {transactions.length === 0 ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#F3F3F3] flex items-center justify-center border-2 border-[#191A23]/10">
              <HugeiconsIcon
                icon={TransactionIcon}
                size={32}
                className="text-neutral-400"
              />
            </div>
            <div>
              <p className="font-black text-[#191A23]">No transactions yet</p>
              <p className="text-xs text-neutral-500">
                Your wallet activity will appear here
              </p>
            </div>
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx._id}
              className="p-4 flex items-center justify-between hover:bg-[#F3F3F3]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-sm border-2 border-[#191A23] flex items-center justify-center shadow-[2px_2px_0px_0px_#191A23]",
                    tx.type === "credit" ? "bg-[#B4F481]" : "bg-[#FFB1B1]",
                  )}
                >
                  <HugeiconsIcon
                    icon={
                      tx.type === "credit"
                        ? ArrowDownLeft01Icon
                        : ArrowUpRight01Icon
                    }
                    size={20}
                    color="#191A23"
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <p className="text-sm font-black text-[#191A23] line-clamp-1">
                    {tx.description}
                  </p>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    {formatDate(tx.createdAt)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "text-sm font-black",
                    tx.type === "credit" ? "text-green-600" : "text-red-500",
                  )}
                >
                  {tx.type === "credit" ? "+" : "-"}₦
                  {tx.amount.toLocaleString()}
                </p>
                <p className="text-[10px] font-medium text-neutral-400">
                  Ref: {tx.reference.slice(0, 10)}...
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
