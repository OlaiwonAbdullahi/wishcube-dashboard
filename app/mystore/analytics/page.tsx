"use client";

import { useEffect, useState } from "react";
import { getVendorAnalytics, AnalyticsData } from "@/lib/orders";
import { RevenueChart } from "../_components/RevenueChart";
import { OrdersStatusPie } from "../_components/OrdersStatusPie";
import { TopProducts } from "../_components/TopProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChartBarLineIcon,
  PackageIcon,
  ShoppingBag01Icon,
} from "@hugeicons/core-free-icons";

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await getVendorAnalytics();
      console.log(response);
      if (response.success && response.data) {
        setAnalyticsData(response.data);
      }
    } catch (error) {
      console.error("Analytics fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#191A23] uppercase tracking-tight">
            Store Analytics
          </h1>
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
            Deep dive into your store&apos;s performance metrics and customer
            trends.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-2 pt-0 border-[#191A23] rounded-none shadow-[6px_6px_0px_0px_rgba(25,26,35,1)]">
          <CardHeader className="border-b-2 border-[#191A23] bg-[#F3F3F3] p-4">
            <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <HugeiconsIcon icon={ChartBarLineIcon} size={18} />
              Revenue History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-[400px]">
            {loading ? (
              <div className="h-full flex items-center justify-center font-black uppercase text-xs">
                Loading analytics...
              </div>
            ) : (
              <RevenueChart data={analyticsData?.revenueHistory || []} />
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-[#191A23] rounded-none pt-0 shadow-[6px_6px_0px_0px_rgba(25,26,35,1)]">
          <CardHeader className="border-b-2 border-[#191A23] bg-[#F3F3F3] p-4">
            <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <HugeiconsIcon icon={ShoppingBag01Icon} size={18} />
              Orders by Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-[400px]">
            {loading ? (
              <div className="h-full flex items-center justify-center font-black uppercase text-xs">
                Loading stats...
              </div>
            ) : (
              <OrdersStatusPie data={analyticsData?.ordersByStatus || []} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TopProducts products={analyticsData?.topProducts || []} />

        <Card className="border-2 border-[#191A23] rounded-none pt-0 shadow-[6px_6px_0px_0px_rgba(25,26,35,1)]">
          <CardHeader className="border-b-2 border-[#191A23] bg-[#F3F3F3] p-4">
            <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <HugeiconsIcon icon={PackageIcon} size={18} />
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <SummaryItem
                label="Average Revenue Per Month"
                value={
                  `NGN ${(analyticsData?.revenueHistory.reduce((acc, curr) => acc + curr.revenue, 0) || 0) / (analyticsData?.revenueHistory.length || 1)}`.split(
                    ".",
                  )[0]
                }
              />
              <SummaryItem
                label="Total Orders Handled"
                value={
                  analyticsData?.ordersByStatus
                    .reduce((acc, curr) => acc + curr.count, 0)
                    .toString() || "0"
                }
              />
              <SummaryItem
                label="Best Performing Product"
                value={analyticsData?.topProducts[0]?.name || "N/A"}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center bg-neutral-50 border-2 border-[#191A23] p-4">
      <span className="text-[10px] font-black uppercase text-neutral-400">
        {label}
      </span>
      <span className="text-sm font-black text-[#191A23]">{value}</span>
    </div>
  );
}
