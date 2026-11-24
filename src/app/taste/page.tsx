"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

const GENRES = [
  ["Drama", "#2B3A55"], ["Comedy", "#4A2F2F"], ["Thriller", "#2C4A43"], ["Documentary", "#3B2F4A"], ["Sci-Fi", "#4B4231"], ["Romance", "#35404A"],
  ["Animation", "#2B3A55"], ["Crime", "#4A2F2F"], ["Fantasy", "#2C4A43"], ["Horror", "#3B2F4A"], ["Reality", "#4B4231"], ["Action", "#35404A"],
] as const;

export default function TastePage() {
  const ready = useHydrated();
  const stored = useStore((s) => s.tastes);
  const set = useStore((s) => s.set);
  const sel = ready ? stored : [];
  const ok = sel.length >= 3;

  return (
    <div className="mx-auto flex min-h-screen max-w-[1344px] flex-col px-6 py-8 md:px-24">
      <div className="flex items-center justify-between">
        <Link href="/browse" className="font-display text-2xl font-extrabold tracking-tight">
          Kinora<span className="text-accent">.</span>
        </Link>
        <Link href="/browse" className="px-2 py-3 text-[15px] font-medium text-muted hover:text-fg">
          Skip for now
        </Link>
      </div>

      <div className="mt-7 flex flex-col gap-2">
        <span className="text-[13px] font-semibold uppercase tracking-widest text-accent">Step 2 of 2</span>
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">Pick three or more you enjoy</h1>
        <p className="text-base text-muted">We use this to shape your first recommendations. You can change it any time.</p>
      </div>

      <div role="group" aria-label="Genres" className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {GENRES.map(([name, bg]) => {
          const on = sel.includes(name);
          return (
            <button key={name} aria-pressed={on} onClick={() => set({ tastes: on ? sel.filter((x) => x !== name) : [...sel, name] })} className="p-2.5">
              <div className="relative flex aspect-video items-end rounded-[10px] p-3 text-left" style={{ background: bg }}>
                <span className="font-display text-lg font-bold">{name}</span>
                {on && (
                  <>
                    {["-left-2 -top-2 border-l-[3px] border-t-[3px]", "-right-2 -top-2 border-r-[3px] border-t-[3px]", "-bottom-2 -left-2 border-b-[3px] border-l-[3px]", "-bottom-2 -right-2 border-b-[3px] border-r-[3px]"].map((c) => (
                      <span key={c} className={`absolute h-[18px] w-[18px] border-accent ${c}`} />
                    ))}
                    <span className="absolute right-2 top-2 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-accent text-[#1a1208]">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12l5 5 9-10" />
                      </svg>
                    </span>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-line pt-5">
        <span role="status" className="text-[15px] text-[#cfc9be]">
          {ok ? `${sel.length} selected. You are all set.` : `${sel.length} of 3 selected`}
        </span>
        {ok ? (
          <Link href="/browse" className="inline-flex h-[52px] items-center rounded-lg bg-accent px-8 text-base font-semibold text-[#1a1208]">
            Continue
          </Link>
        ) : (
          <span aria-disabled="true" className="inline-flex h-[52px] items-center rounded-lg bg-line px-8 text-base font-semibold text-muted">
            Continue
          </span>
        )}
      </div>
    </div>
  );
}
