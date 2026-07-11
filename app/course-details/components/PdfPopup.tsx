"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// ─── Dummy files ──────────────────────────────────────────────────────────────

const PDF_FILES = [
  {
    id: 1,
    name: "Course Exercise Sheet",
    ext: "PDF",
    size: "2.4 MB",
    pages: 12,
    description: "Practical exercises covering all topics discussed in Week 1-4. Complete these before moving to the next section.",
    color: "bg-red-100 text-red-600",
    uploadedAt: "Oct 10, 2023",
  },
  {
    id: 2,
    name: "Reference Files Guide",
    ext: "PDF",
    size: "1.8 MB",
    pages: 8,
    description: "Comprehensive reference guide with syntax examples, cheat sheets, and best practices for the course material.",
    color: "bg-blue-100 text-blue-600",
    uploadedAt: "Oct 10, 2023",
  },
  {
    id: 3,
    name: "Code Snippets Pack",
    ext: "ZIP",
    size: "540 KB",
    pages: null,
    description: "A collection of starter code files and boilerplate templates used throughout the course exercises.",
    color: "bg-yellow-100 text-yellow-600",
    uploadedAt: "Oct 11, 2023",
  },
  {
    id: 4,
    name: "Project Brief",
    ext: "DOCX",
    size: "320 KB",
    pages: 4,
    description: "The final project requirements, grading rubric, and submission guidelines for this course.",
    color: "bg-indigo-100 text-indigo-600",
    uploadedAt: "Oct 12, 2023",
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PdfPopup({ open, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(PDF_FILES[0]);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center
                 bg-black/60 backdrop-blur-sm p-0 sm:p-6"
    >
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl
                      max-h-[92vh] flex flex-col animate-[slideUp_0.3s_ease-out]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
              <FolderIcon />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Course Exercise / Reference Files</h2>
              <p className="text-xs text-gray-400">{PDF_FILES.length} files available</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400
                       hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Body: list + detail ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* File list — full width on mobile (hidden when detail is open), sidebar on desktop */}
          <div className={`${mobileView === "detail" ? "hidden" : "flex"} sm:flex flex-col
                           w-full sm:w-56 border-r border-gray-100 overflow-y-auto flex-shrink-0`}>
            {PDF_FILES.map((file) => (
              <button
                key={file.id}
                onClick={() => { setSelected(file); setMobileView("detail"); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-50
                            transition-colors duration-150
                            ${selected.id === file.id
                              ? "bg-teal-50 border-l-2 border-l-teal-500"
                              : "hover:bg-gray-50 border-l-2 border-l-transparent"}`}
              >
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${file.color}`}>
                  {file.ext}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-800 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{file.size}</p>
                </div>
                {/* Chevron on mobile */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                  className="w-4 h-4 text-gray-300 sm:hidden flex-shrink-0">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ))}
          </div>

          {/* File detail — hidden on mobile until file selected, always visible on desktop */}
          <div className={`${mobileView === "list" ? "hidden" : "flex"} sm:flex
                           flex-1 overflow-y-auto p-5 flex-col gap-4`}>

            {/* Back button — mobile only */}
            <button
              onClick={() => setMobileView("list")}
              className="sm:hidden flex items-center gap-1.5 text-xs text-teal-600 font-medium -mb-1"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              All Files
            </button>

            {/* File icon + name */}
            <div className="flex items-center gap-4">
              <span className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black flex-shrink-0 ${selected.color}`}>
                {selected.ext}
              </span>
              <div>
                <h3 className="text-base font-bold text-gray-900">{selected.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Uploaded {selected.uploadedAt}</p>
              </div>
            </div>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">{selected.size}</span>
              {selected.pages && (
                <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">{selected.pages} pages</span>
              )}
              <span className="text-xs bg-teal-50 text-teal-600 border border-teal-200 rounded-full px-3 py-1">{selected.ext} file</span>
            </div>

            {/* Description */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">About this file</p>
              <p className="text-sm text-gray-700 leading-relaxed">{selected.description}</p>
            </div>

            {/* Preview placeholder */}
            <div className="flex-1 min-h-[100px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200
                            flex flex-col items-center justify-center gap-2 text-gray-400">
              <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black ${selected.color}`}>
                {selected.ext}
              </span>
              <p className="text-xs">Preview not available in demo</p>
            </div>

            {/* Download button */}
            <button
              className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600
                         text-white font-semibold text-sm py-3 rounded-xl transition-all duration-200
                         hover:scale-[1.02] active:scale-95 hover:shadow-lg hover:shadow-teal-200"
            >
              <DownloadIcon />
              Download {selected.name}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-teal-500">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
