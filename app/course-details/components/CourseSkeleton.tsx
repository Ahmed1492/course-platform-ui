function Shimmer({ className }: { className: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-gray-200 rounded ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

function VideoSkeleton() {
  return (
    <div className="mb-6">
      {/* Video */}
      <Shimmer className="w-full aspect-video rounded-lg mb-4" />
      {/* Social + avatars row */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <Shimmer key={i} className="w-8 h-8 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

function CourseMaterialsSkeleton() {
  return (
    <div className="mb-8">
      <Shimmer className="w-44 h-6 mb-4" />
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`grid grid-cols-2 divide-x divide-gray-200 ${
              i < 3 ? "border-b border-gray-200" : ""
            }`}
          >
            {[...Array(2)].map((_, j) => (
              <div key={j} className="flex items-center gap-3 px-5 py-3">
                <Shimmer className="w-4 h-4 rounded-full" />
                <Shimmer className="w-16 h-3" />
                <Shimmer className="w-20 h-3" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function CommentsSkeleton() {
  return (
    <div className="mb-8">
      <Shimmer className="w-32 h-7 mb-7" />
      <div className="flex flex-col gap-5 mb-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-3 pb-4 border-b border-gray-200 last:border-0"
          >
            <Shimmer className="w-16 h-16 rounded-full flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <Shimmer className="w-40 h-3" />
              <Shimmer className="w-24 h-2" />
              <Shimmer className="w-full h-3" />
              <Shimmer className="w-5/6 h-3" />
              <Shimmer className="w-4/6 h-3" />
            </div>
          </div>
        ))}
      </div>
      {/* textarea */}
      <Shimmer className="w-full h-40 rounded-lg mb-4" />
      <Shimmer className="w-36 h-10 rounded-lg" />
    </div>
  );
}

function CourseTopicsSkeleton() {
  return (
    <aside className="w-full">
      {/* Title */}
      <Shimmer className="w-48 h-6 mb-5" />

      {/* Progress bar */}
      <div className="relative mb-8 mt-6">
        <Shimmer className="w-full h-[5px] rounded-full" />
      </div>

      <div className="mt-10" />

      {/* Section cards */}
      <div className="flex flex-col gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-md p-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex flex-col gap-2 flex-1">
                <Shimmer className="w-24 h-3" />
                <Shimmer className="w-full h-2" />
                <Shimmer className="w-4/5 h-2" />
              </div>
              <Shimmer className="w-4 h-4 rounded" />
            </div>

            {/* Lessons — only show for first card */}
            {i === 0 && (
              <div className="flex flex-col gap-2 pt-1">
                {[...Array(5)].map((_, j) => (
                  <div
                    key={j}
                    className="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-0"
                  >
                    <Shimmer className="w-3 h-3 rounded" />
                    <Shimmer className="flex-1 h-2" />
                    <Shimmer className="w-3 h-3 rounded" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function CourseSkeleton() {
  return (
    <div className="min-h-screen bg-white shadow-sm border-2 py-1">
      <div className="max-w-7xl mx-auto border border-gray-200/90">
        {/* Breadcrumb + title */}
        <div className="bg-gray-50 py-4 px-6 mb-3">
          <div className="flex gap-2 mb-3">
            <Shimmer className="w-10 h-3" />
            <Shimmer className="w-3 h-3" />
            <Shimmer className="w-16 h-3" />
            <Shimmer className="w-3 h-3" />
            <Shimmer className="w-28 h-3" />
          </div>
          <Shimmer className="w-72 h-7" />
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row gap-8 w-full px-6 pb-8">
          <div className="flex-[2] min-w-0">
            <VideoSkeleton />
            <CourseMaterialsSkeleton />
            <CommentsSkeleton />
          </div>
          <div className="flex-[1] min-w-0">
            <CourseTopicsSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
