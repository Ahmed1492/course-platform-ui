"use client";

import { RefObject, useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import AskQuestionPopup from "./AskQuestionPopup";
import LeaderboardPopup from "./LeaderboardPopup";
import CoursePlayer from "./CoursePlayer";

// ── SVG Icons ────────────────────────────────────────────────────────────────

function CurriculumIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <rect x="3" y="3" width="7" height="18" rx="1" />
      <rect x="14" y="3" width="7" height="10" rx="1" />
      <rect x="14" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}
function CommentsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function QuestionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function LeaderboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  curriculumRef?: RefObject<HTMLElement | null>;
  commentsRef?: RefObject<HTMLDivElement | null>;
  wide: boolean;
  onWideToggle: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CourseVideo({
  curriculumRef,
  commentsRef,
  wide,
  onWideToggle,
}: Props) {
  const { ref, isVisible } = useScrollReveal();
  const [askOpen, setAskOpen] = useState(false);
  const [leaderOpen, setLeaderOpen] = useState(false);

  return (
    <>
      <div
        ref={ref}
        className={`mb-4 transition-opacity duration-700 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* ── Player ── */}
        <div className="mb-4">
          <CoursePlayer wide={wide} onWideToggle={onWideToggle} />
        </div>

        {/* ── Desktop: social icons ── */}
        <div className="hidden lg:flex items-center gap-2">
          {[
            {
              label: "Facebook",
              d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
            },
            {
              label: "Twitter",
              d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
            },
            { label: "LinkedIn", custom: true },
            { label: "YouTube", yt: true },
          ].map(({ label, d, custom, yt }, index) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              style={{ transitionDelay: `${index * 60}ms` }}
              className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center
                          text-gray-500 hover:text-white hover:bg-teal-500 hover:border-teal-500
                          transition-all duration-300 hover:scale-110
                          ${isVisible ? "opacity-100" : "opacity-0"}`}
            >
              {yt ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon
                    points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
                    fill="white"
                  />
                </svg>
              ) : custom ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path d={d} />
                </svg>
              )}
            </a>
          ))}
        </div>

        {/* ── Mobile: 4-icon nav bar ── */}
        <div className="flex lg:hidden items-center justify-around border border-gray-200 rounded-xl py-2 bg-white shadow-sm">
          <button
            onClick={() =>
              curriculumRef?.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-gray-500 hover:text-teal-500 active:scale-95 transition-all duration-200 ${isVisible ? "opacity-100" : "opacity-0"}`}
          >
            <CurriculumIcon />
            <span className="text-[9px] sm:text-[10px] font-medium">Curriculum</span>
          </button>
          <button
            onClick={() =>
              commentsRef?.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-gray-500 hover:text-teal-500 active:scale-95 transition-all duration-200 ${isVisible ? "opacity-100" : "opacity-0"}`}
          >
            <CommentsIcon />
            <span className="text-[9px] sm:text-[10px] font-medium">Comments</span>
          </button>
          <button
            onClick={() => setAskOpen(true)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-gray-500 hover:text-teal-500 active:scale-95 transition-all duration-200 ${isVisible ? "opacity-100" : "opacity-0"}`}
          >
            <QuestionIcon />
            <span className="text-[9px] sm:text-[10px] font-medium">Ask Question</span>
          </button>
          <button
            onClick={() => setLeaderOpen(true)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-gray-500 hover:text-teal-500 active:scale-95 transition-all duration-200 ${isVisible ? "opacity-100" : "opacity-0"}`}
          >
            <LeaderboardIcon />
            <span className="text-[9px] sm:text-[10px] font-medium">Leaderboard</span>
          </button>
        </div>
      </div>

      {/* Popups */}
      <AskQuestionPopup open={askOpen} onClose={() => setAskOpen(false)} />
      <LeaderboardPopup
        open={leaderOpen}
        onClose={() => setLeaderOpen(false)}
        progress={63}
      />
    </>
  );
}
