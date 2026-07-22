"use client";

import React, { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Analytics01Icon } from "@hugeicons/core-free-icons";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { getAdminOverview, AdminOverview } from "@/lib/admin";
import { toast } from "sonner";

export default function AdminAnalyticsPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      try {
        const res = await getAdminOverview();
        if (res.success && res.data) {
          setOverview(res.data);
        } else {
          toast.error(res.message || "Failed to load analytics");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const chartData =
    overview?.dailySeries.map((d) => ({
      ...d,
      label: new Date(d.date).toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
      }),
    })) ?? [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#191A23] uppercase tracking-tight">
            Platform Analytics
          </h1>
          <p className="text-sm font-medium text-neutral-500 uppercase mt-1 tracking-wider">
            Growth over the last 7 days
          </p>
        </div>
        <div className="p-3 rounded-sm border-2 border-[#191A23] bg-cyan-50">
          <HugeiconsIcon icon={Analytics01Icon} size={24} className="text-cyan-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "New Users", value: overview?.thisWeek.newUsersThisWeek, color: "#3b82f6" },
          { label: "New Cards", value: overview?.thisWeek.newCardsThisWeek, color: "#f59e0b" },
          { label: "New Websites", value: overview?.thisWeek.newWebsitesThisWeek, color: "#22c55e" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border-2 border-[#191A23] rounded-sm p-5 shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              {stat.label} (7d)
            </p>
            <h3 className="text-2xl font-black mt-1" style={{ color: stat.color }}>
              {loading ? "…" : `+${stat.value ?? 0}`}
            </h3>
          </div>
        ))}
      </div>

      <div className="bg-white border-2 border-[#191A23] rounded-sm p-6 shadow-[6px_6px_0px_0px_rgba(25,26,35,1)]">
        <h2 className="text-lg font-black text-[#191A23] uppercase tracking-tight mb-6">
          Daily Growth
        </h2>
        {loading ? (
          <div className="h-72 flex items-center justify-center text-sm font-bold text-neutral-400">
            Loading chart…
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#19192310" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" name="Users" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="cards" name="Cards" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="websites" name="Websites" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
