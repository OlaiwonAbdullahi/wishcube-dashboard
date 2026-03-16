"use client";

import React, { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/admin";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroupIcon,
  Tick01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      if (response.success && response.data) {
        setUsers(response.data.users);
        setTotal(response.data.total);
      } else {
        toast.error(response.message || "Failed to fetch users");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#191A23] uppercase tracking-tight">
            User Management
          </h1>
          <p className="text-sm font-medium text-neutral-500 uppercase mt-1 tracking-wider">
            Total registered users: {total}
          </p>
        </div>
        <div className="p-3 rounded-sm border-2 border-[#191A23] bg-blue-50">
          <HugeiconsIcon
            icon={UserGroupIcon}
            size={24}
            className="text-blue-500"
          />
        </div>
      </div>

      <div className="bg-white border-2 border-[#191A23] rounded-sm shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F3F3F3] border-b-2 border-[#191A23]">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">
                  User
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-[#191A23]">
                  Last Login
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-[#191A23] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs font-bold uppercase text-neutral-400">
                        Loading users...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm font-bold text-neutral-400 uppercase"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const userId = user._id || user.id;
                  return (
                    <tr
                      key={userId}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neutral-100 border-2 border-[#191A23] flex items-center justify-center text-[10px] font-black uppercase">
                            {user.name.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-[#191A23]">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-neutral-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-sm text-[10px] font-black uppercase border-2 border-[#191A23] ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {user.isActive ? (
                            <>
                              <div className="p-0.5 rounded-full bg-green-100 border border-green-500">
                                <HugeiconsIcon
                                  icon={Tick01Icon}
                                  size={10}
                                  className="text-green-600"
                                />
                              </div>
                              <span className="text-[10px] font-black uppercase text-green-600">
                                Active
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="p-0.5 rounded-full bg-red-100 border border-red-500">
                                <HugeiconsIcon
                                  icon={Cancel01Icon}
                                  size={10}
                                  className="text-red-600"
                                />
                              </div>
                              <span className="text-[10px] font-black uppercase text-red-600">
                                Inactive
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Never"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
