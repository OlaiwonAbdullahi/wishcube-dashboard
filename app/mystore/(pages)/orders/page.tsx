/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  getVendorOrders,
  Order,
  OrderStatus,
  UpdateOrderPayload,
  updateOrderStatus,
  confirmDeliveryVendor,
} from "@/lib/orders";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBag01Icon,
  SearchIcon,
  DeliveryTruck01Icon,
  CheckmarkCircle01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  Time01Icon,
  PackageIcon,
  Loading03Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUS_TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Processing", value: "processing" },
  { label: "Out for Delivery", value: "out_for_delivery" },
  { label: "In Transit", value: "in_transit" },
  { label: "Awaiting Conf.", value: "awaiting_confirmation" },
  { label: "Delivered", value: "delivered" },
  { label: "Disputed", value: "disputed" },
  { label: "Cancelled", value: "cancelled" },
];

const STATUS_STYLE: Record<string, string> = {
  processing: "bg-blue-100 text-blue-700 border-blue-200",
  out_for_delivery: "bg-amber-100 text-amber-700 border-amber-200",
  in_transit: "bg-indigo-100 text-indigo-700 border-indigo-200",
  awaiting_confirmation: "bg-orange-100 text-orange-700 border-orange-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  disputed: "bg-red-100 text-red-700 border-red-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const STATUS_ICON: Record<string, any> = {
  processing: Time01Icon,
  out_for_delivery: DeliveryTruck01Icon,
  in_transit: DeliveryTruck01Icon,
  awaiting_confirmation: PackageIcon,
  delivered: Tick01Icon,
  disputed: Cancel01Icon,
  cancelled: Cancel01Icon,
};

function StatusBadge({ status }: { status: string }) {
  const Icon = STATUS_ICON[status] ?? PackageIcon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border-2 text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]",
        STATUS_STYLE[status] ??
          "bg-neutral-100 text-neutral-700 border-neutral-200",
      )}
    >
      <HugeiconsIcon icon={Icon} size={10} />
      {status}
    </span>
  );
}

function UpdateModal({
  order,
  onClose,
  onUpdated,
}: {
  order: Order;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber ?? "",
  );
  const [status, setStatus] = useState<OrderStatus>(
    order.status === "processing" ? "out_for_delivery" : order.status,
  );
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const canUpdate =
    order.status !== "delivered" && order.status !== "cancelled";
  const showDeliveryCode = !!(order as any).deliveryCode;

  const handleUpdate = async () => {
    setLoading(true);

    if (status === "delivered") {
      const res = await confirmDeliveryVendor(order._id, otpCode);
      setLoading(false);
      if (res.success) {
        toast.success(`Delivery confirmed successfully!`);
        onUpdated();
        onClose();
      } else {
        toast.error(res.message || "Invalid OTP code");
      }
      return;
    }

    const payload: UpdateOrderPayload = {
      status: status as any,
      ...(trackingNumber.trim() && { trackingNumber: trackingNumber.trim() }),
      ...(note.trim() && { note: note.trim() }),
    };
    const res = await updateOrderStatus(order._id, payload);
    setLoading(false);
    if (res.success) {
      toast.success(`Order status updated`);
      onUpdated();
      onClose();
    } else {
      toast.error(res.message || "Failed to update order");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-lg bg-white border-2 border-[#191A23] shadow-[8px_8px_0px_0px_rgba(25,26,35,1)] rounded-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#191A23] bg-[#F3F3F3]">
          <div>
            <h2 className="text-base font-black uppercase tracking-tight text-[#191A23]">
              Order Details
            </h2>
            <p className="text-[10px] font-bold uppercase text-neutral-400 mt-0.5">
              #{order._id.slice(-8).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center border-2 border-[#191A23] rounded-sm hover:bg-red-50 transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Product info */}
          <div className="flex items-center gap-3 p-3 border-2 border-[#191A23] rounded-sm bg-neutral-50 shadow-[3px_3px_0px_0px_rgba(25,26,35,1)]">
            {order.productSnapshot.imageUrl ? (
              <img
                src={order.productSnapshot.imageUrl}
                alt={order.productSnapshot.name}
                className="size-14 object-cover border-2 border-[#191A23] rounded-sm"
              />
            ) : (
              <div className="size-14 bg-[#B4F8C8] border-2 border-[#191A23] rounded-sm flex items-center justify-center">
                <HugeiconsIcon icon={ShoppingBag01Icon} size={24} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-black text-[#191A23] text-sm truncate">
                {order.productSnapshot.name}
              </p>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">
                ₦{order.productSnapshot.price.toLocaleString()}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-[#191A23] rounded-sm p-3 space-y-1 shadow-[3px_3px_0px_0px_rgba(25,26,35,1)]">
              <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                Deliver To
              </p>
              <p className="font-bold text-[#191A23] text-sm">
                {order.deliveryAddress.fullName}
              </p>
              <p className="text-xs text-neutral-500">
                {order.deliveryAddress.phone}
              </p>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {order.deliveryAddress.address}, {order.deliveryAddress.city},{" "}
                {order.deliveryAddress.state}
              </p>
            </div>

            <div className="border-2 border-[#191A23] rounded-sm p-3 space-y-1 shadow-[3px_3px_0px_0px_rgba(25,26,35,1)]">
              <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                Your Earnings
              </p>
              <p className="text-2xl font-black text-[#191A23]">
                ₦{order.vendorEarnings.toLocaleString()}
              </p>
              <p className="text-[10px] text-neutral-400">
                Commission: ₦{order.commissionAmount.toLocaleString()}
              </p>
              <p
                className={cn(
                  "text-[10px] font-bold uppercase",
                  order.vendorPaidOut ? "text-green-600" : "text-amber-600",
                )}
              >
                {order.vendorPaidOut ? "✓ Paid out" : "Pending payout"}
              </p>
            </div>
          </div>

          {order.statusHistory.length > 0 && (
            <div className="border-2 border-[#191A23] rounded-sm overflow-hidden shadow-[3px_3px_0px_0px_rgba(25,26,35,1)]">
              <div className="bg-[#F3F3F3] px-4 py-2 border-b-2 border-[#191A23]">
                <p className="text-[10px] font-black uppercase tracking-wider">
                  Status History
                </p>
              </div>
              <div className="divide-y divide-[#191A23]/10 max-h-36 overflow-y-auto">
                {[...order.statusHistory].reverse().map((h, i) => (
                  <div key={i} className="px-4 py-2.5 flex items-start gap-3">
                    <StatusBadge status={h.status} />
                    <div className="flex-1 min-w-0">
                      {h.note && (
                        <p className="text-xs text-neutral-600">{h.note}</p>
                      )}
                      <p className="text-[10px] text-neutral-400 mt-0.5">
                        {new Date(h.updatedAt).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {canUpdate && (
            <div className="space-y-3 pt-2 border-t-2 border-[#191A23]">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-2">
                  Update Status To
                </p>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      "out_for_delivery",
                      "in_transit",
                      "awaiting_confirmation",
                      "delivered"
                    ] as OrderStatus[]
                  ).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={cn(
                        "px-3 py-1.5 text-[10px] font-black uppercase border-2 border-[#191A23] rounded-sm transition-all",
                        status === s
                          ? "bg-[#191A23] text-white"
                          : "bg-white hover:bg-neutral-50",
                      )}
                    >
                      {s.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>

              {status === "delivered" ? (
                <div className="space-y-3">
                  <input
                     type="text"
                     placeholder="6-Digit OTP Code from Recipient"
                     value={otpCode}
                     onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                     maxLength={6}
                     className="w-full px-4 py-2.5 border-2 border-[#191A23] rounded-sm text-sm font-medium focus:outline-none focus:bg-[#F3F3F3] transition-all tracking-[0.2em] text-center placeholder:tracking-normal"
                   />
                </div>
              ) : (
                <>
                  {(status === "out_for_delivery" || status === "in_transit") && (
                    <input
                      type="text"
                      placeholder="Tracking Number (e.g. DHL-123)"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-[#191A23] rounded-sm text-sm font-medium focus:outline-none focus:bg-[#F3F3F3] transition-all"
                    />
                  )}
                  <input
                    type="text"
                    placeholder="Updates note (optional)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-[#191A23] rounded-sm text-sm font-medium focus:outline-none focus:bg-[#F3F3F3] transition-all"
                  />
                </>
              )}

              <button
                onClick={handleUpdate}
                disabled={loading}
                className={cn(
                  "w-full h-11 border-2 border-[#191A23] rounded-sm font-black uppercase text-xs flex items-center justify-center gap-2 bg-[#A0E7E5] shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] transition-all",
                  loading && "opacity-60 cursor-not-allowed",
                )}
              >
                {loading ? (
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} />
                )}
                {loading ? "Updating…" : status === "delivered" ? "Confirm Delivery" : `Set as ${status.replace(/_/g, " ")}`}
              </button>
              {status !== "delivered" && (
                 <p className="text-[10px] text-center text-neutral-400 font-bold uppercase italic">
                   Note: &quot;Delivered&quot; state is strictly confirmed by OTP.
                 </p>
              )}
            </div>
          )}

          {showDeliveryCode && (
            <div className="p-4 border-2 border-[#191A23] bg-[#B4F8C8] rounded-sm space-y-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#191A23]/60">
                Delivery Confirmation Code
              </p>
              <p className="text-2xl font-black text-[#191A23] tracking-widest">
                {(order as any).deliveryCode}
              </p>
              <p className="text-[9px] font-bold text-[#191A23]/50">
                Share this code with the recipient if they haven&apos;t received
                the automated email.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getVendorOrders();
      if (res.success && res.data) {
        setOrders(res.data.orders);
      } else {
        toast.error(res.message || "Failed to fetch orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter((o) => {
    const matchStatus = statusTab === "all" || o.status === statusTab;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      o._id.toLowerCase().includes(q) ||
      o.productSnapshot.name.toLowerCase().includes(q) ||
      o.deliveryAddress.fullName.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });
  const counts = orders.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-[#191A23] uppercase tracking-tight">
          Orders
        </h1>
        <p className="text-sm font-medium text-neutral-500 uppercase mt-1 tracking-wider">
          Fulfil and track your customer deliveries
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {(
          [
            "processing",
            "out_for_delivery",
            "in_transit",
            "awaiting_confirmation",
            "delivered",
            "disputed",
            "cancelled",
          ] as OrderStatus[]
        ).map((s) => (
          <div
            key={s}
            className={cn(
              "flex items-center gap-2 px-4 py-2 border-2 border-[#191A23] rounded-sm bg-white shadow-[3px_3px_0px_0px_rgba(25,26,35,1)]",
            )}
          >
            <HugeiconsIcon
              icon={STATUS_ICON[s] ?? PackageIcon}
              size={14}
              className="text-[#191A23]"
            />
            <span className="text-xs font-black uppercase">{s}</span>
            <span className="text-xs font-black text-[#191A23] bg-[#B4F8C8] px-1.5 py-0.5 border border-[#191A23] rounded-sm">
              {counts[s] ?? 0}
            </span>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="border-2 border-[#191A23] rounded-sm shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] overflow-hidden">
        {/* Toolbar */}
        <div className="border-b-2 border-[#191A23] bg-[#F3F3F3] p-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <HugeiconsIcon
              icon={SearchIcon}
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder="Search by order ID, product or customer…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 h-10 border-2 border-[#191A23] rounded-sm text-sm font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all bg-white"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusTab(tab.value)}
                className={cn(
                  "px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border-2 border-[#191A23] rounded-sm whitespace-nowrap transition-all",
                  statusTab === tab.value
                    ? "bg-[#191A23] text-white shadow-none"
                    : "bg-white shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
                )}
              >
                {tab.label}
                {tab.value !== "all" && counts[tab.value] != null && (
                  <span className="ml-1.5 opacity-70">
                    ({counts[tab.value]})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-[#191A23] bg-neutral-50">
                {["Order", "Product", "Customer", "Earnings", "Status", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-neutral-500"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#191A23]/10">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-3 bg-neutral-100 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-[#F3F3F3] transition-colors group"
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-xs font-black text-[#191A23]">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {order.productSnapshot.imageUrl ? (
                          <img
                            src={order.productSnapshot.imageUrl}
                            alt={order.productSnapshot.name}
                            className="size-8 object-cover border-2 border-[#191A23] rounded-sm"
                          />
                        ) : (
                          <div className="size-8 bg-[#B4F8C8] border-2 border-[#191A23] rounded-sm flex items-center justify-center">
                            <HugeiconsIcon icon={ShoppingBag01Icon} size={14} />
                          </div>
                        )}
                        <span className="text-sm font-bold text-[#191A23] max-w-[140px] truncate">
                          {order.productSnapshot.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm font-bold text-[#191A23]">
                        {order.deliveryAddress.fullName}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {order.deliveryAddress.city},{" "}
                        {order.deliveryAddress.state}
                      </p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm font-black text-[#191A23]">
                        ₦{order.vendorEarnings.toLocaleString()}
                      </p>
                      <p
                        className={cn(
                          "text-[10px] font-bold mt-0.5",
                          order.vendorPaidOut
                            ? "text-green-600"
                            : "text-amber-600",
                        )}
                      >
                        {order.vendorPaidOut ? "Paid out" : "Pending"}
                      </p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1.5 ml-auto text-[10px] font-black uppercase border-2 border-[#191A23] px-3 py-1.5 rounded-sm bg-white shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                      >
                        View
                        <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="size-14 border-2 border-[#191A23] rounded-sm bg-neutral-50 flex items-center justify-center opacity-40">
                        <HugeiconsIcon icon={ShoppingBag01Icon} size={28} />
                      </div>
                      <p className="text-sm font-bold uppercase text-neutral-400">
                        No orders
                        {statusTab !== "all"
                          ? ` with status "${statusTab}"`
                          : ""}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selectedOrder && (
        <UpdateModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdated={fetchOrders}
        />
      )}
    </div>
  );
}
