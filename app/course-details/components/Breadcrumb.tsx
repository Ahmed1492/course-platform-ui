import Link from "next/link";

const items = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Course Details", href: "#" },
];

export default function Breadcrumb() {
  return (
    <nav className="text-xs text-gray-700 font-thin mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-1">
            {index < items.length - 1 ? (
              <>
                <Link href={item.href} className="hover:text-gray-900 transition-colors">
                  {item.label}
                </Link>
                <span className="text-gray-900 font-extralight">›</span>
              </>
            ) : (
              <span className="text-gray-900 font-extralight">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
