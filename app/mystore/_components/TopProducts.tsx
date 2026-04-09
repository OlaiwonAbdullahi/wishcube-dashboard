import { HugeiconsIcon } from "@hugeicons/react";
import { PackageIcon } from "@hugeicons/core-free-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopProductsProps {
  products: Array<{
    _id: string;
    name: string;
    totalSales: number;
    unitsSold: number;
  }>;
}

export function TopProducts({ products }: TopProductsProps) {
  return (
    <Card className="border-2 border-[#191A23] rounded-none pt-0 shadow-[6px_6px_0px_0px_rgba(25,26,35,1)]">
      <CardHeader className="border-b-2 border-[#191A23] bg-[#F3F3F3] p-4">
        <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
          <HugeiconsIcon icon={PackageIcon} size={18} />
          Top Products
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {products && products.length > 0 ? (
          <div className="divide-y-2 border-[#191A23]">
            {products.map((product, index) => (
              <div
                key={product._id || index}
                className="p-4 flex items-center justify-between group hover:bg-neutral-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FF6B6B] border-2 border-[#191A23] rounded-none flex items-center justify-center text-white font-black">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#191A23]">
                      {product.name}
                    </p>
                    <p className="text-[10px] uppercase font-black text-neutral-500">
                      {product.unitsSold} Units Sold
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-[#191A23]">
                    NGN {product.totalSales?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <div className="w-12 h-12 bg-neutral-100 border-2 border-[#191A23] rounded-none flex items-center justify-center opacity-50">
              <HugeiconsIcon icon={PackageIcon} size={24} />
            </div>
            <p className="text-xs font-bold uppercase text-neutral-400">
              No product data available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
