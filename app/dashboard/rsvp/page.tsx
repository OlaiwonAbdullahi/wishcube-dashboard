"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Calendar03Icon,
  Location01Icon,
  Copy01Icon,
  UserGroupIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { Send } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  getRsvps,
  createRsvp,
  publishRsvp,
  Rsvp,
  RsvpCreateData,
} from "@/lib/rsvp";
import Form from "./_components/form";

const EMPTY_FORM: RsvpCreateData = {
  occasion: "Birthday",
  message: "",
  venueName: "",
  venueAddress: "",
  occasionDate: "",
  startTime: "",
  endTime: "",
  accentColor: "#9151FF",
};

const attendeeCounts = (rsvp: Rsvp) => {
  const attendees = rsvp.attendees || [];
  return {
    yes: attendees.filter((a) => a.response === "yes").length,
    no: attendees.filter((a) => a.response === "no").length,
    maybe: attendees.filter((a) => a.response === "maybe").length,
  };
};

const Page = () => {
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<RsvpCreateData>(EMPTY_FORM);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchRsvps();
  }, []);

  const fetchRsvps = async () => {
    setLoading(true);
    try {
      const res = await getRsvps();
      if (res.success && res.data) {
        setRsvps(res.data.rsvps);
      } else {
        toast.error(res.message || "Failed to load RSVP events");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.occasionDate) {
      toast.error("Please pick an event date");
      return;
    }
    setIsCreating(true);
    try {
      const res = await createRsvp(formData);
      if (res.success && res.data) {
        toast.success("RSVP event created! Publish it to start collecting responses.");
        setRsvps((prev) => [res.data!.rsvp, ...prev]);
        setIsCreateOpen(false);
        setFormData(EMPTY_FORM);
      } else {
        toast.error(res.message || "Failed to create RSVP event");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handlePublish = async (id: string) => {
    setPublishingId(id);
    try {
      const res = await publishRsvp(id);
      if (res.success && res.data) {
        toast.success("Published! Your RSVP link is live.");
        setRsvps((prev) => prev.map((r) => (r._id === id ? res.data!.rsvp : r)));
      } else {
        toast.error(res.message || "Failed to publish");
      }
    } finally {
      setPublishingId(null);
    }
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FAFAFA] to-[#F5F5F5] font-space px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">RSVP</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Create an event page and collect guest responses.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#191A23] text-white text-xs font-black uppercase rounded-sm border-b-4 border-black hover:-translate-y-1 active:border-b-0 active:translate-y-0 transition-all shadow-sm"
        >
          <HugeiconsIcon icon={Add01Icon} size={14} />
          New RSVP
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <HugeiconsIcon icon={Loading03Icon} size={24} className="animate-spin text-neutral-400" />
        </div>
      ) : rsvps.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center border-2 border-dashed border-neutral-200 rounded-sm bg-white">
          <HugeiconsIcon icon={Calendar03Icon} size={36} className="text-neutral-300" />
          <p className="text-sm font-bold uppercase text-neutral-400">No RSVP events yet</p>
          <p className="text-xs text-neutral-400 max-w-xs">
            Create your first event page and share the link with your guests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {rsvps.map((rsvp) => {
            const counts = attendeeCounts(rsvp);
            const totalGuests = counts.yes + counts.no + counts.maybe;
            const isExpanded = expandedId === rsvp._id;
            return (
              <div
                key={rsvp._id}
                className="bg-white border-2 border-[#191A23] rounded-sm shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] overflow-hidden"
              >
                <div
                  className="h-1.5"
                  style={{ background: rsvp.accentColor || "#9151FF" }}
                />
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-[#191A23]">{rsvp.occasion}</h3>
                      {rsvp.occasionDate && (
                        <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-1">
                          <HugeiconsIcon icon={Calendar03Icon} size={12} />
                          {new Date(rsvp.occasionDate).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                          {rsvp.startTime && ` · ${rsvp.startTime}`}
                        </p>
                      )}
                      {rsvp.venueName && (
                        <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
                          <HugeiconsIcon icon={Location01Icon} size={12} />
                          {rsvp.venueName}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-sm border text-[9px] font-black uppercase shrink-0 ${
                        rsvp.status === "live"
                          ? "bg-[#B4F8C8] border-[#191A23] text-[#191A23]"
                          : rsvp.status === "expired"
                            ? "bg-neutral-100 border-neutral-300 text-neutral-500"
                            : "bg-amber-50 border-amber-300 text-amber-700"
                      }`}
                    >
                      {rsvp.status}
                    </span>
                  </div>

                  {rsvp.status === "live" ? (
                    <>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : rsvp._id!)}
                        className="w-full flex items-center justify-between px-3 py-2 border border-[#191A23]/15 rounded-sm bg-[#F9F9FB] hover:bg-[#F3F3F3] transition-colors"
                      >
                        <span className="text-[11px] font-black uppercase text-neutral-600 flex items-center gap-1.5">
                          <HugeiconsIcon icon={UserGroupIcon} size={13} />
                          {totalGuests} response{totalGuests !== 1 ? "s" : ""}
                        </span>
                        <span className="text-[10px] font-bold text-neutral-400">
                          {counts.yes} yes · {counts.maybe} maybe · {counts.no} no
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="border border-[#191A23]/10 rounded-sm divide-y divide-[#191A23]/5 max-h-48 overflow-y-auto">
                          {(rsvp.attendees || []).length === 0 ? (
                            <p className="text-xs text-neutral-400 text-center py-4">
                              No responses yet
                            </p>
                          ) : (
                            rsvp.attendees!.map((a, i) => (
                              <div key={i} className="px-3 py-2 flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-[#191A23] truncate">{a.name}</p>
                                  <p className="text-[10px] text-neutral-400 truncate">{a.email}</p>
                                </div>
                                <span
                                  className={`text-[9px] font-black uppercase shrink-0 ${
                                    a.response === "yes"
                                      ? "text-green-600"
                                      : a.response === "no"
                                        ? "text-red-500"
                                        : "text-amber-600"
                                  }`}
                                >
                                  {a.response}
                                  {a.plusOnes > 0 ? ` +${a.plusOnes}` : ""}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => copyLink(rsvp.publicUrl || "")}
                        className="w-full flex items-center justify-center gap-2 py-2 border-2 border-[#191A23] rounded-sm text-[10px] font-black uppercase hover:bg-[#F3F3F3] transition-colors"
                      >
                        <HugeiconsIcon icon={Copy01Icon} size={12} />
                        Copy Guest Link
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handlePublish(rsvp._id)}
                      disabled={publishingId === rsvp._id}
                      className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-[#191A23] rounded-sm bg-[#191A23] text-white text-[10px] font-black uppercase hover:bg-[#191A23]/90 disabled:opacity-50 transition-colors"
                    >
                      {publishingId === rsvp._id ? (
                        <HugeiconsIcon icon={Loading03Icon} size={12} className="animate-spin" />
                      ) : (
                        <Send size={12} />
                      )}
                      {publishingId === rsvp._id ? "Publishing…" : "Publish & Get Link"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New RSVP Event</DialogTitle>
          </DialogHeader>
          <Form data={formData} onChange={setFormData} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button disabled={isCreating} onClick={handleCreate}>
              {isCreating ? "Creating…" : "Create Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
