"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  PackageIcon,
  ShoppingBag01Icon,
  PlusSignIcon,
  Wallet01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuth } from "@/lib/auth";
import { getVendorOrders, Order } from "@/lib/orders";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function MyStorePage() {
  const [userName, setUserName] = useState("");
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    activeProducts: 0,
    customers: 0,
  });

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      queueMicrotask(() => setUserName(auth.user.name));
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await getVendorOrders();
      if (response.success && response.data) {
        const orders = response.data.orders;
        setRecentOrders(orders.slice(0, 5));

        const totalSales = orders
          .filter((o) => o.status !== "cancelled")
          .reduce((acc, o) => acc + o.totalAmount, 0);

        const uniqueCustomers = new Set(orders.map((o) => o.customerId)).size;

        setStats({
          totalOrders: orders.length,
          totalSales,
          activeProducts: 0, // This would ideally come from a products API
          customers: uniqueCustomers,
        });
      }
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#191A23] uppercase tracking-tight">
            Store Overview
          </h1>
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
            Welcome back,{" "}
            <span className="text-[#191A23] font-black">{userName}</span>.
            Here&apos;s what&apos;s happening with your store.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            asChild
            className="h-12 border-2 border-[#191A23] rounded-sm bg-[#B4F8C8] text-[#191A23] font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] transition-all"
          >
            <Link
              href="/mystore/products/new"
              className="gap-2 flex items-center"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={18} />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sales"
          value={`NGN ${stats.totalSales.toLocaleString()}`}
          icon={Wallet01Icon}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          icon={ShoppingBag01Icon}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Active Products"
          value={stats.activeProducts.toString()}
          icon={PackageIcon}
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Customers"
          value={stats.customers.toString()}
          icon={UserGroupIcon}
          color="bg-pink-50 text-pink-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2 border-[#191A23] rounded-sm shadow-[6px_6px_0px_0px_rgba(25,26,35,1)]">
          <CardHeader className="border-b-2 border-[#191A23] bg-[#F3F3F3]">
            <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <HugeiconsIcon icon={ShoppingBag01Icon} size={18} />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 text-center animate-pulse">Loading...</div>
            ) : recentOrders.length > 0 ? (
              <div className="divide-y-2 border-[#191A23]">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="p-4 flex items-center justify-between group hover:bg-neutral-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-100 border-2 border-[#191A23] rounded-sm flex items-center justify-center">
                        <span className="text-[10px] font-black">
                          #{order._id.slice(-3)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#191A23]">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {format(new Date(order.createdAt), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-black text-[#191A23]">
                        NGN {order.totalAmount.toLocaleString()}
                      </span>
                      <Badge
                        className={cn(
                          "px-2 py-0 rounded-sm border-2 font-bold uppercase text-[8px] shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]",
                          getStatusColor(order.status),
                        )}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <div className="p-4 bg-neutral-50 text-center border-t-2 border-[#191A23]">
                  <Link
                    href="/mystore/orders"
                    className="text-xs font-black uppercase hover:underline"
                  >
                    View All Orders
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                <div className="w-12 h-12 bg-neutral-100 border-2 border-[#191A23] rounded-sm flex items-center justify-center opacity-50">
                  <HugeiconsIcon icon={ShoppingBag01Icon} size={24} />
                </div>
                <p className="text-xs font-bold uppercase text-neutral-400">
                  No orders yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-[#191A23] rounded-sm shadow-[6px_6px_0px_0px_rgba(25,26,35,1)]">
          <CardHeader className="border-b-2 border-[#191A23] bg-[#F3F3F3]">
            <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <HugeiconsIcon icon={PackageIcon} size={18} />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="w-12 h-12 bg-neutral-100 border-2 border-[#191A23] rounded-sm flex items-center justify-center opacity-50">
                <HugeiconsIcon icon={PackageIcon} size={24} />
              </div>
              <p className="text-xs font-bold uppercase text-neutral-400">
                No products listed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  color: string;
}) {
  return (
    <Card className="border-2 border-[#191A23] rounded-sm shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div
            className={cn("p-3 border-2 border-[#191A23] rounded-sm", color)}
          >
            <HugeiconsIcon icon={Icon} size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider leading-none mb-1">
              {title}
            </p>
            <p className="text-xl font-black text-[#191A23] tracking-tight leading-none">
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
