import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroupIcon,
  Cards02Icon,
  Analytics01Icon,
  WebDesign02Icon,
} from "@hugeicons/core-free-icons";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,248",
      icon: UserGroupIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Cards Created",
      value: "5,672",
      icon: Cards02Icon,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      title: "Websites Generated",
      value: "3,891",
      icon: WebDesign02Icon,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Rooms",
      value: "42",
      icon: Analytics01Icon,
      color: "text-cyan-500",
      bgColor: "bg-cyan-50",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#191A23] uppercase tracking-tight">
            Admin Overview
          </h1>
          <p className="text-sm font-medium text-neutral-500 uppercase mt-1 tracking-wider">
            Manage your platform&apos;s growth and users
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border-2 border-[#191A23] rounded-sm p-6 shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className={stat.color}>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-neutral-500 transition-colors">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-black mt-1 text-[#191A23]">
                  {stat.value}
                </h3>
              </div>
              <div
                className={`p-3 rounded-sm border-2 border-[#191A23] ${stat.bgColor}`}
              >
                <HugeiconsIcon
                  icon={stat.icon}
                  size={24}
                  className={stat.color}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border-2 border-[#191A23] rounded-sm p-6 shadow-[6px_6px_0px_0px_rgba(25,26,35,1)]">
          <h2 className="text-xl font-black text-[#191A23] uppercase tracking-tight mb-6">
            Recent Activities
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 border-2 border-neutral-100 rounded-sm hover:border-[#191A23]/20 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-[#191A23] font-bold text-xs">
                  {String.fromCharCode(64 + i)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#191A23]">
                    User {i} created a new birthday card
                  </p>
                  <p className="text-[10px] font-medium text-neutral-400 uppercase">
                    2 hours ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-[#191A23] rounded-sm p-6 shadow-[6px_6px_0px_0px_rgba(25,26,35,1)]">
          <h2 className="text-xl font-black text-[#191A23] uppercase tracking-tight mb-6">
            Platform Health
          </h2>
          <div className="space-y-6">
            {["Server Status", "API Response Time", "Database Performance"].map(
              (label, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-[#191A23] tracking-wider">
                      {label}
                    </span>
                    <span className="text-[10px] font-black text-green-600 uppercase">
                      Excellent
                    </span>
                  </div>
                  <div className="h-4 w-full bg-neutral-100 border-2 border-[#191A23] rounded-sm overflow-hidden p-0.5">
                    <div className="h-full w-[95%] bg-green-400 rounded-sm border-r-2 border-[#191A23]"></div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
