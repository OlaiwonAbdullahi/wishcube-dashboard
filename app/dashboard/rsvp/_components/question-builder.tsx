"use client";

import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown, X } from "lucide-react";
import { RsvpCustomQuestion, RsvpQuestionType } from "@/lib/rsvp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TYPE_LABELS: Record<RsvpQuestionType, string> = {
  short_text: "Short answer",
  multiple_choice: "Multiple choice",
  yes_no: "Yes / No",
};

const newQuestion = (): RsvpCustomQuestion => ({
  id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `q_${Date.now()}_${Math.random().toString(36).slice(2)}`,
  type: "short_text",
  label: "",
  options: [],
  required: false,
});

interface QuestionBuilderProps {
  questions: RsvpCustomQuestion[];
  onChange: (questions: RsvpCustomQuestion[]) => void;
}

export function QuestionBuilder({ questions, onChange }: QuestionBuilderProps) {
  const updateQuestion = (id: string, patch: Partial<RsvpCustomQuestion>) => {
    onChange(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const removeQuestion = (id: string) => {
    onChange(questions.filter((q) => q.id !== id));
  };

  const moveQuestion = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= questions.length) return;
    const next = [...questions];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const addOption = (id: string) => {
    const q = questions.find((q) => q.id === id);
    if (!q) return;
    updateQuestion(id, { options: [...q.options, ""] });
  };

  const updateOption = (id: string, idx: number, value: string) => {
    const q = questions.find((q) => q.id === id);
    if (!q) return;
    const options = [...q.options];
    options[idx] = value;
    updateQuestion(id, { options });
  };

  const removeOption = (id: string, idx: number) => {
    const q = questions.find((q) => q.id === id);
    if (!q) return;
    updateQuestion(id, { options: q.options.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-3">
      {questions.length === 0 && (
        <p className="text-xs text-neutral-400 border-2 border-dashed border-[#191A23]/15 rounded-sm py-6 text-center">
          No custom questions yet. Add one to collect more than just a yes/no
          from your guests.
        </p>
      )}

      {questions.map((q, index) => (
        <div
          key={q.id}
          className="border-2 border-[#191A23] rounded-sm bg-white p-3 space-y-3 shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]"
        >
          <div className="flex items-start gap-2">
            <div className="flex flex-col items-center gap-0.5 pt-2 shrink-0 text-neutral-300">
              <button
                type="button"
                onClick={() => moveQuestion(index, -1)}
                disabled={index === 0}
                className="hover:text-[#191A23] disabled:opacity-30 disabled:hover:text-neutral-300"
              >
                <ChevronUp size={13} />
              </button>
              <GripVertical size={13} />
              <button
                type="button"
                onClick={() => moveQuestion(index, 1)}
                disabled={index === questions.length - 1}
                className="hover:text-[#191A23] disabled:opacity-30 disabled:hover:text-neutral-300"
              >
                <ChevronDown size={13} />
              </button>
            </div>

            <div className="flex-1 space-y-2 min-w-0">
              <input
                type="text"
                value={q.label}
                onChange={(e) => updateQuestion(q.id, { label: e.target.value })}
                placeholder="e.g. What's your dietary preference?"
                className="w-full px-3 py-2 border-2 border-[#191A23]/20 rounded-sm text-sm font-bold focus:outline-none focus:border-[#191A23] transition-colors"
              />

              <div className="flex items-center gap-2 flex-wrap">
                <Select
                  value={q.type}
                  onValueChange={(v) =>
                    updateQuestion(q.id, {
                      type: v as RsvpQuestionType,
                      options: v === "multiple_choice" ? q.options : [],
                    })
                  }
                >
                  <SelectTrigger className="h-8 w-40 text-[11px] border-2 border-[#191A23]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(TYPE_LABELS) as RsvpQuestionType[]).map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">
                        {TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <label className="flex items-center gap-1.5 text-[10px] font-black uppercase text-neutral-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={(e) => updateQuestion(q.id, { required: e.target.checked })}
                    className="size-3.5 accent-[#191A23]"
                  />
                  Required
                </label>
              </div>

              {q.type === "multiple_choice" && (
                <div className="space-y-1.5 pl-1">
                  {q.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="text-[10px] text-neutral-400 w-3">{idx + 1}.</span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(q.id, idx, e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 px-2 py-1.5 border border-[#191A23]/20 rounded-sm text-xs focus:outline-none focus:border-[#191A23]"
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(q.id, idx)}
                        className="text-neutral-300 hover:text-red-500 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(q.id)}
                    className="text-[10px] font-black uppercase text-[#9151FF] hover:text-[#9151FF]/70 flex items-center gap-1 pl-4"
                  >
                    <Plus size={11} /> Add option
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeQuestion(q.id)}
              className="text-neutral-300 hover:text-red-500 transition-colors shrink-0 mt-1.5"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...questions, newQuestion()])}
        className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-[#191A23]/30 rounded-sm text-[10px] font-black uppercase text-neutral-500 hover:border-[#191A23] hover:text-[#191A23] hover:bg-[#F9F9FB] transition-all"
      >
        <Plus size={13} />
        Add Question
      </button>
    </div>
  );
}
