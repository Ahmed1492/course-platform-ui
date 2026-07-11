# Course Details Page

A Next.js 16 course platform UI built as a frontend task for IT-Legend.

## Live Demo

Deployed on Vercel: _add your URL after deploying_

---

## Features

- **Course Player** — custom HTML5 video player with play/pause, progress scrubbing, volume, fullscreen, and wide mode
- **Sticky Player on Mobile** — player sticks to the top while scrolling (YouTube-style)
- **Course Topics Sidebar** — collapsible week sections with lesson list, badges, and lock icons
- **Course Progress** — animated progress bar that fills on scroll, with student level and XP
- **Exam Popup** — full-screen quiz with timer, question navigator, session-persisted progress, and results screen
- **PDF / Reference Files Popup** — file browser with download support
- **Ask a Question Popup** — session-persisted draft textarea
- **Leaderboard Popup** — podium + ranked list with motivational messages from م. علي شاهين based on student progress
- **Comments Section** — YouTube-style auto-scrolling comment list with new comment animation
- **Mobile Nav Bar** — Curriculum, Comments, Ask Question, Leaderboard icons under the player
- **Skeleton Loading** — full-page skeleton shown for 2 seconds on load
- **Scroll Animations** — fade/slide-in animations triggered by IntersectionObserver
- **Hover Effects** — on all interactive elements
- **Responsive** — fully responsive across mobile, tablet, and desktop

---

## Tech Stack

| Tool | Version |
|---|---|
| Next.js | 16 |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 4 |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000/course-details](http://localhost:3000/course-details)

---

## Deploy to Vercel

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Next.js — click **Deploy**

No environment variables required.

---

## Project Structure

```
app/
├── course-details/
│   ├── page.tsx                  # Route entry point
│   ├── CoursePageClient.tsx      # Main layout + state (wide mode, exam mode)
│   └── components/
│       ├── CoursePlayer.tsx      # Video player with sticky + fullscreen
│       ├── CourseVideo.tsx       # Player wrapper + social icons + mobile nav
│       ├── CourseMaterials.tsx   # Stats grid (duration, lessons, enrolled, language)
│       ├── CourseTopics.tsx      # Sidebar: progress + collapsible week sections
│       ├── Comments.tsx          # Auto-scroll comment list
│       ├── Breadcrumb.tsx        # Navigation breadcrumb
│       ├── CourseSkeleton.tsx    # Loading skeleton
│       ├── ExamPopup.tsx         # Quiz popup with timer + session progress
│       ├── ExamView.tsx          # Inline exam view (alternative)
│       ├── PdfPopup.tsx          # Reference files browser popup
│       ├── AskQuestionPopup.tsx  # Ask question with session draft
│       └── LeaderboardPopup.tsx  # Leaderboard with coach messages
│   └── hooks/
│       └── useScrollReveal.ts    # IntersectionObserver scroll animation hook
├── globals.css                   # Global styles + keyframes
└── layout.tsx                    # Root layout with metadata
```
