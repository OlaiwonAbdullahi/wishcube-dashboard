"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  getMyVendorProfile,
  updateVendorProfile,
  uploadVendorLogo,
  getBanks,
  resolveAccount,
  type Bank,
} from "@/lib/vendor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store01Icon,
  ImageAdd01Icon,
  Cancel01Icon,
  SaveIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function StoreSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);

  // Profile state
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [deliveryZones, setDeliveryZones] = useState<string>("");

  // Bank details state
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    bankCode: "",
    bankName: "",
  });

  // Logo state
  const [logo, setLogo] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const [res, banksRes] = await Promise.all([
        getMyVendorProfile(),
        getBanks(),
      ]);

      if (banksRes.success && banksRes.data?.banks) {
        setBanks(banksRes.data.banks);
      }

      if (res.success && res.data?.vendor) {
        const vendor = res.data.vendor;
        setStoreName(vendor.storeName || "");
        setDescription(vendor.description || "");
        setCategory(vendor.category || "");
        setDeliveryZones(vendor.deliveryZones?.join(", ") || "");
        setBankDetails({
          accountName: vendor.bankDetails?.accountName || "",
          accountNumber: vendor.bankDetails?.accountNumber || "",
          bankCode: vendor.bankDetails?.bankCode || "",
          bankName: vendor.bankDetails?.bankName || "",
        });
        setLogo(vendor.logo || null);
      } else {
        toast.error("Failed to load profile");
      }
    } catch (error) {
      toast.error("An error occurred loading profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (bankDetails.accountNumber.length === 10 && bankDetails.bankCode) {
        handleResolveAccount();
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [bankDetails.accountNumber, bankDetails.bankCode]);

  const handleResolveAccount = async () => {
    setIsResolving(true);
    try {
      const res = await resolveAccount(
        bankDetails.accountNumber,
        bankDetails.bankCode,
      );
      if (res.success && res.data) {
        setBankDetails((prev) => ({
          ...prev,
          accountName: res.data!.account_name,
        }));
        // toast.success("Account name resolved");
      } else {
        toast.error(res.message || "Could not resolve account name");
      }
    } catch (error) {
      // toast.error("Failed to resolve account name");
    } finally {
      setIsResolving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Process delivery zones
    const zonesArray = deliveryZones
      .split(",")
      .map((z) => z.trim())
      .filter((z) => z.length > 0);

    try {
      const res = await updateVendorProfile({
        storeName,
        description,
        category,
        deliveryZones: zonesArray,
        bankDetails,
      });

      if (res.success) {
        toast.success("Store settings updated successfully!");
      } else {
        toast.error(res.message || "Failed to update settings");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const response = await uploadVendorLogo(file);
      if (response.success && response.data) {
        setLogo(response.data.logo);
        toast.success("Logo uploaded successfully");
      } else {
        toast.error(response.message || "Failed to upload logo");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during logo upload");
    } finally {
      setIsUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-48 bg-neutral-200 animate-pulse rounded-sm" />
        <div className="h-96 w-full bg-neutral-200 animate-pulse rounded-sm" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 font-space space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 border-b-2 border-[#191A23]/10 pb-6 mb-8">
        <div className="p-3 rounded-sm border-2 border-[#191A23] bg-pink-50">
          <HugeiconsIcon
            icon={Store01Icon}
            size={28}
            className="text-pink-500"
          />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[#191A23] uppercase tracking-tight">
            Store Settings
          </h1>
          <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest mt-1">
            Manage your store profile
          </p>
        </div>
      </div>

      {/* Logo Section */}
      <div className="bg-white border-2 border-[#191A23] rounded-sm p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]">
        <h2 className="text-xl font-black uppercase mb-6 text-[#191A23]">
          Store Logo
        </h2>
        <div className="space-y-4 max-w-md">
          <div className="grid grid-cols-1 gap-4">
            {logo ? (
              <div className="relative w-full aspect-video border-2 border-[#191A23] rounded-sm overflow-hidden group bg-neutral-50 max-w-sm">
                <img
                  src={logo}
                  alt="Store Logo"
                  className="w-full h-full object-contain p-4"
                />
                <button
                  type="button"
                  onClick={() => setLogo(null)}
                  className="absolute top-2 right-2 bg-white border-2 border-[#191A23] rounded-sm p-1.5 text-red-600 shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingLogo}
                className="w-full max-w-sm aspect-video border-2 border-dashed border-[#191A23]/20 rounded-sm bg-neutral-50 flex flex-col items-center justify-center p-8 text-center hover:bg-neutral-100 transition-all disabled:opacity-50"
              >
                {isUploadingLogo ? (
                  <div className="w-8 h-8 border-4 border-[#191A23] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <div className="p-4 bg-white border-2 border-[#191A23] rounded-sm shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] mb-4">
                      <HugeiconsIcon
                        icon={ImageAdd01Icon}
                        size={32}
                        className="text-[#191A23]"
                      />
                    </div>
                    <p className="text-xs font-black uppercase text-[#191A23] mb-1">
                      Upload Logo
                    </p>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase">
                      PNG, JPG or WEBP (Max 2MB)
                    </p>
                  </>
                )}
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleLogoUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Main Settings Form */}
      <form
        onSubmit={handleSave}
        className="bg-white border-2 border-[#191A23] rounded-sm p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] space-y-8"
      >
        {/* Basic Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-black uppercase text-[#191A23] border-b-2 border-[#191A23]/10 pb-2">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-[#191A23]">
                Store Name
              </Label>
              <Input
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="border-2 border-[#191A23] rounded-sm h-12 text-sm font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-[#191A23]">
                Category
              </Label>
              <Input
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border-2 border-[#191A23] rounded-sm h-12 text-sm font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-[10px] font-black uppercase text-[#191A23]">
                Description
              </Label>
              <Textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-2 border-[#191A23] rounded-sm p-3 text-sm font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all min-h-[100px]"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-[10px] font-black uppercase text-[#191A23]">
                Delivery Zones (Comma-separated)
              </Label>
              <Input
                value={deliveryZones}
                onChange={(e) => setDeliveryZones(e.target.value)}
                placeholder="Lagos, Abuja, Port Harcourt"
                className="border-2 border-[#191A23] rounded-sm h-12 text-sm font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="space-y-6">
          <h2 className="text-xl font-black uppercase text-[#191A23] border-b-2 border-[#191A23]/10 pb-2">
            Bank Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-[#191A23]">
                Bank Name
              </Label>
              <Select
                value={bankDetails.bankName}
                onValueChange={(value) => {
                  const selectedBank = banks.find((b) => b.name === value);
                  setBankDetails({
                    ...bankDetails,
                    bankName: value,
                    bankCode: selectedBank?.code || "",
                  });
                }}
              >
                <SelectTrigger className="w-full py-5.5 border-2 border-[#191A23] rounded-sm text-sm font-bold focus:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all bg-white">
                  <SelectValue placeholder="Select Bank" />
                </SelectTrigger>
                <SelectContent className="border-2 border-[#191A23] rounded-sm font-bold">
                  {banks.map((bank) => (
                    <SelectItem
                      key={bank.id}
                      value={bank.name}
                      className="focus:bg-[#B4F8C8] focus:text-[#191A23] cursor-pointer flex items-center"
                    >
                      <img
                        src={`https://api.dicebear.com/9.x/glass/svg?seed=${bank.slug}`}
                        alt={bank.name}
                        className="h-5 w-5 rounded-full"
                      />
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-[#191A23]">
                Account Number
              </Label>
              <Input
                required
                value={bankDetails.accountNumber}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    accountNumber: e.target.value,
                  })
                }
                maxLength={10}
                className="border-2 border-[#191A23] rounded-sm h-12 text-sm font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-[#191A23]">
              Account Name
            </Label>
            <div className="relative">
              <input
                required
                readOnly
                value={bankDetails.accountName}
                placeholder={
                  isResolving ? "Resolving account..." : "Account Name"
                }
                className={`border-2 border-[#191A23] cursor-default rounded-sm h-12 text-sm font-bold transition-all px-4 w-full ${
                  isResolving
                    ? "bg-neutral-50 opacity-70"
                    : bankDetails.accountName
                      ? "bg-[#B4F8C8]/20 text-[#191A23]"
                      : "bg-neutral-50 cursor-not-allowed"
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                {isResolving ? (
                  <div className="w-4 h-4 border-2 border-[#191A23] border-t-transparent rounded-full animate-spin" />
                ) : (
                  bankDetails.accountName && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-[#191A23] rounded-sm shadow-[2px_2px_0px_0px_rgba(180,248,200,1)]">
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        size={12}
                        className="text-[#B4F8C8]"
                      />
                      <span className="text-[8px] font-black text-[#B4F8C8] uppercase tracking-tighter">
                        Verified
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
            className="h-12 px-8 bg-[#191A23] text-white rounded-sm font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(180,248,200,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all gap-2"
          >
            {isSaving ? "Saving..." : "Save Update"}
            {!isSaving && <HugeiconsIcon icon={SaveIcon} size={16} />}
          </Button>
        </div>
      </form>
    </div>
  );
}
