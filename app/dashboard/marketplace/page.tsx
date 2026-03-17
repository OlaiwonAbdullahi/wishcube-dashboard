/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/products";
import { toast } from "sonner";
import { PackageSearch, Store, MapPin, Calendar, Sparkles } from "lucide-react";
import EmptyState from "./_components/empty-state";
import { getAuth } from "@/lib/auth";
import { Vendor } from "@/lib/vendor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PackageIcon,
  ShoppingBasketAdd03Icon,
  Search01Icon,
  FilterIcon,
  Store01Icon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

const categories = [
  "All",
  "Cakes",
  "Flowers",
  "Fashion",
  "Gifts",
  "Food",
  "Accessories",
  "Art & Decor",
  "Beauty & Spa",
  "Events & Parties",
  "Personalized Gifts",
];

const occasions = [
  "All",
  "Birthday",
  "Anniversary",
  "Wedding",
  "Valentine's Day",
  "Mother's Day",
  "Father's Day",
  "Christmas",
  "New Year",
  "Graduation",
  "Housewarming",
];

const states = [
  "All",
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Ibadan",
  "Kano",
  "Enugu",
  "Benin City",
  "Kaduna",
];

const MarketplacePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [digitalGifts, setDigitalGifts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [occasion, setOccasion] = useState("All");
  const [state, setState] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [featured, setFeatured] = useState(false);
  const [activeTab, setActiveTab] = useState("physical");

  const FiltersContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div
      className={cn(
        "flex flex-wrap gap-3",
        isMobile ? "flex-col w-full" : "flex-row justify-end items-end"
      )}
    >
      {!isMobile && (
        <div className={cn("relative group", isMobile ? "w-full" : "w-64")}>
          <HugeiconsIcon
            icon={Search01Icon}
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#191A23] transition-colors"
          />
          <Input
            placeholder="SEARCH..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "pl-10 border-2 border-[#191A23] py-4 rounded-sm  focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all font-bold placeholder:text-neutral-300",
              isMobile ? "w-full" : "w-64"
            )}
          />
        </div>
      )}

      <div className={cn(isMobile ? "w-full" : "w-40")}>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="border w-full border-[#191A23] rounded-sm  font-bold uppercase text-[10px] py-4 h-10">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={FilterIcon} size={14} />
              <SelectValue placeholder="CATEGORY" />
            </div>
          </SelectTrigger>
          <SelectContent className="border border-[#191A23] rounded-sm ">
            {categories.map((cat) => (
              <SelectItem
                key={cat}
                value={cat}
                className="font-bold uppercase text-[10px] focus:bg-neutral-50"
              >
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={cn(isMobile ? "w-full" : "w-40")}>
        <Select value={occasion} onValueChange={setOccasion}>
          <SelectTrigger className="border border-[#191A23] py-4 w-full rounded-sm  font-bold uppercase text-[10px] h-10">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <SelectValue placeholder="OCCASION" />
            </div>
          </SelectTrigger>
          <SelectContent className="border border-[#191A23] rounded-sm ">
            {occasions.map((occ) => (
              <SelectItem
                key={occ}
                value={occ}
                className="font-bold uppercase text-[10px] focus:bg-neutral-50"
              >
                {occ}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={cn(isMobile ? "w-full" : "w-40")}>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger className="border w-full py-4 border-[#191A23] rounded-sm  font-bold uppercase text-[10px] h-10">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <SelectValue placeholder="LOCATION" />
            </div>
          </SelectTrigger>
          <SelectContent className="border border-[#191A23] rounded-sm ">
            {states.map((s) => (
              <SelectItem
                key={s}
                value={s}
                className="font-bold uppercase text-[10px] focus:bg-neutral-50"
              >
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "border border-[#191A23] rounded-sm  font-black uppercase text-[10px] h-10 gap-2 hover:bg-[#191A23] hover:text-white transition-all",
              isMobile ? "w-full" : ""
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Advanced
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 border border-[#191A23] rounded-sm shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] p-4 space-y-4">
          <div className="space-y-2">
            <h4 className="font-black uppercase text-xs tracking-widest text-neutral-400">
              Price Range (₦)
            </h4>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="h-8 border border-[#191A23] rounded-none font-bold text-xs"
              />
              <span className="font-bold">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-8 border-2 border-[#191A23] rounded-none font-bold text-xs"
              />
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-8 border-2 border-[#191A23] font-black uppercase text-[10px] shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] hover:bg-[#191A23] hover:text-white transition-all active:shadow-none active:translate-x-px active:translate-y-px"
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
              setFeatured(false);
            }}
          >
            Reset Advanced
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const auth = getAuth();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth?.token || ""}`,
      };

      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append("search", search);
        if (category !== "All") queryParams.append("category", category);
        if (occasion !== "All") queryParams.append("occasion", occasion);
        if (state !== "All") queryParams.append("state", state);
        if (minPrice) queryParams.append("minPrice", minPrice);
        if (maxPrice) queryParams.append("maxPrice", maxPrice);
        if (featured) queryParams.append("featured", "true");

        const [productsRes, digitalGiftsRes, vendorsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products?${queryParams.toString()}`, {
            headers,
          }),
          fetch(`${API_BASE_URL}/products/digital-gifts`, { headers }),
          fetch(`${API_BASE_URL}/vendors?${queryParams.toString()}`, {
            headers,
          }),
        ]);

        const productsData = await productsRes.json();
        const digitalGiftsData = await digitalGiftsRes.json();
        const vendorsData = await vendorsRes.json();

        if (!productsData.success) {
          toast.error(productsData.message || "Failed to load products");
        }
        if (!digitalGiftsData.success) {
          toast.error(
            digitalGiftsData.message || "Failed to load digital gifts"
          );
        }
        if (!vendorsData.success) {
          toast.error(vendorsData.message || "Failed to load vendors");
        }

        // Handle products
        if (productsData.success && productsData.data?.products) {
          console.log(productsData.data.products);
          setProducts(productsData.data.products);
        } else {
          setProducts([]);
        }

        // Handle digital gifts
        if (digitalGiftsData.success && digitalGiftsData.data?.products) {
          setDigitalGifts(digitalGiftsData.data.products);
        } else {
          setDigitalGifts([]);
        }

        // Handle vendors
        if (vendorsData.success && vendorsData.data?.vendors) {
          setVendors(vendorsData.data.vendors);
        } else {
          setVendors([]);
        }
      } catch (error) {
        console.error("Marketplace fetch error:", error);
        toast.error("Something went wrong while fetching data");
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(debounce);
  }, [search, category, occasion, state, minPrice, maxPrice, featured]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-[#191A23] uppercase tracking-tighter">
            Marketplace
          </h1>
          <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest">
            Find the perfect gift for any occasion
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <FiltersContent />
          </div>

          {/* Mobile/Tablet Toggle */}
          <div className="lg:hidden flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 group">
              <HugeiconsIcon
                icon={Search01Icon}
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#191A23] transition-colors"
              />
              <Input
                placeholder="SEARCH..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border border-[#191A23] py-4 w-full rounded-sm  focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all font-bold placeholder:text-neutral-300"
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="border border-[#191A23] rounded-sm h-10 w-10 p-0 hover:bg-[#191A23] hover:text-white transition-all"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] px-5"
              >
                <SheetHeader className="mb-6">
                  <SheetTitle className="font-black uppercase tracking-tighter text-2xl">
                    Filters
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <FiltersContent isMobile={true} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent w-full h-auto p-5 rounded-sm flex gap-4  border border-[#191A23] mb-8 overflow-x-auto no-scrollbar">
          <TabsTrigger
            value="physical"
            className="px-0 py-3 rounded-xs  border border-transparent data-[state=active]:border-[#191A23] data-[state=active]:bg-transparent font-black uppercase text-xs tracking-widest text-neutral-400 data-[state=active]:text-[#191A23] transition-all"
          >
            All Gifts
          </TabsTrigger>
          <TabsTrigger
            value="digital"
            className="px-0 py-3 rounded-none border border-transparent data-[state=active]:border-[#191A23] data-[state=active]:bg-transparent font-black uppercase text-xs tracking-widest text-neutral-400 data-[state=active]:text-[#191A23] transition-all"
          >
            Digital Vouchers
          </TabsTrigger>
          <TabsTrigger
            value="vendors"
            className="px-0 py-3 rounded-none border border-transparent data-[state=active]:border-[#191A23] data-[state=active]:bg-transparent font-black uppercase text-xs tracking-widest text-neutral-400 data-[state=active]:text-[#191A23] transition-all"
          >
            Shop Directory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="physical" className="mt-0 outline-none">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 border border-[#191A23] rounded-sm animate-pulse bg-neutral-50"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={PackageSearch}
              title="No Products Found"
              description={
                search
                  ? `No results for "${search}" in this category.`
                  : "Our vendors are busy adding products. Please check back soon!"
              }
            />
          )}
        </TabsContent>

        <TabsContent value="digital" className="mt-0 outline-none">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 border border-[#191A23] rounded-sm animate-pulse bg-neutral-50"
                />
              ))}
            </div>
          ) : digitalGifts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {digitalGifts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={PackageSearch}
              title="No Vouchers Available"
              description="Check back later to see our collection of digital gift vouchers."
            />
          )}
        </TabsContent>

        <TabsContent value="vendors" className="mt-0 outline-none">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-40 border border-[#191A23] rounded-sm animate-pulse bg-neutral-50"
                />
              ))}
            </div>
          ) : vendors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {vendors.map((vendor) => (
                <VendorCard key={vendor._id} vendor={vendor} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Store}
              title="No Shops Found"
              description={
                search
                  ? `No vendors matching "${search}" found.`
                  : "We are currently onboarding new vendors. Stay tuned!"
              }
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ProductCard = ({ product }: { product: any }) => (
  <Card
    key={product._id}
    className="group p-0 border border-[#191A23] rounded-sm shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] hover:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all overflow-hidden bg-white flex flex-col h-full"
  >
    <div className="relative aspect-square bg-neutral-50 border-b-2 border-[#191A23] overflow-hidden">
      {product.images?.[0]?.url ? (
        <img
          src={product.images[0].url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-neutral-50">
          <HugeiconsIcon
            icon={PackageIcon}
            size={40}
            className="text-neutral-200"
          />
        </div>
      )}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <Badge
          className={cn(
            "border border-[#191A23] font-black uppercase text-[8px] px-1.5 py-0.5",
            product.category === "Vouchers" || product.stock > 0
              ? "bg-[#B4F8C8] text-[#191A23]"
              : "bg-red-100 text-red-600"
          )}
        >
          {product.category === "Vouchers" || product.stock > 0
            ? "Available"
            : "Sold Out"}
        </Badge>
      </div>
    </div>
    <CardHeader className="p-3 space-y-1 flex-1">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase text-neutral-400 tracking-wider truncate">
            {product.category}
          </p>
          <CardTitle
            className="text-xs font-black uppercase truncate leading-tight mb-0.5"
            title={product.name}
          >
            {product.name}
          </CardTitle>
          <div className="flex items-center gap-1">
            {product?.vendorId?.logo && (
              <img
                src={product.vendorId.logo}
                alt={product.vendorId.storeName}
                className="w-3 h-3 rounded-full border border-[#191A23]"
              />
            )}
            <p className="text-[9px] font-bold text-neutral-500 truncate uppercase">
              {product?.vendorId?.storeName || "WISHCUBE"}
            </p>
            {product?.vendorId?.rating > 0 && (
              <div className="flex items-center gap-0.5 ml-1">
                <svg className="w-2 h-2 fill-amber-500" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-[8px] font-black">
                  {product.vendorId.rating}
                </span>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs font-black text-[#191A23] whitespace-nowrap pt-0.5">
          ₦{product.price.toLocaleString()}
        </p>
      </div>
    </CardHeader>
    <CardContent className="p-3 pt-0 mt-auto">
      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex-1 h-8 rounded-sm border border-[#191A23] font-black uppercase text-[10px] shadow-[1px_1px_0px_0px_rgba(25,26,35,1)] hover:bg-[#191A23] hover:text-white transition-all active:shadow-none active:translate-x-px active:translate-y-px"
        >
          <Link href={`/dashboard/marketplace/product/${product._id}`}>
            View
          </Link>
        </Button>
        <Button
          variant="default"
          size="icon"
          className="h-8 w-8 rounded-sm border border-[#191A23] bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#191A23] shadow-[1px_1px_0px_0px_rgba(25,26,35,1)] active:shadow-none active:translate-x-px active:translate-y-px transition-all"
        >
          <HugeiconsIcon icon={ShoppingBasketAdd03Icon} size={16} />
        </Button>
      </div>
    </CardContent>
  </Card>
);

const VendorCard = ({ vendor }: { vendor: any }) => (
  <Card className="group border-2 border-[#191A23] rounded-sm p-4 text-center shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] hover:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-white flex flex-col items-center justify-center h-full">
    <div className="w-16 h-16 flex items-center justify-center bg-neutral-50 border-2 border-[#191A23] rounded-sm mb-4 shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] group-hover:bg-[#B4F8C8] transition-colors relative overflow-hidden">
      {vendor.logo ? (
        <img
          src={vendor.logo}
          alt={vendor.storeName}
          className="w-full h-full object-cover"
        />
      ) : (
        <HugeiconsIcon
          icon={Store01Icon}
          size={32}
          className="text-[#191A23]"
        />
      )}
    </div>
    <div className="space-y-1 mb-4 flex-1">
      <h3
        className="font-black text-sm uppercase truncate w-full leading-tight"
        title={vendor.storeName}
      >
        {vendor.storeName}
      </h3>
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
        {vendor.category}
      </p>
      {vendor.rating > 0 && (
        <div className="flex items-center justify-center gap-1 mt-1">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={cn(
                  "w-2.5 h-2.5 fill-current",
                  i < Math.floor(vendor.rating) ? "opacity-100" : "opacity-30"
                )}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[10px] font-black text-[#191A23]">
            {vendor.rating}
          </span>
        </div>
      )}
    </div>
    <Button
      asChild
      variant="outline"
      size="sm"
      className="w-full h-8 text-[10px] font-black uppercase border-2 border-[#191A23] rounded-sm shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] hover:bg-[#191A23] hover:text-white transition-all active:shadow-none active:translate-x-px active:translate-y-px"
    >
      <Link href={`/vendors/store/${vendor.slug}`}>Visit Store</Link>
    </Button>
  </Card>
);

export default MarketplacePage;
