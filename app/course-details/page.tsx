import type { Metadata } from "next";
import CoursePageClient from "./CoursePageClient";

export const metadata: Metadata = {
  title: "Starting SEO as your Home Based Business | Course Details",
  description: "Learn SEO from scratch. Practical lessons, quizzes, and real-world exercises to grow your online business.",
  openGraph: {
    title: "Starting SEO as your Home Based Business",
    description: "Practical SEO course with lessons, quizzes, and exercises.",
    type: "website",
  },
};

export default function CourseDetailsPage() {
  return <CoursePageClient />;
}
