"use client";

import { useEffect, useState, useCallback } from "react";
import { Product, getProducts, getDigitalGifts } from "@/lib/products";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Store01Icon, ShoppingBasket03Icon } from "@hugeicons/core-free-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  MarketplaceFilters,
  FilterState,
} from "./_components/marketplace-filters";
import { ProductsGrid, DigitalGiftsGrid } from "./_components/tab-grids";

const DEFAULT_FILTERS: FilterState = {
  search: "",
  category: "All",
  occasion: "All",
  state: "All",
  minPrice: "",
  maxPrice: "",
};

const TAB_TRIGGERS = [
  { value: "physical", label: "All Gifts" },
  { value: "digital", label: "Digital Vouchers" },
] as const;

export default function MarketplacePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [digitalGifts, setDigitalGifts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState("physical");

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleResetAdvanced = useCallback(() => {
    setFilters((prev) => ({ ...prev, minPrice: "", maxPrice: "" }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (filters.search) params.search = filters.search;
        if (filters.category !== "All") params.category = filters.category;
        if (filters.occasion !== "All") params.occasion = filters.occasion;
        if (filters.state !== "All") params.state = filters.state;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;

        const [productsRes, digitalGiftsRes] = await Promise.all([
          getProducts(params),
          getDigitalGifts(),
        ]);

        if (!productsRes.success)
          toast.error(productsRes.message || "Failed to load products");
        if (!digitalGiftsRes.success)
          toast.error(
            digitalGiftsRes.message || "Failed to load digital gifts",
          );

        setProducts(productsRes.data?.products ?? []);
        setDigitalGifts(digitalGiftsRes.data?.products ?? []);
      } catch (err) {
        console.error("Marketplace fetch error:", err);
        toast.error("Something went wrong while fetching data");
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchData, 300);
    return () => clearTimeout(debounce);
  }, [filters]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm border-2 border-[#191A23] border-b-4 bg-[#D1E9FF] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(25,26,35,0.2)]">
                <HugeiconsIcon
                  icon={Store01Icon}
                  size={20}
                  color="#191A23"
                  strokeWidth={1.5}
                />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#191A23] uppercase tracking-tighter">
                Marketplace
              </h1>
            </div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-[52px]">
              Find the perfect gift for any occasion
            </p>
          </div>

          {/* Gift Box shortcut */}
          <Button
            onClick={() => router.push("/dashboard/marketplace/giftbox")}
            className="self-start rounded-sm border-2 border-[#191A23] border-b-4 bg-[#FFD700] hover:bg-[#e6c200] py-4 text-[#191A23] font-black uppercase text-xs gap-2 active:border-b-2 active:translate-y-0.5 transition-all shrink-0"
          >
            <HugeiconsIcon
              icon={ShoppingBasket03Icon}
              size={15}
              color="#191A23"
              strokeWidth={1.5}
            />
            My Gift Box
          </Button>
          <div className="hidden">
            <MarketplaceFilters
              filters={filters}
              onChange={handleFilterChange}
              onResetAdvanced={handleResetAdvanced}
            />
          </div>
        </div>

        {/* ── Tabs ────────────────────────────────────────────────── */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent h-auto p-0 border-2 border-[#191A23] border-b-4 rounded-sm flex gap-0 overflow-x-auto no-scrollbar mb-8">
            {TAB_TRIGGERS.map((tab, idx) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`
                  relative px-5 py-3 font-black uppercase text-[11px] tracking-widest rounded-none
                  text-neutral-400 data-[state=active]:text-[#191A23]
                  data-[state=active]:bg-white data-[state=active]:shadow-none
                  transition-all
                  ${idx < TAB_TRIGGERS.length - 1 ? "border-r-2 border-[#191A23]" : ""}
                `}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="physical" className="mt-0 outline-none">
            <ProductsGrid
              loading={loading}
              products={products}
              search={filters.search}
            />
          </TabsContent>

          <TabsContent value="digital" className="mt-0 outline-none">
            <DigitalGiftsGrid loading={loading} digitalGifts={digitalGifts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
