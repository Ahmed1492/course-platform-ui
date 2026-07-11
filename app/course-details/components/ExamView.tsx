"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ─── Questions ───────────────────────────────────────────────────────────────

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
    correct: 0,
  },
  {
    id: 2,
    text: "Which tag is used to define an internal style sheet?",
    options: ["<css>", "<script>", "<style>", "<link>"],
    correct: 2,
  },
  {
    id: 3,
    text: "What is the correct syntax for referring to an external script?",
    options: ['<script href="app.js">', '<script name="app.js">', '<script src="app.js">', '<script file="app.js">'],
    correct: 2,
  },
  {
    id: 4,
    text: "Which CSS property controls the text size?",
    options: ["text-size", "font-size", "text-style", "font-style"],
    correct: 1,
  },
  {
    id: 5,
    text: "How do you insert a comment in a JavaScript file?",
    options: ["<!-- comment -->", "// comment", "** comment **", "## comment"],
    correct: 1,
  },
];

// ─── sessionStorage helpers ───────────────────────────────────────────────────

interface ExamProgress {
  answers: Record<number, number | null>;
  currentQuestion: number;
  timeLeft: number;
}

function loadProgress(examId: string, totalSeconds: number): ExamProgress {
  try {
    const raw = sessionStorage.getItem(`exam_progress_${examId}`);
    if (raw) return JSON.parse(raw) as ExamProgress;
  } catch { /* ignore */ }
  return { answers: {}, currentQuestion: 0, timeLeft: totalSeconds };
}

function saveProgress(examId: string, p: ExamProgress) {
  try { sessionStorage.setItem(`exam_progress_${examId}`, JSON.stringify(p)); } catch { /* ignore */ }
}

function clearProgress(examId: string) {
  try { sessionStorage.removeItem(`exam_progress_${examId}`); } catch { /* ignore */ }
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ExamMeta {
  id: string;
  title: string;
  totalMinutes: number;
}

interface Props {
  exam: ExamMeta;
  onExit: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExamView({ exam, onExit }: Props) {
  const totalSeconds = exam.totalMinutes * 60;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [progress, setProgress] = useState<ExamProgress>(() =>
    loadProgress(exam.id, totalSeconds)
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Persist on every change
  useEffect(() => {
    if (!submitted) saveProgress(exam.id, progress);
  }, [progress, submitted, exam.id]);

  const handleSubmit = useCallback((prog?: ExamProgress) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const p = prog ?? progress;
    const correct = QUESTIONS.filter((q, i) => p.answers[i] === q.correct).length;
    setScore(correct);
    setSubmitted(true);
    clearProgress(exam.id);
  }, [progress, exam.id]);

  // Countdown timer
  useEffect(() => {
    if (submitted) return;
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = { ...prev, timeLeft: Math.max(0, prev.timeLeft - 1) };
        if (next.timeLeft === 0) handleSubmit(next);
        return next;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [submitted, handleSubmit]);

  function selectOption(optionIndex: number) {
    if (submitted) return;
    setProgress((prev) => ({
      ...prev,
      answers: { ...prev.answers, [prev.currentQuestion]: optionIndex },
    }));
  }

  function goTo(index: number) {
    setProgress((prev) => ({ ...prev, currentQuestion: index }));
  }

  function handleExit() {
    if (!submitted) saveProgress(exam.id, progress);
    onExit();
  }

  const { currentQuestion, answers, timeLeft } = progress;
  const q = QUESTIONS[currentQuestion];
  const answeredCount = Object.keys(answers).filter(k => answers[+k] !== null).length;
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="w-full min-h-[500px] bg-[#5B5EA6] rounded-2xl flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <button
          onClick={handleExit}
          aria-label="Back to course"
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center
                     text-white hover:bg-white/30 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {!submitted && (
          <div className={`flex items-center gap-1.5 bg-white rounded-full px-4 py-1.5 shadow
                           ${timeLeft < 60 ? "text-red-500" : "text-gray-700"}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-sm font-semibold tabular-nums">{mins}:{secs}</span>
          </div>
        )}

        <div className="w-8" />
      </div>

      {/* ── Question navigator ── */}
      {!submitted && (
        <div className="flex items-center justify-center gap-2 px-4 pb-4 flex-wrap">
          {QUESTIONS.map((_, i) => {
            const isActive   = i === currentQuestion;
            const isAnswered = answers[i] !== undefined && answers[i] !== null;
            return (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-9 h-9 rounded-full text-sm font-bold transition-all duration-200
                  ${isActive
                    ? "bg-yellow-400 text-gray-900 scale-110 shadow"
                    : isAnswered
                      ? "bg-white/80 text-indigo-700"
                      : "bg-white/30 text-white"}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Content ── */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        {submitted ? (
          /* Results */
          <div className="flex flex-col items-center justify-center py-8 gap-4 text-white">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl">
              {score >= QUESTIONS.length * 0.6 ? "🎉" : "📖"}
            </div>
            <h3 className="text-2xl font-bold">
              {score >= QUESTIONS.length * 0.6 ? "Well done!" : "Keep studying!"}
            </h3>
            <p className="text-white/80 text-center text-sm">
              You answered <span className="font-bold text-yellow-300">{score}</span> out of{" "}
              <span className="font-bold">{QUESTIONS.length}</span> correctly.
            </p>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="h-3 bg-yellow-400 rounded-full transition-all duration-1000"
                style={{ width: `${(score / QUESTIONS.length) * 100}%` }}
              />
            </div>
            <p className="text-sm text-white/60">{Math.round((score / QUESTIONS.length) * 100)}% score</p>
            <button
              onClick={handleExit}
              className="mt-2 bg-white text-indigo-700 font-semibold px-8 py-3 rounded-full
                         hover:bg-yellow-300 hover:text-gray-900 transition-all duration-200"
            >
              Back to Course
            </button>
          </div>
        ) : (
          /* Question card */
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <p className="text-indigo-600 font-bold mb-2">{currentQuestion + 1}.</p>
            <p className="text-gray-900 font-semibold text-base leading-snug mb-5">{q.text}</p>
            <div className="flex flex-col gap-3">
              {q.options.map((opt, i) => {
                const chosen = answers[currentQuestion] === i;
                return (
                  <button
                    key={i}
                    onClick={() => selectOption(i)}
                    className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl border-2
                                transition-all duration-150
                                ${chosen
                                  ? "border-indigo-500 bg-indigo-50"
                                  : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50"}`}
                  >
                    <span className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center
                                      transition-colors duration-150
                                      ${chosen ? "border-indigo-500 bg-indigo-500" : "border-gray-300"}`}>
                      {chosen && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-3 h-3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span className="text-sm text-gray-700">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      {!submitted && (
        <div className="px-4 pb-5">
          <div className="flex gap-3 mb-3">
            <button
              onClick={() => goTo(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="flex-1 py-3 rounded-xl bg-white/20 text-white font-semibold text-sm
                         hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {currentQuestion < QUESTIONS.length - 1 ? (
              <button
                onClick={() => goTo(currentQuestion + 1)}
                className="flex-1 py-3 rounded-xl bg-indigo-400 text-white font-semibold text-sm
                           hover:bg-indigo-300 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => handleSubmit()}
                className="flex-1 py-3 rounded-xl bg-yellow-400 text-gray-900 font-semibold text-sm
                           hover:bg-yellow-300 transition-colors"
              >
                Submit
              </button>
            )}
          </div>
          <div className="flex items-center justify-between text-white/70 text-xs px-1">
            <span>{answeredCount}/{QUESTIONS.length} answered</span>
            <span className="font-medium text-white/90 truncate ml-2">{exam.title}</span>
          </div>
        </div>
      )}
    </div>
  );
}
