import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBag01Icon } from "@hugeicons/core-free-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { Order } from "@/lib/orders";

interface RecentOrdersProps {
  orders: Order[];
  loading: boolean;
}

export function RecentOrders({ orders, loading }: RecentOrdersProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
    <Card className="border-2 border-[#191A23] rounded-none shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] pt-0 ">
      <CardHeader className="border-b-2 border-[#191A23] bg-[#F3F3F3] p-3">
        <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
          <HugeiconsIcon icon={ShoppingBag01Icon} size={18} />
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-6 text-center animate-pulse font-black uppercase text-xs">
            Loading...
          </div>
        ) : orders.length > 0 ? (
          <div className="divide-y-2 border-[#191A23]">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-4 flex items-center justify-between group hover:bg-neutral-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neutral-100 border-2 border-[#191A23] rounded-none flex items-center justify-center overflow-hidden">
                    {order.productSnapshot?.imageUrl ? (
                      <img
                        src={order.productSnapshot.imageUrl}
                        alt={order.productSnapshot.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-black">
                        #{order._id.slice(-3)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#191A23]">
                      {order.deliveryAddress?.fullName || "Guest Customer"}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-black text-[#191A23]">
                    NGN {order.totalAmount.toLocaleString()}
                  </span>
                  <Badge
                    className={cn(
                      "px-2 py-0 rounded-none border-2 font-bold uppercase text-[8px] shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]",
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
            <div className="w-12 h-12 bg-neutral-100 border-2 border-[#191A23] rounded-none flex items-center justify-center opacity-50">
              <HugeiconsIcon icon={ShoppingBag01Icon} size={24} />
            </div>
            <p className="text-xs font-bold uppercase text-neutral-400">
              No orders yet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
