"use client";

import {
  PackageIcon,
  ShoppingBag01Icon,
  Wallet01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import { getAuth } from "@/lib/auth";
import { getVendorDashboardOverview, DashboardOverviewData } from "@/lib/orders";
import { StatCard } from "./_components/StatCard";
import { RecentOrders } from "./_components/RecentOrders";
import { DashboardHeader } from "./_components/DashboardHeader";

export default function MyStorePage() {
  const [userName, setUserName] = useState("");
  const [dashboardData, setDashboardData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      setUserName(auth.user.name);
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await getVendorDashboardOverview();
      if (response.success && response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = dashboardData?.stats || {
    totalSales: 0,
    totalOrders: 0,
    activeOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalEarnings: 0,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader userName={userName} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`NGN ${stats.totalRevenue.toLocaleString()}`}
          icon={Wallet01Icon}
          color="bg-[#B4F8C8]/30 text-[#00A86B]"
        />
        <StatCard
          title="Total Earnings"
          value={`NGN ${stats.totalEarnings.toLocaleString()}`}
          icon={UserGroupIcon}
          color="bg-[#FBE7C6]/30 text-[#CC8E35]"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          icon={ShoppingBag01Icon}
          color="bg-[#FFAEBC]/30 text-[#FF6B6B]"
        />
        <StatCard
          title="Active Orders"
          value={stats.activeOrders.toString()}
          icon={PackageIcon}
          color="bg-[#A0E7E5]/30 text-[#008080]"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentOrders 
          orders={dashboardData?.recentOrders || []} 
          loading={loading} 
        />
      </div>
    </div>
  );
}
