"use client";

import { useEffect, useState } from "react";
import Overview from "./_components/overview";
import RecentWorks from "./_components/recent-works";
import { getDashboardOverview, DashboardOverviewResponse } from "@/lib/dashboard";
import { getSubscriptionStatus, SubscriptionStatusData } from "@/lib/subscriptions";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardOverviewResponse["data"] | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionStatusData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [overviewRes, subRes] = await Promise.all([
        getDashboardOverview(),
        getSubscriptionStatus(),
      ]);
      if (overviewRes.success && overviewRes.data) setData(overviewRes.data);
      if (subRes.success && subRes.data) setSubscription(subRes.data);
    };
    fetchData();
  }, []);

  const isPro =
    subscription?.status === "active" &&
    (subscription?.tier === "pro" || subscription?.tier === "premium");

  const tier = (subscription?.tier ?? "free") as "free" | "pro" | "premium";

  return (
    <div className="">
      <Overview
        initialStats={data?.stats}
        isPro={isPro}
        tier={tier}
      />
      <RecentWorks
        websites={data?.recentWorks?.websites || []}
        cards={data?.recentWorks?.cards || []}
      />
    </div>
  );
}
