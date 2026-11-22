"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { searchTitles } from "@/lib/catalog";

const NAV = [
  { href: "/browse", label: "Home" },
  { href: "/browse?list=1", label: "My list" },
];

export default function Header() {
  const path = usePathname();
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebounced(q), 200); // debounce
    return () => clearTimeout(id);
  }, [q]);

  const results = searchTitles(debounced);

  return (
    <header className="flex flex-wrap items-center gap-x-10 gap-y-3 border-b border-line px-6 py-4 md:px-12">
      <Link href="/browse" className="font-display text-2xl font-extrabold tracking-tight">
        Kinora<span className="text-accent">.</span>
      </Link>
      <nav aria-label="Primary" className="flex flex-1 gap-2">
        {NAV.map((n) => (
          <Link
            key={n.label}
            href={n.href}
            className={`px-4 py-3 text-[15px] ${path === "/browse" && n.label === "Home" ? "border-b-2 border-accent font-semibold" : "font-medium text-muted hover:text-fg"}`}
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="relative">
        <label htmlFor="search" className="sr-only">
          Search titles
        </label>
        <input
          id="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search…"
          className="h-11 w-48 rounded-full border border-muted/60 bg-transparent px-4 text-sm placeholder:text-muted focus:w-64"
        />
        {results.length > 0 && (
          <ul className="absolute right-0 z-40 mt-2 w-72 overflow-hidden rounded-xl border border-line bg-surface shadow-xl">
            {results.map((t) => (
              <li key={t.id}>
                <Link href={`/title/${t.id}`} onClick={() => setQ("")} className="flex flex-col px-4 py-3 hover:bg-line">
                  <span className="text-sm font-semibold">{t.name}</span>
                  <span className="text-xs text-muted">
                    {t.kind} · {t.genres.join(", ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
