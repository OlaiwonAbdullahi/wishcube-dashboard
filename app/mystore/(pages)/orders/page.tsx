"use client";

import React, { useEffect, useState } from "react";
import { getVendorOrders, Order, updateOrderStatus } from "@/lib/orders";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBag01Icon,
  SearchIcon,
  FilterIcon,
  ViewIcon,
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  DeliveryTruck01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getVendorOrders();
      if (response.success && response.data) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Orders fetch error:", error);
      toast.error("An unexpected error occurred while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: Order["status"],
  ) => {
    setIsActionLoading(true);
    try {
      const response = await updateOrderStatus(orderId, newStatus);
      if (response.success) {
        toast.success(`Order marked as ${newStatus}`);
        await fetchOrders();
        setSelectedOrder(null);
      } else {
        toast.error(response.message || "Failed to update order status");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#191A23] uppercase tracking-tight">
            Order Management
          </h1>
          <p className="text-sm font-medium text-neutral-500 uppercase mt-1 tracking-wider">
            Track and manage your customer orders
          </p>
        </div>
      </div>

      <Card className="border-2 border-[#191A23] rounded-sm shadow-[6px_6px_0px_0px_rgba(25,26,35,1)]">
        <CardHeader className="border-b-2 border-[#191A23] bg-[#F3F3F3] space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <HugeiconsIcon
                icon={SearchIcon}
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <Input
                placeholder="Search orders or customers..."
                className="pl-10 h-10 border-2 border-[#191A23] rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="h-10 border-2 border-[#191A23] rounded-sm font-bold uppercase text-xs gap-2 w-full sm:w-auto"
            >
              <HugeiconsIcon icon={FilterIcon} size={16} />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-[#191A23] bg-neutral-50">
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-neutral-500">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-neutral-500">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-neutral-500">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-neutral-500">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-neutral-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-neutral-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y border-[#191A23]">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-8 text-center">
                        <div className="h-4 bg-neutral-100 rounded w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="group hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-black text-[#191A23]">
                          #{order._id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-neutral-600">
                          {order.createdAt}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#191A23]">
                            {order.customerName}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {order.customerEmail}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-black text-[#191A23]">
                          NGN {order.totalAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          className={cn(
                            "px-2 py-0.5 rounded-sm border-2 font-bold uppercase text-[10px] shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]",
                            getStatusColor(order.status),
                          )}
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-2 border-[#191A23] rounded-sm hover:bg-[#B4F8C8] transition-colors shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <HugeiconsIcon icon={ViewIcon} size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 bg-neutral-100 border-2 border-[#191A23] rounded-sm flex items-center justify-center opacity-50">
                          <HugeiconsIcon icon={ShoppingBag01Icon} size={24} />
                        </div>
                        <p className="text-sm font-bold uppercase text-neutral-400">
                          No orders found
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogContent className="max-w-2xl border-2 border-[#191A23] rounded-sm shadow-[8px_8px_0px_0px_rgba(25,26,35,1)]">
          <DialogHeader className="border-b-2 border-[#191A23] pb-4">
            <DialogTitle className="text-2xl font-black uppercase tracking-tight">
              Order Details #{selectedOrder?._id}
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-xs text-neutral-500">
              View and manage this order&apos;s fulfillment
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-black uppercase text-neutral-400 mb-1">
                      Customer Info
                    </h4>
                    <p className="font-bold text-[#191A23]">
                      {selectedOrder.customerName}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {selectedOrder.customerEmail}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-neutral-400 mb-1">
                      Shipping Address
                    </h4>
                    <p className="text-sm font-medium text-neutral-700">
                      {selectedOrder.shippingAddress.street},<br />
                      {selectedOrder.shippingAddress.city},{" "}
                      {selectedOrder.shippingAddress.state},<br />
                      {selectedOrder.shippingAddress.zipCode}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-black uppercase text-neutral-400 mb-1">
                      Order Status
                    </h4>
                    <Badge
                      className={cn(
                        "px-2 py-1 rounded-sm border-2 font-bold uppercase text-xs shadow-[3px_3px_0px_0px_rgba(25,26,35,1)]",
                        getStatusColor(selectedOrder.status),
                      )}
                    >
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-neutral-400 mb-1">
                      Payment Status
                    </h4>
                    <Badge
                      className={cn(
                        "px-2 py-1 rounded-sm border-2 font-bold uppercase text-xs shadow-[3px_3px_0px_0px_rgba(25,26,35,1)]",
                        selectedOrder.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-amber-100 text-amber-700 border-amber-200",
                      )}
                    >
                      {selectedOrder.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="border-2 border-[#191A23] rounded-sm overflow-hidden">
                <div className="bg-[#F3F3F3] px-4 py-2 border-b-2 border-[#191A23]">
                  <h4 className="text-xs font-black uppercase tracking-wider">
                    Order Items
                  </h4>
                </div>
                <div className="divide-y border-[#191A23]">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item._id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-100 border-2 border-[#191A23] rounded-sm flex items-center justify-center">
                          <HugeiconsIcon icon={ShoppingBag01Icon} size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#191A23]">
                            {item.productName}
                          </p>
                          <p className="text-xs text-neutral-500">
                            QTY: {item.quantity} x NGN{" "}
                            {item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-[#191A23]">
                        NGN {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="p-4 bg-neutral-50 flex items-center justify-between">
                    <span className="text-xs font-black uppercase">Total</span>
                    <span className="text-lg font-black text-[#191A23]">
                      NGN {selectedOrder.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t-2 border-[#191A23] pt-6 flex-row gap-3">
            {selectedOrder?.status === "pending" && (
              <Button
                className="flex-1 h-11 border-2 border-[#191A23] rounded-sm bg-[#B4F8C8] text-[#191A23] font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] transition-all gap-2"
                onClick={() =>
                  handleStatusUpdate(selectedOrder._id, "processing")
                }
                disabled={isActionLoading}
              >
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} />
                Process Order
              </Button>
            )}
            {selectedOrder?.status === "processing" && (
              <Button
                className="flex-1 h-11 border-2 border-[#191A23] rounded-sm bg-[#A0E7E5] text-[#191A23] font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] transition-all gap-2"
                onClick={() => handleStatusUpdate(selectedOrder._id, "shipped")}
                disabled={isActionLoading}
              >
                <HugeiconsIcon icon={DeliveryTruck01Icon} size={18} />
                Mark as Shipped
              </Button>
            )}
            {selectedOrder?.status === "shipped" && (
              <Button
                className="flex-1 h-11 border-2 border-[#191A23] rounded-sm bg-[#B4F8C8] text-[#191A23] font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] transition-all gap-2"
                onClick={() =>
                  handleStatusUpdate(selectedOrder._id, "delivered")
                }
                disabled={isActionLoading}
              >
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} />
                Mark as Delivered
              </Button>
            )}
            {selectedOrder?.status !== "delivered" &&
              selectedOrder?.status !== "cancelled" && (
                <Button
                  variant="destructive"
                  className="h-11 border-2 border-[#191A23] rounded-sm font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] transition-all gap-2"
                  onClick={() =>
                    selectedOrder &&
                    handleStatusUpdate(selectedOrder._id, "cancelled")
                  }
                  disabled={isActionLoading}
                >
                  <HugeiconsIcon icon={CancelCircleIcon} size={18} />
                  Cancel
                </Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
