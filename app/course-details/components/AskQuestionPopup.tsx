"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const SESSION_KEY = "ask_question_draft";

interface Reply {
  id: number;
  name: string;
  date: string;
  avatar: string;
  text: string;
}

const dummyReplies: Reply[] = [
  {
    id: 1,
    name: "Instructor Ahmed",
    date: "Oct 12, 2023",
    avatar: "https://i.pravatar.cc/40?img=7",
    text: "Great question! The answer depends on the scope of your variable. Make sure you're declaring it outside the loop.",
  },
  {
    id: 2,
    name: "Student Name",
    date: "Oct 13, 2023",
    avatar: "https://i.pravatar.cc/40?img=5",
    text: "I had the same issue. Check the documentation for more details on variable scoping.",
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AskQuestionPopup({ open, onClose }: Props) {
  // Lazy initializer — reads sessionStorage once on mount, no effect needed
  const [draft, setDraft] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem(SESSION_KEY) ?? "";
  });
  const [submitted, setSubmitted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Persist draft to sessionStorage on every change
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, draft);
  }, [draft]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setSubmitted(true);
    setDraft("");
    sessionStorage.removeItem(SESSION_KEY);
    setTimeout(() => setSubmitted(false), 3000);
  }

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl
                      max-h-[90vh] flex flex-col animate-[slideUp_0.3s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
              <QuestionIcon />
            </span>
            <h2 className="text-base font-semibold text-gray-800">Ask a Question</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400
                       hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Previous replies */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {dummyReplies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image src={reply.avatar} alt={reply.name} fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{reply.name}</p>
                <p className="text-xs text-gray-400 mb-1">{reply.date}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{reply.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Question form */}
        <div className="px-5 pb-5 pt-2 border-t border-gray-100">
          {submitted && (
            <p className="text-sm text-teal-600 font-medium mb-3 text-center">
              ✓ Your question has been submitted!
            </p>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write your question here..."
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700
                         placeholder-gray-400 resize-none focus:outline-none focus:ring-2
                         focus:ring-teal-400 focus:border-transparent transition-all hover:border-gray-300"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600
                         text-white text-sm font-medium px-6 py-3 rounded-lg
                         transition-all duration-300 hover:scale-105 active:scale-95
                         hover:shadow-lg hover:shadow-teal-200"
            >
              Submit Question →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function QuestionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-teal-500">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
