/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  getAllVendorsAdmin,
  toggleVendorActive,
  deleteVendor,
  approveVendor,
  rejectVendor,
} from "@/lib/admin";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store01Icon,
  Tick01Icon,
  Cancel01Icon,
  Alert01Icon,
  Delete02Icon,
  ViewIcon,
  Store01FreeIcons,
  Cancel01FreeIcons,
  Tick01FreeIcons,
  Delete02FreeIcons,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingVendor, setDeletingVendor] = useState<any>(null);
  const [togglingVendor, setTogglingVendor] = useState<any>(null);
  const [rejectingVendor, setRejectingVendor] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await getAllVendorsAdmin();
      console.log(response);
      if (response.success) {
        const vendorList = response.data?.vendors || [];
        const vendorTotal = response.data?.total || 0;

        setVendors(Array.isArray(vendorList) ? vendorList : []);
        setTotal(vendorTotal);
      } else {
        toast.error(response.message || "Failed to fetch vendors");
        setVendors([]);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (vendor: any) => {
    setTogglingVendor(vendor);
    setIsActionLoading(true);
    const vendorId = vendor._id || vendor.id;
    try {
      const response = await toggleVendorActive(vendorId);
      if (response.success) {
        toast.success(response.message || "Vendor status updated!");
        await fetchVendors();
      } else {
        toast.error(response.message || "Update failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsActionLoading(false);
      setTogglingVendor(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingVendor) return;
    setIsActionLoading(true);
    const vendorId = deletingVendor._id || deletingVendor.id;
    try {
      const response = await deleteVendor(vendorId);
      if (response.success) {
        toast.success("Vendor deleted successfully");
        setDeletingVendor(null);
        await fetchVendors();
      } else {
        toast.error(response.message || "Deletion failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during deletion");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleApprove = async (vendor: any) => {
    setIsActionLoading(true);
    const vendorId = vendor._id || vendor.id;
    try {
      const response = await approveVendor(vendorId);
      if (response.success) {
        toast.success(response.message || "Vendor approved!");
        await fetchVendors();
      } else {
        toast.error(response.message || "Approval failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectingVendor) return;
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setIsActionLoading(true);
    const vendorId = rejectingVendor._id || rejectingVendor.id;
    try {
      const response = await rejectVendor(vendorId, rejectReason);
      if (response.success) {
        toast.success(response.message || "Vendor rejected!");
        setRejectingVendor(null);
        setRejectReason("");
        await fetchVendors();
      } else {
        toast.error(response.message || "Rejection failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsActionLoading(false);
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
          <HugeiconsIcon
            icon={Store01FreeIcons}
            size={24}
            className="text-pink-500"
          />
        </div>
      </div>

      <div className="bg-white border-2 border-[#191A23] rounded-sm shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F3F3F3] border-b-2 border-[#191A23]">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">
                  Store Details
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">
                  Owner
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">
                  Rating/Sales
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-[#191A23] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs font-bold uppercase text-neutral-400">
                        Loading vendors...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (vendors || []).length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm font-bold text-neutral-400 uppercase"
                  >
                    No vendors found
                  </td>
                </tr>
              ) : (
                (vendors || []).map((vendor) => {
                  const vendorId = vendor._id || vendor.id;
                  const isToggling =
                    togglingVendor?._id === vendorId ||
                    togglingVendor?.id === vendorId;

                  return (
                    <tr
                      key={vendorId}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-sm bg-neutral-100 border-2 border-[#191A23] overflow-hidden flex items-center justify-center shrink-0">
                            {vendor.logo ? (
                              <img
                                src={vendor.logo}
                                alt={vendor.storeName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <HugeiconsIcon
                                icon={Store01FreeIcons}
                                size={16}
                                className="text-neutral-400"
                              />
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-black uppercase text-[#191A23] block">
                              {vendor.storeName}
                            </span>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase">
                              {vendor.category}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#191A23]">
                            {vendor.userId?.name || "Unknown"}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            {vendor.userId?.email || "No email"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <Badge
                            className={cn(
                              "w-fit text-[8px] font-black uppercase border-2 border-[#191A23]",
                              vendor.isActive
                                ? "bg-[#B4F8C8] text-[#191A23]"
                                : "bg-[#FFE5E5] text-[#191A23]",
                            )}
                          >
                            {vendor.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge className="w-fit text-[8px] font-black uppercase border-2 border-[#191A23] bg-blue-50 text-blue-600">
                            {vendor.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1 text-amber-500 font-black">
                            <span className="text-sm">{vendor.rating}</span>
                            <div className="w-2.5 h-2.5 bg-amber-500 rounded-full border border-[#191A23]"></div>
                          </div>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase">
                            NGN {vendor.totalEarnings?.toLocaleString() || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {vendor.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(vendor)}
                                disabled={isActionLoading}
                                className="p-1.5 rounded-sm bg-green-100 border-2 border-[#191A23] text-green-600 hover:bg-green-200 transition-colors"
                                title="Approve"
                              >
                                <HugeiconsIcon icon={Tick01Icon} size={16} />
                              </button>
                              <button
                                onClick={() => setRejectingVendor(vendor)}
                                disabled={isActionLoading}
                                className="p-1.5 rounded-sm bg-red-100 border-2 border-[#191A23] text-red-600 hover:bg-red-200 transition-colors"
                                title="Reject"
                              >
                                <HugeiconsIcon icon={Cancel01Icon} size={16} />
                              </button>
                            </>
                          )}
                          {vendor.status === "approved" && (
                            <button
                              onClick={() => handleToggleActive(vendor)}
                              disabled={isActionLoading}
                              className={cn(
                                "p-1.5 rounded-sm border-2 border-[#191A23] transition-all",
                                vendor.isActive
                                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                                  : "bg-green-100 text-green-600 hover:bg-green-200",
                                isToggling && "opacity-50 animate-pulse",
                              )}
                              title={vendor.isActive ? "Deactivate" : "Activate"}
                            >
                              {vendor.isActive ? (
                                <HugeiconsIcon icon={Cancel01Icon} size={16} />
                              ) : (
                                <HugeiconsIcon icon={Tick01Icon} size={16} />
                              )}
                            </button>
                          )}
                          {vendor.slug && (
                            <Link
                              href={`/marketplace/store/${vendor.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-sm bg-blue-100 border-2 border-[#191A23] text-blue-600 hover:bg-blue-200 transition-colors"
                              title="View Public Store"
                            >
                              <HugeiconsIcon icon={ViewIcon} size={16} />
                            </Link>
                          )}
                          <button
                            onClick={() => setDeletingVendor(vendor)}
                            className="p-1.5 rounded-sm bg-neutral-100 border-2 border-[#191A23] text-[#191A23] hover:bg-neutral-200 transition-colors"
                            title="Delete Permanently"
                          >
                            <HugeiconsIcon icon={Delete02Icon} size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!deletingVendor}
        onOpenChange={(open) => !open && setDeletingVendor(null)}
      >
        <DialogContent className="border-4 border-[#191A23] rounded-sm p-6 shadow-[8px_8px_0px_0px_rgba(25,26,35,1)]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <HugeiconsIcon icon={Delete02Icon} size={24} />
              <DialogTitle className="text-xl font-black uppercase tracking-tight">
                Delete Vendor Permanently
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
              Are you sure you want to delete{" "}
              <span className="text-[#191A23] font-black">
                {deletingVendor?.storeName}
              </span>
              ? This will reset the user to a regular role and delete all store
              data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-3 sm:justify-start">
            <Button
              variant="outline"
              onClick={() => setDeletingVendor(null)}
              className="flex-1 border-2 border-[#191A23] rounded-sm text-xs font-black uppercase hover:bg-neutral-50 transition-colors h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isActionLoading}
              className="flex-1 border-2 border-[#191A23] rounded-sm bg-red-100 text-red-600 text-xs font-black uppercase hover:bg-red-200 transition-colors h-12 shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]"
            >
              {isActionLoading ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Modal */}
      <Dialog
        open={!!rejectingVendor}
        onOpenChange={(open) => {
          if (!open) {
            setRejectingVendor(null);
            setRejectReason("");
          }
        }}
      >
        <DialogContent className="border-4 border-[#191A23] rounded-sm p-6 shadow-[8px_8px_0px_0px_rgba(25,26,35,1)]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <HugeiconsIcon icon={Cancel01Icon} size={24} />
              <DialogTitle className="text-xl font-black uppercase tracking-tight">
                Reject Vendor Application
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm font-medium text-neutral-500 tracking-wider">
              Please provide a reason for rejecting{" "}
              <span className="text-[#191A23] font-black">
                {rejectingVendor?.storeName}
              </span>
              . This will be sent to the user.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <textarea
              className="w-full border-2 border-[#191A23] rounded-sm p-3 text-sm focus:outline-none focus:ring-0"
              placeholder="Enter rejection reason..."
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-6 flex gap-3 sm:justify-start">
            <Button
              variant="outline"
              onClick={() => {
                setRejectingVendor(null);
                setRejectReason("");
              }}
              className="flex-1 border-2 border-[#191A23] rounded-sm text-xs font-black uppercase hover:bg-neutral-50 transition-colors h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={isActionLoading || !rejectReason.trim()}
              className="flex-1 border-2 border-[#191A23] rounded-sm bg-red-100 text-red-600 text-xs font-black uppercase hover:bg-red-200 transition-colors h-12 shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]"
            >
              {isActionLoading ? "Rejecting..." : "Confirm Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
