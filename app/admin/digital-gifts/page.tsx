/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  getDigitalGifts,
  createDigitalGift,
  deleteDigitalGift,
  DigitalGiftData,
  uploadProductImage,
} from "@/lib/admin";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PackageIcon,
  PlusSignIcon,
  ImageAdd01Icon,
  Cancel01Icon,
  Delete02Icon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DigitalGiftsPage() {
  const [gifts, setGifts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<DigitalGiftData>({
    name: "",
    price: 0,
    description: "",
    images: [],
  });
  const [images, setImages] = useState<{ url: string; publicId: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    setLoading(true);
    try {
      const response = await getDigitalGifts();
      if (response.success) {
        // Handle various possible response structures
        const giftList =
          (response.data as any)?.digitalGifts ||
          (response as any).digitalGifts ||
          response.data?.products ||
          (response as any).products ||
          [];

        const giftTotal =
          response.data?.total ||
          (response as any).total ||
          (Array.isArray(giftList) ? giftList.length : 0);

        setGifts(Array.isArray(giftList) ? giftList : []);
        setTotal(giftTotal);
      } else {
        toast.error(response.message || "Failed to fetch digital gifts");
        setGifts([]);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      setGifts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadProductImage(file);
      if (response.success && response.data) {
        // response.data is { url, publicId }
        setImages((prev) => [
          ...prev,
          response.data as { url: string; publicId: string },
        ]);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(response.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("An unexpected error occurred during upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createDigitalGift({
        ...formData,
        images: images,
      });

      if (response.success) {
        toast.success("Digital gift created successfully");
        setIsCreateModalOpen(false);
        setFormData({ name: "", price: 0, description: "", images: [] });
        setImages([]);
        fetchGifts();
      } else {
        toast.error(response.message || "Failed to create digital gift");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this digital gift?")) return;

    try {
      const response = await deleteDigitalGift(id);
      if (response.success) {
        toast.success("Digital gift deleted successfully");
        fetchGifts();
      } else {
        toast.error(response.message || "Failed to delete digital gift");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#191A23] uppercase tracking-tight">
            Digital Gift Management
          </h1>
          <p className="text-sm font-medium text-neutral-500 uppercase mt-1 tracking-wider">
            Total digital gifts: {total}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 px-6 rounded-sm border-2 border-[#191A23] bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#191A23] font-black uppercase shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                <HugeiconsIcon icon={PlusSignIcon} size={20} className="mr-2" />
                Create Digital Gift
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] font-space border-4 border-[#191A23] rounded-sm p-0 overflow-hidden shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]">
              <DialogHeader className="p-4  bg-[#F3F3F3] border-b-2 border-[#191A23]">
                <DialogTitle className="text-xl font-black text-[#191A23] uppercase tracking-tight">
                  New Digital Gift
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={handleSubmit}
                className="p-4 pt-0 space-y-4 bg-white"
              >
                <div className=" flex w-full gap-3">
                  <div className="space-y-2 w-1/2">
                    <Label
                      htmlFor="name"
                      className="text-xs font-black uppercase tracking-wider text-[#191A23]"
                    >
                      Gift Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="border-2 border-[#191A23] rounded-sm focus-visible:ring-0 focus-visible:border-[#191A23] h-11"
                      placeholder="e.g. Spotify Premium Voucher"
                    />
                  </div>
                  <div className="space-y-2 w-1/2">
                    <Label
                      htmlFor="price"
                      className="text-xs font-black uppercase tracking-wider text-[#191A23]"
                    >
                      Price (₦) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: Number(e.target.value),
                        })
                      }
                      className="border-2 border-[#191A23] rounded-sm focus-visible:ring-0 focus-visible:border-[#191A23] h-11"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-xs font-black uppercase tracking-wider text-[#191A23]"
                  >
                    Description
                  </Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full min-h-[100px] p-3 border-2 border-[#191A23] rounded-sm focus:outline-none focus:border-[#191A23] text-sm resize-none"
                    placeholder="Describe the digital gift..."
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="image"
                    className="text-xs font-black uppercase tracking-wider text-[#191A23]"
                  >
                    Product Images
                  </Label>
                  <Card className="border-2 p-0 border-[#191A23] rounded-sm ">
                    <CardContent className="p-6 py-3 space-y-6">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {images.map((img, index) => (
                          <div
                            key={img.publicId || index}
                            className="relative aspect-square border-2 border-[#191A23] rounded-sm overflow-hidden group"
                          >
                            <img
                              src={img.url}
                              alt={`Gift image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-white border-2 border-[#191A23] rounded-sm p-1 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <HugeiconsIcon icon={Cancel01Icon} size={12} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="aspect-square !w-full border-2 border-dashed border-[#191A23]/20 rounded-sm bg-neutral-50 flex flex-col items-center justify-center p-4 text-center hover:bg-neutral-100 transition-all disabled:opacity-50"
                        >
                          {isUploading ? (
                            <div className="w-6 h-6 border-2 border-[#191A23] border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <HugeiconsIcon
                                icon={ImageAdd01Icon}
                                size={24}
                                className="text-neutral-400 mb-2"
                              />
                              <p className="text-[10px] font-black uppercase text-neutral-400">
                                Add Image
                              </p>
                            </>
                          )}
                        </button>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-tighter">
                        Supported formats: JPG, PNG, WEBP. Max size: 5MB.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <DialogFooter className="pt-4 border-t-2 border-[#191A23]/5">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="h-11 px-6 font-black uppercase text-[#191A23]/60 hover:text-[#191A23]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 px-8 rounded-sm border-2 border-[#191A23] bg-[#191A23] text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(25,26,35,0.2)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Create Gift"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white border-2 border-[#191A23] rounded-sm shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F3F3F3] border-b-2 border-[#191A23]">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">
                  Digital Gift
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">
                  Price
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">
                  Stock
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">
                  Date Created
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-[#191A23] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs font-bold uppercase text-neutral-400">
                        Loading digital gifts...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (gifts || []).length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm font-bold text-neutral-400 uppercase"
                  >
                    No digital gifts found
                  </td>
                </tr>
              ) : (
                (gifts || []).map((gift) => (
                  <tr
                    key={gift._id}
                    className="hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-sm bg-neutral-100 border-2 border-[#191A23] overflow-hidden flex-shrink-0">
                          {gift.images?.[0]?.url ? (
                            <img
                              src={gift.images[0].url}
                              alt={gift.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <HugeiconsIcon
                                icon={PackageIcon}
                                size={20}
                                className="text-neutral-300"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-[#191A23] uppercase">
                            {gift.name}
                          </span>
                          <span className="text-[10px] font-bold text-neutral-400 truncate max-w-[200px]">
                            {gift.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-sm text-[10px] font-black uppercase border-2 border-[#191A23] bg-purple-100 text-purple-700">
                        {gift.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-[#191A23]">
                      ₦{gift.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-[#191A23] uppercase">
                        {gift.stock === "Infinity" || gift.stock > 1000000
                          ? "∞"
                          : gift.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase">
                      {new Date(gift.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(gift._id || gift.id)}
                        className="h-8 w-8 rounded-sm border-2 border-transparent hover:border-red-500 hover:bg-red-50 text-red-500 transition-all"
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
