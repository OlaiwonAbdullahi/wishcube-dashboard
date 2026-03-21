"use client";

import React, { useEffect, useState } from "react";
import { getProductsByVendorId, deleteProduct, Product } from "@/lib/products";
import { getMyVendorProfile } from "@/lib/vendor";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PackageIcon,
  PlusSignIcon,
  Edit01Icon,
  Delete02Icon,
  SearchIcon,
  FilterIcon,
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
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const profileRes = await getMyVendorProfile();

      if (profileRes.success && profileRes.data?.vendor) {
        const response = await getProductsByVendorId(
          profileRes.data.vendor._id
        );
        if (response.success && response.data) {
          setProducts(response.data.products);
        } else {
          toast.error(response.message || "Failed to fetch products");
        }
      } else {
        toast.error(
          profileRes.message ||
            "Could not find your vendor profile. Please ensure your store is set up correctly."
        );
      }
    } catch (error) {
      console.error("Products fetch error:", error);
      toast.error("An unexpected error occurred while fetching products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setIsActionLoading(true);
    try {
      const response = await deleteProduct(deletingProduct._id);
      if (response.success) {
        toast.success("Product deleted successfully");
        setDeletingProduct(null);
        await fetchProducts();
      } else {
        toast.error(response.message || "Failed to delete product");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during deletion");
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#191A23] uppercase tracking-tight">
            Inventory Management
          </h1>
          <p className="text-sm font-medium text-neutral-500 uppercase mt-1 tracking-wider">
            Total products: {products.length}
          </p>
        </div>
        <Button
          asChild
          className="h-12 border-2 border-[#191A23] rounded-sm bg-[#B4F8C8] text-[#191A23] font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] transition-all"
        >
          <Link
            href="/mystore/products/new"
            className="gap-2 flex items-center"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={18} />
            Add New Product
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <HugeiconsIcon
            icon={SearchIcon}
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <Input
            placeholder="SEARCH PRODUCTS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 border-2 border-[#191A23] rounded-sm font-bold uppercase text-xs focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all"
          />
        </div>
        <Button
          variant="outline"
          className="h-12 border-2 border-[#191A23] rounded-sm font-black uppercase text-xs hover:bg-neutral-50"
        >
          <HugeiconsIcon icon={FilterIcon} size={18} className="mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              className="border-2 border-[#191A23] rounded-sm shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] animate-pulse"
            >
              <div className="aspect-square bg-neutral-100 border-b-2 border-[#191A23]" />
              <CardHeader className="p-4 space-y-2">
                <div className="h-4 bg-neutral-100 rounded w-3/4" />
                <div className="h-3 bg-neutral-100 rounded w-1/2" />
              </CardHeader>
            </Card>
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-neutral-100 border-2 border-[#191A23] rounded-sm flex items-center justify-center mx-auto opacity-50">
              <HugeiconsIcon icon={PackageIcon} size={32} />
            </div>
            <p className="text-sm font-black uppercase text-neutral-400">
              No products found
            </p>
            <Button
              asChild
              variant="link"
              className="text-[#191A23] font-black uppercase text-xs"
            >
              <Link href="/mystore/products/new">Add your first product</Link>
            </Button>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card
              key={product._id}
              className="group border-2 pt-0 border-[#191A23] rounded-sm shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all overflow-hidden"
            >
              <div className="relative aspect-video bg-neutral-50 border-b-2 border-[#191A23] overflow-hidden">
                {product.images?.[0]?.url ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HugeiconsIcon
                      icon={PackageIcon}
                      size={48}
                      className="text-neutral-200"
                    />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  <Badge
                    className={cn(
                      "border-2 border-[#191A23] font-black uppercase text-[8px]",
                      product.isAvailable
                        ? "bg-[#B4F8C8] text-[#191A23]"
                        : "bg-red-100 text-red-600"
                    )}
                  >
                    {product.isAvailable ? "Available" : "Out of Stock"}
                  </Badge>
                  {product.isFeatured && (
                    <Badge className="bg-amber-100 text-amber-600 border-2 border-[#191A23] font-black uppercase text-[8px]">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
              <CardHeader className="p-4 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                      {product.category}
                    </p>
                    <CardTitle className="text-sm font-black uppercase truncate max-w-[150px]">
                      {product.name}
                    </CardTitle>
                  </div>
                  <p className="text-sm font-black text-[#191A23]">
                    ₦{product.price.toLocaleString()}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 border-t-2 border-[#191A23]/5 flex items-center justify-between">
                <p className="text-[10px] font-bold text-neutral-500 uppercase">
                  Stock:{" "}
                  <span className="text-[#191A23] font-black">
                    {product.stock}
                  </span>
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-sm border-2 border-transparent hover:border-[#191A23] hover:bg-blue-50 text-blue-600 transition-all"
                  >
                    <Link href={`/mystore/products/edit/${product._id}`}>
                      <HugeiconsIcon icon={Edit01Icon} size={16} />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingProduct(product)}
                    className="h-8 w-8 rounded-sm border-2 border-transparent hover:border-[#191A23] hover:bg-red-50 text-red-600 transition-all"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingProduct}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
      >
        <DialogContent className="border-4 border-[#191A23] rounded-sm p-6 shadow-[8px_8px_0px_0px_rgba(25,26,35,1)]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <HugeiconsIcon icon={Delete02Icon} size={24} />
              <DialogTitle className="text-xl font-black uppercase tracking-tight">
                Delete Product
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
              Are you sure you want to delete{" "}
              <span className="text-[#191A23] font-black">
                {deletingProduct?.name}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-3 sm:justify-start">
            <Button
              variant="outline"
              onClick={() => setDeletingProduct(null)}
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
    </div>
  );
}
