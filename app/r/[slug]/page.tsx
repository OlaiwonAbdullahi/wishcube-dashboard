"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Location01Icon,
  Loading03Icon,
  Tick02Icon,
  AlertCircleIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { getLiveRsvp, submitRsvpResponse, Rsvp } from "@/lib/rsvp";

type RsvpResponseChoice = "yes" | "no" | "maybe";

export default function PublicRsvpPage() {
  const { slug } = useParams();
  const [rsvp, setRsvp] = useState<Rsvp | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [response, setResponse] = useState<RsvpResponseChoice>("yes");
  const [plusOnes, setPlusOnes] = useState(0);
  const [message, setMessage] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchRsvp = async () => {
      setLoading(true);
      try {
        const res = await getLiveRsvp(slug as string);
        if (res.success && res.data) {
          setRsvp(res.data.rsvp);
        } else {
          setErrorStatus(res.httpStatus || 404);
        }
      } catch {
        setErrorStatus(500);
      } finally {
        setLoading(false);
      }
    };
    fetchRsvp();
  }, [slug]);

  const questions = rsvp?.customQuestions || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter your name and email");
      return;
    }
    for (const q of questions) {
      if (q.required && !answers[q.id]?.trim()) {
        toast.error(`Please answer: ${q.label}`);
        return;
      }
    }
    setSubmitting(true);
    try {
      const res = await submitRsvpResponse(slug as string, {
        name: name.trim(),
        email: email.trim(),
        response,
        plusOnes,
        message: message.trim(),
        answers: questions.map((q) => ({ questionId: q.id, value: answers[q.id] || "" })),
      });
      if (res.success) {
        setSubmitted(true);
        toast.success("Your RSVP has been recorded!");
      } else {
        toast.error(res.message || "Failed to submit your response");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const accent = rsvp?.accentColor || "#9151FF";
  const headcount =
    rsvp?.attendees
      ?.filter((a) => a.response === "yes")
      .reduce((sum, a) => sum + 1 + (a.plusOnes || 0), 0) || 0;
  const isFull = !!rsvp?.capacity && headcount >= rsvp.capacity;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <HugeiconsIcon icon={Loading03Icon} size={28} className="animate-spin text-neutral-400" />
      </div>
    );
  }

  if (errorStatus || !rsvp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
        <div className="text-center space-y-3">
          <HugeiconsIcon icon={AlertCircleIcon} size={40} className="text-neutral-300 mx-auto" />
          <h1 className="text-xl font-bold text-slate-800">
            {errorStatus === 410 ? "This event has passed" : "Page not found"}
          </h1>
          <p className="text-sm text-neutral-500">
            {errorStatus === 410
              ? "This RSVP link is no longer active."
              : "This RSVP link doesn't exist or has been removed."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {rsvp.coverImage?.url ? (
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={rsvp.coverImage.url}
            alt={rsvp.title || rsvp.occasion}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${accent}22 0%, rgba(0,0,0,0.65) 100%)`,
            }}
          />
          <div className="absolute inset-x-0 bottom-0 max-w-lg mx-auto px-6 pb-8 text-center space-y-2">
            <span
              className="inline-block text-white/90 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ background: `${accent}cc` }}
            >
              {rsvp.occasion}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-sm">
              {rsvp.title || rsvp.occasion}
            </h1>
          </div>
        </div>
      ) : (
        <div
          className="relative overflow-hidden text-white"
          style={{ background: `linear-gradient(135deg, ${accent}ee 0%, ${accent}bb 100%)` }}
        >
          <div className="max-w-lg mx-auto px-6 pt-12 pb-16 text-center space-y-3">
            <p className="text-white/70 text-sm font-medium">You&apos;re invited to a</p>
            <h1 className="text-4xl font-bold">{rsvp.title || rsvp.occasion}</h1>
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto px-4 pb-16 -mt-8 space-y-5">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-3">
          {rsvp.message && (
            <p className="text-sm text-slate-600 leading-relaxed pb-1">{rsvp.message}</p>
          )}
          {rsvp.occasionDate && (
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={Calendar03Icon} size={16} color={accent} />
              <p className="text-sm text-slate-700">
                {new Date(rsvp.occasionDate).toLocaleDateString("en-NG", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {rsvp.startTime && ` · ${rsvp.startTime}${rsvp.endTime ? ` – ${rsvp.endTime}` : ""}`}
              </p>
            </div>
          )}
          {rsvp.venueName && (
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={Location01Icon} size={16} color={accent} />
              <p className="text-sm text-slate-700">
                {rsvp.venueName}
                {rsvp.venueAddress && `, ${rsvp.venueAddress}`}
              </p>
            </div>
          )}
          {!!rsvp.capacity && (
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={UserGroupIcon} size={16} color={accent} />
              <p className="text-sm text-slate-700">
                {headcount} of {rsvp.capacity} spots filled
                {isFull && <span className="text-red-500 font-semibold"> · Full</span>}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div
                className="size-12 mx-auto rounded-full flex items-center justify-center"
                style={{ background: accent + "20" }}
              >
                <HugeiconsIcon icon={Tick02Icon} size={22} color={accent} />
              </div>
              <h3 className="text-base font-bold text-slate-800">You&apos;re all set!</h3>
              <p className="text-sm text-slate-500">
                Thanks for letting us know, {name.split(" ")[0]}. See you there!
              </p>
            </div>
          ) : isFull && response !== "no" ? (
            <div className="text-center py-6 space-y-3">
              <h3 className="text-base font-bold text-slate-800">This event is full</h3>
              <p className="text-sm text-slate-500">
                All spots have been claimed, but you can still let the host know you can&apos;t make it.
              </p>
              <button
                onClick={() => setResponse("no")}
                className="text-sm font-semibold underline"
                style={{ color: accent }}
              >
                Respond anyway
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-base font-bold text-slate-800">Will you be attending?</h3>

              <div className="grid grid-cols-3 gap-2">
                {(["yes", "maybe", "no"] as RsvpResponseChoice[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    disabled={option !== "no" && isFull}
                    onClick={() => setResponse(option)}
                    className="py-2.5 rounded-xl text-xs font-bold uppercase border-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style={
                      response === option
                        ? { background: accent, borderColor: accent, color: "white" }
                        : { borderColor: "#e2e8f0", color: "#64748b" }
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 text-sm"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 text-sm"
                />
                {response !== "no" && (
                  <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200">
                    <label className="text-sm text-slate-600">Bringing guests?</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={plusOnes}
                      onChange={(e) => setPlusOnes(Number(e.target.value))}
                      className="w-16 text-right text-sm font-bold focus:outline-none"
                    />
                  </div>
                )}

                {questions.length > 0 && (
                  <div className="space-y-3 pt-1">
                    {questions.map((q) => (
                      <div key={q.id} className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">
                          {q.label}
                          {q.required && <span className="text-red-500"> *</span>}
                        </label>
                        {q.type === "short_text" && (
                          <input
                            type="text"
                            required={q.required}
                            value={answers[q.id] || ""}
                            onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 text-sm"
                          />
                        )}
                        {q.type === "yes_no" && (
                          <div className="grid grid-cols-2 gap-2">
                            {["Yes", "No"].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                                className="py-2 rounded-xl text-xs font-bold border-2 transition-all"
                                style={
                                  answers[q.id] === opt
                                    ? { background: accent, borderColor: accent, color: "white" }
                                    : { borderColor: "#e2e8f0", color: "#64748b" }
                                }
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                        {q.type === "multiple_choice" && (
                          <div className="space-y-1.5">
                            {q.options.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                                className="w-full text-left px-4 py-2.5 rounded-xl text-sm border-2 transition-all"
                                style={
                                  answers[q.id] === opt
                                    ? { background: accent + "15", borderColor: accent, color: accent }
                                    : { borderColor: "#e2e8f0", color: "#334155" }
                                }
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave a message for the host (optional)"
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: accent }}
              >
                {submitting ? "Submitting…" : "Send RSVP"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
