"use client";

import React, { useEffect, useState } from "react";
import { getAllVendors, approveVendor, rejectVendor } from "@/lib/admin";
import { HugeiconsIcon } from "@hugeicons/react";
import { Store01Icon, Tick01Icon, Cancel01Icon, Alert01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingVendor, setRejectingVendor] = useState<any>(null);

  useEffect(() => {
    fetchVendors();
  }, [activeTab]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await getAllVendors(activeTab);
      if (response.success && response.data) {
        setVendors(response.data.vendors);
        setTotal(response.data.total);
      } else {
        toast.error(response.message || "Failed to fetch vendors");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve this vendor application?")) return;
    try {
      const response = await approveVendor(id);
      if (response.success) {
        toast.success("Vendor approved successfully!");
        fetchVendors();
      } else {
        toast.error(response.message || "Approval failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during approval");
    }
  };

  const handleReject = async () => {
    if (!rejectingVendor || !rejectReason.trim()) return;
    try {
      const response = await rejectVendor(rejectingVendor.id, rejectReason);
      if (response.success) {
        toast.success("Vendor application rejected.");
        setRejectingVendor(null);
        setRejectReason("");
        fetchVendors();
      } else {
        toast.error(response.message || "Rejection failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during rejection");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#191A23] uppercase tracking-tight">
            Vendor Management
          </h1>
          <p className="text-sm font-medium text-neutral-500 uppercase mt-1 tracking-wider">
            Total vendor applications: {total}
          </p>
        </div>
        <div className="p-3 rounded-sm border-2 border-[#191A23] bg-pink-50">
          <HugeiconsIcon icon={Store01Icon} size={24} className="text-pink-500" />
        </div>
      </div>

      <div className="flex gap-4 border-b-2 border-[#191A23]/10 pb-4">
        {["pending", "approved", "rejected", "suspended"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-black uppercase transition-all border-2 border-[#191A23] rounded-sm ${
              activeTab === tab
                ? "bg-[#191A23] text-white shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] -translate-x-0.5 -translate-y-0.5"
                : "bg-white text-[#191A23] hover:bg-neutral-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white border-2 border-[#191A23] rounded-sm shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F3F3F3] border-b-2 border-[#191A23]">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">Store Name</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">Category</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">Earnings</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">Rating</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-[#191A23] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs font-bold uppercase text-neutral-400">Loading vendors...</p>
                    </div>
                  </td>
                </tr>
              ) : vendors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm font-bold text-neutral-400 uppercase">
                    No vendors found
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-sm bg-neutral-100 border-2 border-[#191A23] overflow-hidden flex items-center justify-center">
                          {vendor.logo ? (
                            <img src={vendor.logo} alt={vendor.storeName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-black uppercase">{vendor.storeName.charAt(0)}</span>
                          )}
                        </div>
                        <span className="text-sm font-bold text-[#191A23]">{vendor.storeName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-sm text-[10px] font-black uppercase border-2 border-[#191A23] bg-pink-100 text-pink-700">
                        {vendor.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-[#191A23]">NGN {vendor.totalEarnings.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-amber-500 font-black">
                        <span className="text-sm">{vendor.rating}</span>
                        <div className="w-3 h-3 bg-amber-500 rounded-full border border-[#191A23]"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {activeTab === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(vendor.id)}
                            className="p-1.5 rounded-sm bg-green-100 border-2 border-[#191A23] text-green-600 hover:bg-green-200 transition-colors"
                            title="Approve Application"
                          >
                            <HugeiconsIcon icon={Tick01Icon} size={16} />
                          </button>
                          <button
                            onClick={() => setRejectingVendor(vendor)}
                            className="p-1.5 rounded-sm bg-red-100 border-2 border-[#191A23] text-red-600 hover:bg-red-200 transition-colors"
                            title="Reject Application"
                          >
                            <HugeiconsIcon icon={Cancel01Icon} size={16} />
                          </button>
                        </div>
                      )}
                      {activeTab !== 'pending' && (
                        <span className="text-[10px] font-black uppercase text-neutral-400">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingVendor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#191A23] rounded-sm w-full max-w-md p-6 shadow-[8px_8px_0px_0px_rgba(25,26,35,1)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <HugeiconsIcon icon={Alert01Icon} size={20} />
              <h3 className="text-lg font-black uppercase tracking-tight">Reject Application</h3>
            </div>
            <p className="text-sm font-medium text-neutral-500 uppercase mb-4 tracking-wider">
              Reason for rejecting <span className="text-[#191A23] font-black">{rejectingVendor.storeName}</span>:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="E.g. Business documentation is invalid or incomplete..."
              className="w-full h-32 p-3 border-2 border-[#191A23] rounded-sm text-sm font-medium placeholder:text-neutral-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all bg-neutral-50"
            ></textarea>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setRejectingVendor(null)}
                className="flex-1 py-3 border-2 border-[#191A23] rounded-sm text-xs font-black uppercase hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="flex-1 py-3 border-2 border-[#191A23] rounded-sm bg-red-100 text-red-600 text-xs font-black uppercase hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
