"use client";

import { ReactNode } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

function InstructorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 text-gray-500 flex-shrink-0"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 text-gray-500 flex-shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function LessonsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 text-gray-500 flex-shrink-0"
    >
      <rect x="3" y="3" width="7" height="18" rx="1" />
      <rect x="14" y="3" width="7" height="10" rx="1" />
      <rect x="14" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

function EnrolledIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 text-gray-500 flex-shrink-0"
    >
      <circle cx="12" cy="8" r="3" />
      <path d="M20 21a8 8 0 1 0-16 0" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 text-gray-500 flex-shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

interface StatItem {
  label: string;
  value: string;
  icon: ReactNode;
}

// Mobile: single flat list. Desktop: pairs rendered as 2-col grid rows.
const statsFlat: StatItem[] = [
  { label: "Instructor:", value: "Edward Norton", icon: <InstructorIcon /> },
  { label: "Duration:", value: "3 weeks", icon: <ClockIcon /> },
  { label: "Lessons:", value: "8", icon: <LessonsIcon /> },
  { label: "Enrolled:", value: "65 students", icon: <EnrolledIcon /> },
  { label: "Language:", value: "English", icon: <GlobeIcon /> },
];

// Pair items for desktop 2-col layout
const statsDesktop: [StatItem, StatItem][] = [
  [statsFlat[1], statsFlat[1]], // Duration × 2
  [statsFlat[2], statsFlat[2]], // Lessons × 2
  [
    { ...statsFlat[3], value: "55 students" },
    { ...statsFlat[3], value: "65 students" },
  ],
  [statsFlat[4], statsFlat[4]], // Language × 2
];

function StatRow({
  stat,
  delay,
  isVisible,
}: {
  stat: StatItem;
  delay: number;
  isVisible: boolean;
}) {
  return (
    <div
      style={{ transitionDelay: `${delay}ms` }}
      className={`flex items-center justify-between px-5 py-3 border-b border-gray-200/90 last:border-0
                  transition-all duration-500 ease-out hover:bg-gray-50 cursor-default
                  ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
    >
      <div className="flex items-center gap-2">
        {stat.icon}
        <span className="text-sm text-gray-600">{stat.label}</span>
      </div>
      <span className="text-sm font-semibold text-gray-800">{stat.value}</span>
    </div>
  );
}

export default function CourseMaterials() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`mb-8 transition-all duration-700 ease-out delay-100 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Course Materials
      </h2>
      <div className="border border-gray-200/90 rounded-lg overflow-hidden">
        {/* ── Mobile: single column ── */}
        <div className="lg:hidden flex flex-col">
          {statsFlat.map((stat, i) => (
            <StatRow key={i} stat={stat} delay={i * 60} isVisible={isVisible} />
          ))}
        </div>

        {/* ── Desktop: two-column grid ── */}
        <div className="hidden lg:block">
          {statsDesktop.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`grid grid-cols-2 divide-x divide-gray-200 ${
                rowIndex < statsDesktop.length - 1
                  ? "border-b border-gray-200/90"
                  : ""
              }`}
            >
              {row.map((stat, colIndex) => (
                <div
                  key={colIndex}
                  style={{ transitionDelay: `${rowIndex * 80}ms` }}
                  className={`flex items-center justify-between gap-3 px-5 py-3
                              transition-all duration-500 ease-out hover:bg-gray-50 cursor-default
                              ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
                >
                  <div className="flex items-center gap-2">
                    {stat.icon}
                    <span className="text-sm text-gray-600">{stat.label}</span>
                  </div>
                  <span className="text-sm font-thina text-gray-900">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
