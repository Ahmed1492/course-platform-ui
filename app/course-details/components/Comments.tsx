"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface Comment {
  id: number;
  name: string;
  date: string;
  text: string;
  avatar: string;
}

const initialComments: Comment[] = [
  {
    id: 1,
    name: "Student Name Goes Here",
    date: "Oct 10, 2023",
    avatar:
      "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    name: "Student Name Goes Here",
    date: "Oct 10, 2023",
    avatar:
      "https://images.pexels.com/photos/6593577/pexels-photo-6593577.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 3,
    name: "Student Name Goes Here",
    date: "Oct 10, 2023",
    avatar:
      "https://images.pexels.com/photos/3777952/pexels-photo-3777952.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 4,
    name: "Ahmed Hassan",
    date: "Oct 11, 2023",
    avatar: "https://i.pravatar.cc/80?img=11",
    text: "Really helpful course! The examples are clear and easy to follow along.",
  },
  {
    id: 5,
    name: "Sara Mohamed",
    date: "Oct 12, 2023",
    avatar:
      "https://images.pexels.com/photos/33781058/pexels-photo-33781058.jpeg",
    text: "I've been waiting for a course like this. Thank you so much for the detailed explanations.",
  },
];

function CommentItem({
  comment,
  isNew,
}: {
  comment: Comment;
  isNew?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3 pb-5 pt-3 group border-b border-gray-100 last:border-0
                  transition-all duration-500 ease-out
                  ${isNew ? "animate-[fadeSlideIn_0.4s_ease-out]" : ""}`}
    >
      <div
        className="relative w-13 h-13 rounded-full overflow-hidden flex-shrink-0
                      transition-transform duration-300 group-hover:scale-105"
      >
        <Image
          src={comment.avatar}
          alt={comment.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row  sm:items-center sm:gap-4">
          <p className="text-sm font-semibold text-gray-800 group-hover:text-teal-600 transition-colors duration-200">
            {comment.name}
          </p>
          <span className="text-xs text-gray-400">{comment.date}</span>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-1">
          {comment.text}
        </p>
      </div>
    </div>
  );
}

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [draft, setDraft] = useState("");
  const [newIds, setNewIds] = useState<Set<number>>(new Set());
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const userScrolled = useRef(false); // true when user has manually scrolled up
  const isMounted = useRef(false); // skip auto-scroll on initial render

  const { ref, isVisible } = useScrollReveal();

  // Detect manual scroll — if user scrolls up, pause auto-scroll
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    function onScroll() {
      const distFromBottom =
        el!.scrollHeight - el!.scrollTop - el!.clientHeight;
      userScrolled.current = distFromBottom > 60;
      setShowScrollBtn(distFromBottom > 60);
    }

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll the comment list container to bottom (never touches page scroll)
  function scrollListToBottom(behavior: ScrollBehavior = "smooth") {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }

  // Auto-scroll list when new comment added (skip initial render)
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (!userScrolled.current) {
      scrollListToBottom();
    }
  }, [comments]);

  function scrollToBottom() {
    userScrolled.current = false;
    setShowScrollBtn(false);
    scrollListToBottom();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;

    const newId = Date.now();
    const newComment: Comment = {
      id: newId,
      name: "You",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      avatar:
        "https://images.pexels.com/photos/9208563/pexels-photo-9208563.jpeg",
      text: draft.trim(),
    };

    // Mark as new for animation
    setNewIds((prev) => new Set(prev).add(newId));
    setComments((prev) => [...prev, newComment]);
    setDraft("");
    userScrolled.current = false; // always scroll to new comment you just posted
  }

  return (
    <div
      ref={ref}
      className={`mb-8 transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold text-gray-800">
          Comments
          <span className="ml-2 text-base font-normal text-gray-400">
            ({comments.length})
          </span>
        </h2>
      </div>

      {/* Scrollable comment list — fixed height like YouTube */}
      <div className="relative">
        <div
          ref={listRef}
          className="flex flex-col gap-1 overflow-y-auto pr-1 mb-4"
          style={{ maxHeight: "500px" }}
        >
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isNew={newIds.has(comment.id)}
            />
          ))}
          {/* Invisible anchor at the bottom */}
          <div ref={bottomRef} />
        </div>

        {/* Scroll-to-bottom button — appears when user scrolled up */}
        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-6 right-2 flex items-center gap-1.5
                       bg-gray-800/80 backdrop-blur-sm text-white text-xs font-medium
                       px-3 py-1.5 rounded-full shadow-lg hover:bg-gray-900
                       transition-all duration-200 animate-[fadeSlideIn_0.3s_ease-out]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="w-3 h-3"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
            New comments
          </button>
        )}
      </div>

      {/* Write a Comment */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a comment..."
          rows={7}
          className="w-full bg-white shadow-sm border border-gray-200 rounded-sm px-4 py-3
                     text-sm text-gray-700 placeholder-gray-400 resize-none
                     focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent
                     transition-all duration-200 hover:border-gray-300"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-[#41B69D] text-white
                     text-sm font-medium px-6 py-3 rounded-sm w-max cursor-pointer
                     transition-all duration-300 hover:bg-[#3A9E8A] hover:scale-105
                     hover:shadow-lg hover:shadow-teal-200 active:scale-95"
        >
          Submit Review →
        </button>
      </form>
    </div>
  );
}
