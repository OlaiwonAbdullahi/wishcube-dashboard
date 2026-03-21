"use client";

import React, { useState, useRef } from "react";
import { createProduct, uploadProductImage } from "@/lib/products";
import {
  ArrowLeft01Icon,
  Upload01Icon,
  MapsCircle02Icon,
  Cancel01Icon,
  ImageAdd01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const categories = [
  "Cakes",
  "Flowers",
  "Fashion",
  "Electronics",
  "Experiences",
  "Vouchers",
  "Food",
  "Jewelry",
  "Other",
];

const NewProductPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Cakes",
    stock: "1",
    deliveryZones: [] as string[],
  });
  const [newZone, setNewZone] = useState("");
  const [images, setImages] = useState<{ url: string; publicId: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadProductImage(file);
      if (response.success && response.data) {
        setImages([...images, response.data]);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(response.message || "Failed to upload image");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddZone = () => {
    if (newZone && !formData.deliveryZones.includes(newZone)) {
      setFormData({
        ...formData,
        deliveryZones: [...formData.deliveryZones, newZone],
      });
      setNewZone("");
    }
  };

  const handleRemoveZone = (zone: string) => {
    setFormData({
      ...formData,
      deliveryZones: formData.deliveryZones.filter((z) => z !== zone),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        deliveryZones: formData.deliveryZones,
        images,
      };

      const response = await createProduct(productData);

      if (response.success) {
        toast.success("Product created successfully!");
        router.push("/mystore/products");
      } else {
        toast.error(response.message || "Failed to create product");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-10 w-10 border-2 border-[#191A23] rounded-sm hover:bg-neutral-50"
        >
          <Link href="/mystore/products">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-black text-[#191A23] uppercase tracking-tight">
            Add New Product
          </h1>
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
            Fill in the details to list a new item in your store
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <Card className="border-2 border-[#191A23] rounded-sm shadow-[6px_6px_0px_0px_rgba(25,26,35,1)]">
            <CardHeader className="border-b-2 border-[#191A23] bg-[#F3F3F3]">
              <CardTitle className="text-sm font-black uppercase tracking-wider">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-[#191A23]">
                  Product Name
                </Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Chocolate Fudge Cake"
                  className="h-12 border-2 border-[#191A23] rounded-sm font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-[#191A23]">
                  Description
                </Label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your product in detail..."
                  className="w-full h-32 p-3 border-2 border-[#191A23] rounded-sm text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-[#191A23]">
                    Category
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(val) =>
                      setFormData({ ...formData, category: val })
                    }
                  >
                    <SelectTrigger className="h-12 py-5 w-full border-2 border-[#191A23] rounded-sm font-bold focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-[#191A23] rounded-sm font-bold">
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat}
                          value={cat}
                          className="focus:bg-[#B4F8C8]"
                        >
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-[#191A23]">
                    Stock Quantity
                  </Label>
                  <Input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="h-12 border-2 border-[#191A23] rounded-sm font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Delivery */}
          <Card className="border-2 border-[#191A23] rounded-sm shadow-[6px_6px_0px_0px_rgba(25,26,35,1)]">
            <CardHeader className="border-b-2 border-[#191A23] bg-[#F3F3F3]">
              <CardTitle className="text-sm font-black uppercase tracking-wider">
                Pricing & Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-[#191A23]">
                  Price (NGN)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-[#191A23]">
                    ₦
                  </span>
                  <Input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0.00"
                    className="h-12 pl-8 border-2 border-[#191A23] rounded-sm font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-[#191A23] flex items-center gap-1">
                  <HugeiconsIcon icon={MapsCircle02Icon} size={14} />
                  Delivery Zones
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newZone}
                    onChange={(e) => setNewZone(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddZone())
                    }
                    placeholder="e.g. Lagos Island"
                    className="h-12 border-2 border-[#191A23] rounded-sm font-bold focus-visible:ring-0 flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddZone}
                    className="h-12 border-2 border-[#191A23] rounded-sm bg-[#191A23] text-white font-black uppercase text-xs"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.deliveryZones.map((zone) => (
                    <Badge
                      key={zone}
                      className="bg-[#F3F3F3] text-[#191A23] border-2 border-[#191A23] rounded-sm py-1 px-2 flex items-center gap-2"
                    >
                      <span className="text-[10px] font-black uppercase">
                        {zone}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveZone(zone)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <HugeiconsIcon icon={Cancel01Icon} size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="border-2 border-[#191A23] rounded-sm shadow-[6px_6px_0px_0px_rgba(25,26,35,1)]">
            <CardHeader className="border-b-2 border-[#191A23] bg-[#F3F3F3]">
              <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <HugeiconsIcon icon={Upload01Icon} size={18} />
                Product Images
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square border-2 border-[#191A23] rounded-sm overflow-hidden group"
                  >
                    <img
                      src={img.url}
                      alt={`Product ${index}`}
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

          <Button
            type="submit"
            disabled={loading || isUploading}
            className="w-full h-16 border-2 border-[#191A23] rounded-sm bg-[#B4F8C8] text-[#191A23] font-black uppercase text-sm shadow-[8px_8px_0px_0px_rgba(25,26,35,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
          >
            {loading ? "Creating..." : "Publish Product"}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default NewProductPage;
