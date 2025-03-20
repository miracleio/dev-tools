import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

const pages = [
  {
    title: "Types Generator",
    href: "/types-generator",
    emoji: "🧬",
    description: "Generate TypeScript types from JSON data.",
  },
  {
    title: "Slug Generator",
    href: "/slug-generator",
    emoji: "🔗",
    description: "Generate URL-friendly slugs from text.",
  },
  {
    title: "API Keys Calculator",
    href: "/api-keys-calculator",
    emoji: "🔑",
    description:
      "Calculate the number of API keys needed for a given interval.",
  },
  {
    title: "Word Counter",
    href: "/word-counter",
    emoji: "📝",
    description: "Count the number of words in a text.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-section">
        <div className="wrapper">
          <div className="section-header text-center">
            <h1 className="text-3xl tracking-tight lg:text-5xl xl:text-8xl font-bold">
              Collection of Simple & (hopefully) useful tools.
            </h1>
          </div>
        </div>
      </header>
      <section className="site-section">
        <div className="wrapper">
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <li key={page.title} className="card" aria-label={page.title}>
                <div className="card-body">
                  <div className="flex items-start justify-start flex-col gap-2">
                    <span className="icon text-7xl mb-12 mt-1">
                      {page.emoji}
                    </span>
                    <h2 className="text-xl lg:text-2xl font-bold">
                      {page.title}
                    </h2>
                  </div>
                  <p className=" text-gray-600 dark:text-gray-400">
                    {page.description}
                  </p>

                  <div className="action-cont mt-4">
                    <Link href={page.href} className="btn primary">
                      Open
                      <HugeiconsIcon
                        icon={ArrowRight02Icon}
                        size={24}
                        color="currentColor"
                        strokeWidth={1.5}
                      />
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
