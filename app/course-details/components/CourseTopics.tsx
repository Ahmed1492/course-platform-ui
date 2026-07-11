"use client";

import Image from "next/image";
import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import ExamPopup from "./ExamPopup";
import PdfPopup from "./PdfPopup";

function FileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-3 h-3 text-[#818884] flex-shrink-0 mt-0.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

interface Lesson {
  title: string;
  badge?: { questions: string; minutes: string };
  locked?: boolean;
  isPdf?: boolean;
}

interface WeekSection {
  week: string;
  description: string;
  lessons: Lesson[];
}

const sections: WeekSection[] = [
  {
    week: "Week 1-4",
    description:
      "Advanced story telling techniques for writers: Personas, Characters & Plots",
    lessons: [
      { title: "Introduction" },
      { title: "Course Overview" },
      {
        title: "Course Overview",
        badge: { questions: "0 QUESTION", minutes: "10 MINUTES" },
      },
      { title: "Course Exercise / Reference Files", isPdf: true },
      {
        title: "Code Editor Installation (Optional if you have one)",
        locked: true,
      },
      { title: "Embedding PHP in HTML", locked: true },
    ],
  },
  {
    week: "Week 5-8",
    description:
      "Advanced story telling techniques for writers: Personas, Characters & Plots",
    lessons: [
      { title: "Defining Functions" },
      { title: "Function Parameters" },
      {
        title: "Return Values from Functions",
        badge: { questions: "2 QUESTION", minutes: "15 MINUTES" },
      },
      { title: "Global Variable and Scope" },
      { title: "Newer Way of creating a Constant" },
      { title: "Constants", locked: true },
    ],
  },
  {
    week: "Week 9-12",
    description:
      "Advanced story telling techniques for writers: Personas, Characters & Plots",
    lessons: [
      { title: "Defining Functions" },
      { title: "Function Parameters" },
      {
        title: "Return Values from Functions",
        badge: { questions: "2 QUESTION", minutes: "15 MINUTES" },
      },
      { title: "Global Variable and Scope" },
      { title: "Newer Way of creating a Constant" },
      { title: "Constants", locked: true },
    ],
  },
];

const PROGRESS = 63;

export default function CourseTopics({
  setIsExamMode,
  isExamMode,
}: {
  setIsExamMode: (value: boolean) => void;
  isExamMode: boolean;
}) {
  const { ref, isVisible } = useScrollReveal();

  // first section open by default, rest closed
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    0: true,
  });
  const [examOpen, setExamOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<{
    id: string;
    title: string;
    minutes: number;
  } | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);

  function toggleSection(index: number) {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  function openExam(lesson: Lesson, sectionIndex: number, lessonIndex: number) {
    if (!lesson.badge) return;
    if (isExamMode) return;
    const minutes = parseInt(lesson.badge.minutes) || 10;
    setSelectedExam({
      id: `exam_${sectionIndex}_${lessonIndex}`,
      title: lesson.title,
      minutes,
    });
    setExamOpen(true);
    setIsExamMode(true);
  }

  return (
    <aside
      ref={ref}
      className={`w-full transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
      }`}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-5">
        Topics for This Course
      </h2>

      {/* Progress Bar */}
      <div className="mb-10">
        {/* Student avatar + level */}

        {/* Bar with "You" label above thumb */}
        <div className="relative pt-6">
          <div
            className="absolute -top-5 flex flex-col items-center transition-all duration-1000 ease-out"
            style={{
              left: isVisible ? `${PROGRESS}%` : "0%",
              transform: "translateX(-50%)",
            }}
          >
            {/* Top: You pill */}
            <span className="text-xs border-2 border-gray-300 rounded-full p-2 bg-white text-gray-600 shadow-sm whitespace-nowrap">
              You
            </span>

            {/* Arrow */}
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-gray-300 mt-0.5" />
          </div>
          <div
            className="absolute top-6 flex flex-col items-center transition-all duration-1000 ease-out"
            style={{
              left: isVisible ? `${PROGRESS}%` : "0%",
              transform: "translateX(-50%)",
            }}
          >
            {/* Bottom: Percentage */}
            <span className="text-sm  text-slate-600 mt-2">{PROGRESS}%</span>
          </div>

          {/* Track */}
          <div className="relative h-[5px] bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-[5px] bg-[#6ABD8A] rounded-full transition-all duration-1000 ease-out"
              style={{ width: isVisible ? `${PROGRESS}%` : "0%" }}
            />
          </div>
        </div>
      </div>

      {/* Collapsible Week Sections */}
      <div className="flex flex-col gap-3">
        {sections.map((section, sectionIndex) => {
          const isOpen = !!openSections[sectionIndex];

          return (
            <div
              key={sectionIndex}
              style={{ transitionDelay: `${sectionIndex * 120}ms` }}
              className={`border border-[#E5E5E5] rounded-sm overflow-hidden pt-4
                          transition-all duration-500 ease-out hover:border-gray-300 hover:shadow-sm
                          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              {/* Clickable header */}
              <button
                onClick={() => toggleSection(sectionIndex)}
                className="w-full flex items-start justify-between gap-2 px-3 py-3 text-left
                           hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-800 mb-0.5">
                    {section.week}
                  </p>
                  <p className="text-xs text-[#878285] leading-snug">
                    {section.description}
                  </p>
                </div>
                <ChevronIcon open={isOpen} />
              </button>

              {/* Animated lesson list */}
              <div
                className={`transition-all duration-400 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <ul className="flex flex-col px-3 pb-2">
                  {section.lessons.map((lesson, lessonIndex) => (
                    <li
                      key={lessonIndex}
                      onClick={() => {
                        if (lesson.isPdf) {
                          setPdfOpen(true);
                          return;
                        }
                        openExam(lesson, sectionIndex, lessonIndex);
                        }}
                        className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 py-2
                                  border-b border-gray-200/90 last:border-0
                                  transition-all duration-200 rounded px-1
                                  hover:bg-gray-50 cursor-pointer group
                                  ${lesson.badge ? "hover:bg-indigo-50 hover:border-indigo-100" : ""}`}
                      >
                        <span className="transition-transform duration-300 group-hover:scale-110">
                        <FileIcon />
                      </span>

                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-xs leading-snug transition-colors duration-200 ${
                            lesson.badge
                              ? "text-gray-700 group-hover:text-indigo-600 font-medium"
                              : "text-gray-700 group-hover:text-teal-600"
                          }`}
                        >
                          {lesson.title}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-end gap-1 flex-shrink-0">
                        {lesson.badge ? (
                          <>
                            <span className="text-[9px] sm:text-[10px] font-semibold text-green-300 bg-[#F2FAF8]   rounded px-1.5 py-0.5 whitespace-nowrap">
                              {lesson.badge.questions}
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-semibold text-red-300 bg-[#FDF2F4]   rounded px-1.5 py-0.5 whitespace-nowrap">
                              {lesson.badge.minutes}
                            </span>
                          </>
                        ) : (
                          <span className="transition-transform duration-300 group-hover:scale-110">
                            <LockIcon />
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* PDF Popup */}
      <PdfPopup open={pdfOpen} onClose={() => setPdfOpen(false)} />

      {/* Exam Popup */}
      {selectedExam && (
        <ExamPopup
          open={examOpen}
          onClose={() => {
            setExamOpen(false);
            setIsExamMode(false);
          }}
          examId={selectedExam.id}
          examTitle={selectedExam.title}
          totalMinutes={selectedExam.minutes}
        />
      )}
    </aside>
  );
}
