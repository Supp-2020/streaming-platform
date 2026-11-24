"use client";
import Link from "next/link";
import { useState } from "react";
import { Art } from "@/components/Art";
import Header from "@/components/Header";
import { getTitle } from "@/lib/catalog";
import { useAllowed } from "@/lib/parental";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

// Sample upcoming releases (not in the catalog, so they can't be played yet).
const SOON = [
  { id: "soon-1", name: "Glass Tide", month: "DEC", day: "05", bg: "#2B3A55", fg: "#F0A04B", meta: "Coming soon · Series · Drama · 16+", synopsis: "A marine biologist finds a signal in the deep that someone wants kept quiet." },
  { id: "soon-2", name: "The Paper Garden", month: "DEC", day: "19", bg: "#4A2F2F", fg: "#E9B44C", meta: "Coming soon · Film · Family · U", synopsis: "A girl discovers that the origami in her late grandmother's attic can walk." },
  { id: "soon-3", name: "Night Courier", month: "JAN", day: "09", bg: "#2C4A43", fg: "#D9D2C3", meta: "Coming soon · Series · Thriller · 18", synopsis: "One bike, one bag, and a city that never sleeps on its secrets." },
];
const HOT = ["tears-of-steel", "test-pattern", "neon-harbor", "big-buck-bunny"];

export default function NewHotPage() {
  const ready = useHydrated();
  const reminders = useStore((s) => s.reminders);
  const set = useStore((s) => s.set);
  const allowed = useAllowed();
  const [tab, setTab] = useState(0);
  const tabs = ["Coming soon", "Everyone's watching"];
  const on = (id: string) => ready && reminders.includes(id);

  const btn = "inline-flex h-12 items-center gap-2 rounded-lg px-6 text-[15px] font-semibold";

  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-[1344px] flex-col gap-6 px-4 pb-20 pt-10 md:px-12">
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">New &amp; Hot</h1>
        <div role="tablist" aria-label="Sections" className="flex gap-2 border-b border-line">
          {tabs.map((t, i) => (
            <button key={t} role="tab" aria-selected={tab === i} onClick={() => setTab(i)} className={`-mb-px border-b-2 px-4 py-3.5 text-[15px] ${tab === i ? "border-accent font-semibold text-fg" : "border-transparent font-medium text-muted"}`}>
              {t}
            </button>
          ))}
        </div>

        <ul className="flex flex-col gap-3">
          {tab === 0 &&
            SOON.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-6 rounded-xl border border-line bg-surface p-4">
                <div className="flex w-[72px] flex-col items-center gap-0.5">
                  <span className="text-xs font-semibold tracking-widest text-muted">{r.month}</span>
                  <span className="font-display text-4xl font-extrabold leading-none tracking-tight">{r.day}</span>
                </div>
                <Art title={r} className="aspect-video w-full rounded-[10px] md:w-80" />
                <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-2">
                  <h2 className="font-display text-[22px] font-bold">{r.name}</h2>
                  <span className="text-[13px] text-muted">{r.meta}</span>
                  <p className="max-w-[560px] text-[15px] leading-relaxed text-[#cfc9be]">{r.synopsis}</p>
                  <div className="mt-2">
                    <button
                      onClick={() => set({ reminders: on(r.id) ? reminders.filter((x) => x !== r.id) : [...reminders, r.id] })}
                      aria-pressed={on(r.id)}
                      className={`${btn} border ${on(r.id) ? "border-fg bg-fg text-bg" : "border-[#8a8378]"}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 9a6 6 0 0112 0c0 6 2 7 2 7H4s2-1 2-7" />
                        <path d="M10 20a2 2 0 004 0" />
                      </svg>
                      {on(r.id) ? "Reminder on" : "Remind me"}
                    </button>
                  </div>
                </div>
              </li>
            ))}

          {tab === 1 &&
            HOT.filter(allowed).map((id, i) => {
              const t = getTitle(id)!;
              return (
                <li key={id} className="flex flex-wrap items-center gap-6 rounded-xl border border-line bg-surface p-4">
                  <div className="flex w-[72px] flex-col items-center gap-0.5">
                    <span className="text-xs font-semibold tracking-widest text-muted">NO.</span>
                    <span className="font-display text-4xl font-extrabold leading-none tracking-tight">{i + 1}</span>
                  </div>
                  <Art title={t} className="aspect-video w-full rounded-[10px] md:w-80" />
                  <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-2">
                    <h2 className="font-display text-[22px] font-bold">{t.name}</h2>
                    <span className="text-[13px] capitalize text-muted">
                      {t.kind} · {t.genres[0]} · {t.rating}
                    </span>
                    <p className="max-w-[560px] text-[15px] leading-relaxed text-[#cfc9be]">{t.synopsis}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Link href={`/watch/${t.episodes[0].id}`} className={`${btn} bg-accent text-[#1a1208]`}>
                        ▶ Play
                      </Link>
                      <Link href={`/title/${t.id}`} className={`${btn} border border-[#8a8378]`}>
                        More info
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </main>
    </>
  );
}
