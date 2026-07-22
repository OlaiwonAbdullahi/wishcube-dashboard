"use client";

import React, { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Settings01Icon } from "@hugeicons/core-free-icons";
import { getAdminSettings, updateAdminSettings, PlatformSettings } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const DEFAULT_SETTINGS: PlatformSettings = {
  maintenanceMode: false,
  maintenanceMessage: "",
  supportEmail: "",
  allowNewVendorRegistrations: true,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await getAdminSettings();
        if (res.success && res.data) {
          setSettings(res.data.settings);
        } else {
          toast.error(res.message || "Failed to load settings");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateAdminSettings(settings);
      if (res.success && res.data) {
        setSettings(res.data.settings);
        toast.success("Settings saved");
      } else {
        toast.error(res.message || "Failed to save settings");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#191A23] uppercase tracking-tight">
            Admin Settings
          </h1>
          <p className="text-sm font-medium text-neutral-500 uppercase mt-1 tracking-wider">
            Configure platform-wide variables
          </p>
        </div>
        <div className="p-3 rounded-sm border-2 border-[#191A23] bg-neutral-50">
          <HugeiconsIcon icon={Settings01Icon} size={24} className="text-neutral-500" />
        </div>
      </div>

      {loading ? (
        <div className="bg-white border-2 border-[#191A23] rounded-sm p-10 text-center text-sm font-bold text-neutral-400">
          Loading settings…
        </div>
      ) : (
        <div className="bg-white border-2 border-[#191A23] rounded-sm shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] p-6 space-y-6 max-w-2xl">
          <div className="flex items-center justify-between p-4 border-2 border-[#191A23]/10 rounded-sm">
            <div>
              <p className="text-sm font-black uppercase text-[#191A23]">Maintenance Mode</p>
              <p className="text-[10px] font-medium text-neutral-400 mt-0.5">
                Marks the platform as under maintenance (setting only - not yet wired to a request gate)
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings((s) => ({ ...s, maintenanceMode: !s.maintenanceMode }))
              }
              className={`h-6 w-12 rounded-full border-2 border-[#191A23] relative shrink-0 transition-colors ${
                settings.maintenanceMode ? "bg-red-300" : "bg-neutral-200"
              }`}
            >
              <div
                className={`absolute top-0.5 size-4 bg-[#191A23] rounded-full transition-all ${
                  settings.maintenanceMode ? "left-[26px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {settings.maintenanceMode && (
            <div className="space-y-1.5">
              <Label className="text-xs font-black uppercase text-[#191A23]">
                Maintenance Message
              </Label>
              <Input
                value={settings.maintenanceMessage}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, maintenanceMessage: e.target.value }))
                }
                className="border-2 border-[#191A23] rounded-sm h-11"
              />
            </div>
          )}

          <div className="flex items-center justify-between p-4 border-2 border-[#191A23]/10 rounded-sm">
            <div>
              <p className="text-sm font-black uppercase text-[#191A23]">
                Allow New Vendor Registrations
              </p>
              <p className="text-[10px] font-medium text-neutral-400 mt-0.5">
                Turn off to temporarily pause "Join as a Vendor" signups
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings((s) => ({
                  ...s,
                  allowNewVendorRegistrations: !s.allowNewVendorRegistrations,
                }))
              }
              className={`h-6 w-12 rounded-full border-2 border-[#191A23] relative shrink-0 transition-colors ${
                settings.allowNewVendorRegistrations ? "bg-[#B4F8C8]" : "bg-neutral-200"
              }`}
            >
              <div
                className={`absolute top-0.5 size-4 bg-[#191A23] rounded-full transition-all ${
                  settings.allowNewVendorRegistrations ? "left-[26px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-black uppercase text-[#191A23]">
              Support Email
            </Label>
            <Input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings((s) => ({ ...s, supportEmail: e.target.value }))}
              className="border-2 border-[#191A23] rounded-sm h-11"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="h-11 px-8 rounded-sm border-2 border-[#191A23] bg-[#191A23] text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(25,26,35,0.2)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            {saving ? "Saving…" : "Save Settings"}
          </Button>
        </div>
      )}
    </div>
  );
}
