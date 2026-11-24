"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Art } from "@/components/Art";
import Header from "@/components/Header";
import { Switch } from "@/components/settings/ui";
import { getEpisode } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

type Item = { id: string; episodeId: string; kind: "done" | "loading" | "expired"; pct: number; paused: boolean; mb: number; days: number };

// Sample data: real HLS offline download isn't built, so this page demonstrates the UI only.
const SEED: Item[] = [
  { id: "d1", episodeId: "test-pattern-s1e1", kind: "done", pct: 100, paused: false, mb: 420, days: 6 },
  { id: "d2", episodeId: "test-pattern-s1e2", kind: "loading", pct: 45, paused: false, mb: 510, days: 7 },
  { id: "d3", episodeId: "tears-of-steel-s1e1", kind: "expired", pct: 0, paused: false, mb: 380, days: 0 },
  { id: "d4", episodeId: "neon-harbor-s1e1", kind: "done", pct: 100, paused: false, mb: 460, days: 3 },
];

export default function DownloadsPage() {
  const ready = useHydrated();
  const smart = useStore((s) => s.smartDownloads);
  const set = useStore((s) => s.set);
  const [items, setItems] = useState(SEED);

  // Simulate the active download progressing.
  useEffect(() => {
    const id = setInterval(() => {
      setItems((list) =>
        list.map((d) => {
          if (d.kind !== "loading" || d.paused) return d;
          const pct = Math.min(100, d.pct + 5);
          return pct === 100 ? { ...d, pct, kind: "done" } : { ...d, pct };
        }),
      );
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const update = (id: string, patch: Partial<Item>) => setItems((l) => l.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  const usedGb = (items.reduce((n, d) => n + (d.kind === "expired" ? 0 : (d.mb * d.pct) / 100), 0) / 1024).toFixed(1);
  const btn = "inline-flex h-11 items-center rounded-lg px-5 text-[15px] font-semibold";

  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-[1344px] flex-col gap-7 px-4 pb-20 pt-10 md:px-12">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">Downloads</h1>
          <span className="text-[15px] text-muted">Watch offline on this device. Downloads expire, so reconnect now and then to keep them. Sample data for this demo.</span>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex flex-[1_1_380px] flex-col gap-3 rounded-xl border border-line bg-surface p-5">
            <div className="flex justify-between text-sm">
              <span className="font-semibold">Device storage</span>
              <span className="text-muted">48.6 GB used of 128 GB</span>
            </div>
            <div role="progressbar" aria-label="Storage used" aria-valuemin={0} aria-valuemax={100} aria-valuenow={38} className="h-2 rounded bg-line">
              <div className="h-2 w-[38%] rounded bg-accent" />
            </div>
            <span className="text-[13px] text-muted">Kinora downloads take {usedGb} GB.</span>
          </div>
          <div className="flex flex-[1_1_380px] items-center justify-between gap-5 rounded-xl border border-line bg-surface p-5">
            <div className="flex flex-col gap-1">
              <span id="sd" className="text-base font-semibold">
                Smart downloads
              </span>
              <span className="text-sm leading-normal text-muted">Download the next episode and remove watched ones automatically, on Wi-Fi only.</span>
            </div>
            <Switch id="sd" checked={ready && smart} onChange={(v) => set({ smartDownloads: v })} />
          </div>
        </div>

        {items.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#8a8378] px-4 py-20 text-center">
            <h2 className="font-display text-2xl font-bold">No downloads yet</h2>
            <p className="max-w-sm text-[15px] leading-relaxed text-muted">Use the download button on any episode or film to watch it without a connection.</p>
            <Link href="/browse" className={`${btn} mt-2 h-12 bg-accent text-[#1a1208]`}>
              Find something to download
            </Link>
          </div>
        )}

        <ul className="flex flex-col gap-3">
          {items.map((d) => {
            const f = getEpisode(d.episodeId);
            if (!f) return null;
            const label = f.title.kind === "series" ? `S${f.episode.season} · E${f.episode.number}` : f.title.kind === "film" ? "Film" : "Documentary";
            const sub =
              d.kind === "done" ? `${label} · ${d.mb} MB · Expires in ${d.days} days` : d.kind === "loading" ? `${label} · ${d.paused ? "Paused" : "Downloading"}` : `${label} · Expired · Renew while online`;
            return (
              <li key={d.id} className="flex flex-wrap items-center gap-5 rounded-xl border border-line bg-surface p-3.5">
                <Art title={f.title} className="aspect-video w-full rounded-lg sm:w-[168px]" />
                <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-1.5">
                  <span className="text-base font-semibold">{f.title.name}</span>
                  <span className="text-[13px] text-muted">{sub}</span>
                  {d.kind === "loading" && (
                    <div className="flex max-w-[420px] items-center gap-3">
                      <div role="progressbar" aria-label="Download progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={d.pct} className="h-1.5 flex-1 rounded bg-line">
                        <div className="h-1.5 rounded bg-accent" style={{ width: `${d.pct}%` }} />
                      </div>
                      <span className="w-10 text-[13px] text-[#cfc9be]">{d.pct}%</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {d.kind === "done" && (
                    <Link href={`/watch/${d.episodeId}`} className={`${btn} bg-accent text-[#1a1208]`}>
                      Play
                    </Link>
                  )}
                  {d.kind === "loading" && (
                    <button onClick={() => update(d.id, { paused: !d.paused })} className={`${btn} border border-[#8a8378]`}>
                      {d.paused ? "Resume" : "Pause"}
                    </button>
                  )}
                  {d.kind === "expired" && (
                    <button onClick={() => update(d.id, { kind: "done", pct: 100, days: 7 })} className={`${btn} border border-accent text-accent`}>
                      Renew
                    </button>
                  )}
                  <button onClick={() => setItems((l) => l.filter((x) => x.id !== d.id))} aria-label={`Delete download ${f.title.name}`} className="flex h-11 w-11 items-center justify-center rounded-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                    </svg>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}
