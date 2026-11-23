"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Pill, PosterGrid } from "@/components/Card";
import { TITLES } from "@/lib/catalog";

const FILTERS = [
  { label: "All", kind: null },
  { label: "Series", kind: "series" },
  { label: "Films", kind: "film" },
  { label: "Documentaries", kind: "documentary" },
] as const;

const SORTS = ["Most relevant", "Newest", "A to Z"] as const;
const SUGGESTIONS = ["Sci-Fi", "Animation", "Thriller", "Family", "Technology"];

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filter, setFilter] = useState(0);
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Most relevant");

  useEffect(() => {
    const id = setTimeout(() => setDebounced(q.trim().toLowerCase()), 200);
    return () => clearTimeout(id);
  }, [q]);

  const ids = useMemo(() => {
    const kind = FILTERS[filter].kind;
    const list = TITLES.filter(
      (t) =>
        (!kind || t.kind === kind) &&
        (!debounced ||
          t.name.toLowerCase().includes(debounced) ||
          t.genres.some((g) => g.toLowerCase().includes(debounced)) ||
          t.cast.some((c) => c.toLowerCase().includes(debounced))),
    );
    if (sort === "Newest") list.sort((a, b) => b.year - a.year);
    if (sort === "A to Z") list.sort((a, b) => a.name.localeCompare(b.name));
    return list.map((t) => t.id);
  }, [debounced, filter, sort]);

  return (
    <div className="min-h-screen">
      <header className="flex flex-wrap items-center gap-x-10 gap-y-3 border-b border-line px-4 py-4 md:px-12">
        <Link href="/browse" className="font-display text-2xl font-extrabold tracking-tight">
          Kinora<span className="text-accent">.</span>
        </Link>
        <div role="search" className="relative order-last w-full max-w-[720px] md:order-none md:flex-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A8A196" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="absolute left-4 top-3.5">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          <input
            type="search"
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search titles, actors, genres"
            placeholder="Titles, actors, genres"
            className="h-12 w-full rounded-full border-2 border-accent bg-surface pl-[46px] pr-4 text-base text-fg placeholder:text-muted"
          />
        </div>
        <Link href="/browse" className="ml-auto px-2 py-3 text-[15px] font-medium text-muted hover:text-fg">
          Cancel
        </Link>
      </header>

      <main className="mx-auto flex max-w-[1344px] flex-col gap-8 px-4 py-8 md:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-2">
            {FILTERS.map((f, i) => (
              <Pill key={f.label} active={filter === i} onClick={() => setFilter(i)}>
                {f.label}
              </Pill>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="text-sm text-muted">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
              className="h-11 rounded-lg border border-[#8a8378] bg-surface px-3.5 text-[15px]"
            >
              {SORTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="font-display text-[28px] font-bold tracking-tight">{debounced ? `Results for "${q.trim()}"` : "Browse all titles"}</h1>
          <span role="status" className="text-sm text-muted">
            {ids.length} {ids.length === 1 ? "result" : "results"} · {FILTERS[filter].label}
          </span>
        </div>

        {ids.length > 0 ? (
          <PosterGrid ids={ids} />
        ) : (
          <p className="py-12 text-center text-muted">Nothing matched. Try another word or filter.</p>
        )}

        <section aria-labelledby="rs" className="flex flex-col gap-4 border-t border-line pt-8">
          <h2 id="rs" className="font-display text-xl font-bold">
            Try a different search
          </h2>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <Pill key={s} onClick={() => setQ(s)}>
                {s}
              </Pill>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
