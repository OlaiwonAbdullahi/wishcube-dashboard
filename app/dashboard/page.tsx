"use client";

import { useEffect, useState } from "react";
import Overview from "./_components/overview";
import RecentWorks from "./_components/recent-works";
import { getDashboardOverview, DashboardOverviewResponse } from "@/lib/dashboard";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardOverviewResponse["data"] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getDashboardOverview();
      if (res.success && res.data) {
        setData(res.data);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="">
      <Overview initialStats={data?.stats} />
      <RecentWorks 
        websites={data?.recentWorks?.websites || []} 
        cards={data?.recentWorks?.cards || []} 
      />
    </div>
  );
}
