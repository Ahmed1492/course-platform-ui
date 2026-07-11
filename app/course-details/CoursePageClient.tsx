"use client";

import { useEffect, useRef, useState } from "react";
import Breadcrumb from "./components/Breadcrumb";
import CourseVideo from "./components/CourseVideo";
import CourseMaterials from "./components/CourseMaterials";
import Comments from "./components/Comments";
import CourseTopics from "./components/CourseTopics";
import CourseSkeleton from "./components/CourseSkeleton";

export default function CoursePageClient() {
  const [loading, setLoading] = useState(true);
  const [wide, setWide] = useState(false);
  const [isExamMode, setIsExamMode] = useState(false);

  // Section refs for mobile scroll nav
  const curriculumRef = useRef<HTMLElement>(null);
  const commentsRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <CourseSkeleton />;

  return (
    <div className="min-h-screen bg-white">
      {/* ── Breadcrumb header ── */}
      <div className="max-w-7xl mx-auto border-x border-t border-gray-200/90 bg-white shadow-sm">
        <div className="bg-gray-50 py-4 px-6 border-b border-gray-200/90">
          <Breadcrumb />
          <h1 className="text-2xl font-bold text-gray-900">
            Starting SEO as your Home
          </h1>
        </div>
      </div>

      {wide ? (
        /* ══════════════════════════════════════════════════════════════════
         *  WIDE MODE — player full viewport width, content pushed below
         * ══════════════════════════════════════════════════════════════════ */
        <div className="w-full flex flex-col pb-8">
          {/* Player area — dark background, full width */}
          <div className="w-full bg-zinc-950 pb-6 pt-4">
            <div className="max-w-[1600px] mx-auto w-full px-0 xl:px-6">
              <CourseVideo
                curriculumRef={curriculumRef}
                commentsRef={commentsRef}
                wide={wide}
                onWideToggle={() => setWide(false)}
              />
            </div>
          </div>
          {/* Course content below */}
          <div className="max-w-7xl mx-auto w-full px-6 mt-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-[2] min-w-0">
                <CourseMaterials />
                <div ref={commentsRef} className="hidden lg:block">
                  <Comments />
                </div>
              </div>
              <aside ref={curriculumRef} className="flex-[1] min-w-0">
                <CourseTopics isExamMode={isExamMode} setIsExamMode={setIsExamMode} />
              </aside>
              <div className="lg:hidden flex-[2] min-w-0">
                <MobileComments commentsRef={commentsRef} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════════
         *  NORMAL MODE
         *  Mobile: player sticks to top (YouTube-style) 
         *  Desktop: two-column layout, no sticky
         * ══════════════════════════════════════════════════════════════════ */
        <>
          {/* ── Mobile sticky player (visible only on <lg) ── */}
          <div className={`lg:hidden ${isExamMode ? '' : 'sticky'} top-0 z-40 bg-white shadow-md`}>
            <CourseVideo
              curriculumRef={curriculumRef}
              commentsRef={commentsRef}
              wide={wide}
              onWideToggle={() => setWide(true)}
            />
          </div>

          {/* ── Main content area ── */}
          <div className="max-w-7xl mx-auto border-x border-b border-gray-200/90">
            <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 w-full pb-8">
              {/* Left column */}
              <div className="flex-[2] min-w-0 order-1">
                {/* Desktop player (visible only on lg+) */}
                <div className="hidden lg:block px-6 pt-6">
                  <CourseVideo
                    curriculumRef={curriculumRef}
                    commentsRef={commentsRef}
                    wide={wide}
                    onWideToggle={() => setWide(true)}
                  />
                </div>
                <div className="px-6 pt-4 lg:pt-0">
                  <CourseMaterials />
                  <div ref={commentsRef} className="hidden lg:block">
                    <Comments />
                  </div>
                </div>
              </div>

              {/* Right sidebar */}
              <aside ref={curriculumRef} className="flex-[1] min-w-0 order-2 px-6 lg:px-0 lg:pr-6 pt-4 lg:pt-6">
                <CourseTopics isExamMode={isExamMode} setIsExamMode={setIsExamMode} />
              </aside>

              {/* Comments — mobile only */}
              <div className="lg:hidden order-3 flex-[2] min-w-0 px-6">
                <MobileComments commentsRef={commentsRef} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MobileComments({ commentsRef }: { commentsRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={commentsRef}>
      <Comments />
    </div>
  );
}
