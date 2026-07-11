"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface LeaderEntry {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  badges: number;
  isCurrentUser?: boolean;
}

const leaderboardData: LeaderEntry[] = [
  { rank: 1, name: "Ahmed Hassan",   avatar: "https://i.pravatar.cc/40?img=11", points: 4850, badges: 12 },
  { rank: 2, name: "Sara Mohamed",   avatar: "https://i.pravatar.cc/40?img=5",  points: 4200, badges: 10 },
  { rank: 3, name: "Omar Khalil",    avatar: "https://i.pravatar.cc/40?img=8",  points: 3975, badges: 9  },
  { rank: 4, name: "Nour Ali",       avatar: "https://i.pravatar.cc/40?img=9",  points: 3640, badges: 8  },
  { rank: 5, name: "You",            avatar: "https://i.pravatar.cc/40?img=12", points: 3200, badges: 7, isCurrentUser: true },
  { rank: 6, name: "Layla Ibrahim",  avatar: "https://i.pravatar.cc/40?img=6",  points: 2980, badges: 6  },
  { rank: 7, name: "Youssef Tarek",  avatar: "https://i.pravatar.cc/40?img=3",  points: 2750, badges: 5  },
  { rank: 8, name: "Hana Samir",     avatar: "https://i.pravatar.cc/40?img=2",  points: 2400, badges: 4  },
];

const rankColors: Record<number, string> = {
  1: "text-yellow-500",
  2: "text-gray-400",
  3: "text-orange-400",
};

const rankBg: Record<number, string> = {
  1: "bg-yellow-50 border-yellow-200",
  2: "bg-gray-50 border-gray-200",
  3: "bg-orange-50 border-orange-200",
};

// ─── م.علي شاهين messages by level ──────────────────────────────────────────

const COACH_MESSAGES: { maxProgress: number; message: string }[] = [
  {
    maxProgress: 20,
    message: "يسطا انت لسه بالأول.. ما اتسجلتش عشان تتفرج، قوم ذاكر! 😅",
  },
  {
    maxProgress: 40,
    message: "تمام بقى الأول.. بس لو وقفت هنا هتضيع اللي عملته، كمّل! 💪",
  },
  {
    maxProgress: 60,
    message: "عظيم يا صديقي، أنت في الكورس ده أحسن من ٦١٪ من باقي الطلبة.. كمّل عايز أشوف اسمك في الليدربورد هنا 💪",
  },
  {
    maxProgress: 80,
    message: "والله بتتحسن! ٨٠٪ خلاص.. اللي بيوصل للآخر بيتغير فعلاً، متوقفش! 🔥",
  },
  {
    maxProgress: 99,
    message: "أنت كده قريب جداً من الآخر.. لو وقفت دلوقتي هتندم، خطوة وخلاص! ⭐",
  },
  {
    maxProgress: 100,
    message: "ماشاء الله! أنت خلصت الكورس، ده مش هيتنسى.. برافو عليك بجد! 🏆",
  },
];

function getCoachMessage(progress: number): string {
  return (
    COACHES_MESSAGES.find((m) => progress <= m.maxProgress)?.message ??
    COACH_MESSAGES[COACH_MESSAGES.length - 1].message
  );
}

// ─── fix typo in helper ───────────────────────────────────────────────────────
// (alias to avoid the typo above propagating)
const COACHES_MESSAGES = COACH_MESSAGES;

interface Props {
  open: boolean;
  onClose: () => void;
  progress?: number;
}

export default function LeaderboardPopup({ open, onClose, progress = 63 }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const top3 = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

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
            <span className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
              <TrophyIcon />
            </span>
            <h2 className="text-base font-semibold text-gray-800">Leaderboard</h2>
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

        {/* م.علي شاهين motivational message */}
        <div className="mx-5 mt-3 mb-1 bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3">
          <p className="text-xs font-bold text-indigo-500 mb-1.5 text-left">م. علي شاهين</p>
          <p
            className="text-sm text-gray-700 leading-relaxed"
            dir="rtl"
            lang="ar"
          >
            {getCoachMessage(progress)}
          </p>
        </div>

        {/* Top 3 podium */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-end justify-center gap-3">
            {/* 2nd */}
            <PodiumCard entry={top3[1]} height="h-20" />
            {/* 1st */}
            <PodiumCard entry={top3[0]} height="h-28" crown />
            {/* 3rd */}
            <PodiumCard entry={top3[2]} height="h-16" />
          </div>
        </div>

        {/* Rest of the list */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 flex flex-col gap-2 pt-3">
          {rest.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors
                          ${entry.isCurrentUser
                            ? "bg-teal-50 border-teal-200"
                            : "bg-white border-gray-100 hover:bg-gray-50"}`}
            >
              <span className="w-6 text-center text-sm font-bold text-gray-400">
                {entry.rank}
              </span>
              <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                <Image src={entry.avatar} alt={entry.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${entry.isCurrentUser ? "text-teal-700" : "text-gray-800"}`}>
                  {entry.name} {entry.isCurrentUser && <span className="text-xs font-normal">(You)</span>}
                </p>
                <p className="text-xs text-gray-400">{entry.badges} badges</p>
              </div>
              <span className={`text-sm font-bold ${entry.isCurrentUser ? "text-teal-600" : "text-gray-700"}`}>
                {entry.points.toLocaleString()} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PodiumCard({ entry, height, crown = false }: {
  entry: LeaderEntry;
  height: string;
  crown?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      {crown && (
        <span className="text-xl mb-0.5">👑</span>
      )}
      <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md">
        <Image src={entry.avatar} alt={entry.name} fill className="object-cover" />
      </div>
      <p className="text-xs font-semibold text-gray-700 text-center leading-tight">{entry.name}</p>
      <p className="text-xs text-gray-400">{entry.points.toLocaleString()}</p>
      <div
        className={`w-full ${height} ${rankBg[entry.rank] ?? "bg-gray-50 border-gray-200"}
                    border rounded-t-lg flex items-center justify-center`}
      >
        <span className={`text-xl font-black ${rankColors[entry.rank] ?? "text-gray-400"}`}>
          {entry.rank}
        </span>
      </div>
    </div>
  );
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-yellow-500">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
  );
}
