"use client";

import React, { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroupIcon,
  Cards02Icon,
  WebDesign02Icon,
  Store01Icon,
} from "@hugeicons/core-free-icons";
import { getAdminOverview, AdminOverview } from "@/lib/admin";
import { toast } from "sonner";

const AdminDashboard = () => {
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
          toast.error(res.message || "Failed to load overview");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: overview?.totals.totalUsers,
      icon: UserGroupIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Cards Created",
      value: overview?.totals.totalCards,
      icon: Cards02Icon,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      title: "Websites Generated",
      value: overview?.totals.totalWebsites,
      icon: WebDesign02Icon,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Vendors",
      value: overview?.totals.activeVendors,
      icon: Store01Icon,
      color: "text-cyan-500",
      bgColor: "bg-cyan-50",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#191A23] uppercase tracking-tight">
            Admin Overview
          </h1>
          <p className="text-sm font-medium text-neutral-500 uppercase mt-1 tracking-wider">
            Manage your platform&apos;s growth and users
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border-2 border-[#191A23] rounded-sm p-6 shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className={stat.color}>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-neutral-500 transition-colors">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-black mt-1 text-[#191A23]">
                  {loading ? "…" : (stat.value ?? 0).toLocaleString()}
                </h3>
              </div>
              <div
                className={`p-3 rounded-sm border-2 border-[#191A23] ${stat.bgColor}`}
              >
                <HugeiconsIcon
                  icon={stat.icon}
                  size={24}
                  className={stat.color}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border-2 border-[#191A23] rounded-sm p-6 shadow-[6px_6px_0px_0px_rgba(25,26,35,1)]">
          <h2 className="text-xl font-black text-[#191A23] uppercase tracking-tight mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm font-bold text-neutral-400 text-center py-6">
                Loading…
              </p>
            ) : overview?.recentActivity.length ? (
              overview.recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 border-2 border-neutral-100 rounded-sm hover:border-[#191A23]/20 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-[#191A23] shrink-0">
                    <HugeiconsIcon
                      icon={activity.type === "card" ? Cards02Icon : WebDesign02Icon}
                      size={16}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#191A23] truncate">
                      {activity.description}
                    </p>
                    <p className="text-[10px] font-medium text-neutral-400 uppercase">
                      {new Date(activity.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm font-bold text-neutral-400 text-center py-6">
                No activity yet
              </p>
            )}
          </div>
        </div>

        <div className="bg-white border-2 border-[#191A23] rounded-sm p-6 shadow-[6px_6px_0px_0px_rgba(25,26,35,1)]">
          <h2 className="text-xl font-black text-[#191A23] uppercase tracking-tight mb-6">
            This Week
          </h2>
          <div className="space-y-6">
            {[
              { label: "New Users", value: overview?.thisWeek.newUsersThisWeek },
              { label: "New Cards", value: overview?.thisWeek.newCardsThisWeek },
              { label: "New Websites", value: overview?.thisWeek.newWebsitesThisWeek },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center">
                <span className="text-xs font-black uppercase text-[#191A23] tracking-wider">
                  {row.label}
                </span>
                <span className="text-lg font-black text-[#191A23]">
                  {loading ? "…" : `+${row.value ?? 0}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
