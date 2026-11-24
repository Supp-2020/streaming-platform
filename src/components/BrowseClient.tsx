"use client";
import Link from "next/link";
import { Art } from "@/components/Art";
import { Card } from "@/components/Card";
import ListButton from "@/components/ListButton";
import { getEpisode, getTitle, ROWS, TITLES, fmtTime } from "@/lib/catalog";
import { useAllowed } from "@/lib/parental";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

export default function BrowseClient() {
  const hydrated = useHydrated();
  const progress = useStore((s) => s.progress);

  const allowed = useAllowed();
  const tastes = useStore((s) => s.tastes);

  const featured = getTitle("tears-of-steel")!;
  const featuredEp = featured.episodes[0];

  // "Picked for you": titles whose genre or kind matches the genres chosen on the taste page.
  const wanted = hydrated ? tastes.map((t) => t.toLowerCase()) : [];
  const picked = TITLES.filter((t) => allowed(t.id) && wanted.some((w) => t.genres.some((g) => g.toLowerCase() === w) || (w === "documentary" && t.kind === "documentary"))).map((t) => t.id);
  const rows = [...(picked.length ? [{ id: "picked", title: "Picked for you", ids: picked }] : []), ...ROWS].map((r) => ({ ...r, ids: r.ids.filter(allowed) })).filter((r) => r.ids.length > 0);

  const continueItems = hydrated
    ? Object.entries(progress)
        .sort((a, b) => b[1].at - a[1].at)
        .map(([id, p]) => ({ p, found: getEpisode(id) }))
        .filter((x) => x.found)
    : [];

  return (
    <>
      <section aria-label="Featured" className="mx-auto flex w-full max-w-[1344px] flex-wrap gap-8 px-4 pb-12 pt-8 md:gap-10 md:px-12 md:pt-10">
        <Art title={featured} className="order-first min-h-[240px] flex-[1.3_1_420px] rounded-2xl md:order-last md:min-h-[360px]" />
        <div className="flex min-w-0 flex-[1_1_380px] flex-col justify-center gap-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-accent md:text-[13px]">Featured</div>
          <h1 className="font-display text-4xl font-extrabold leading-none tracking-tight md:text-7xl">{featured.name}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            <span className="rounded border border-muted/60 px-2 py-0.5 font-semibold text-fg">{featured.rating}</span>
            <span>{featured.year}</span>·<span>{featured.genres.join(", ")}</span>·<span>{featured.badges.join(" · ")}</span>
          </div>
          <p className="max-w-lg text-[17px] leading-relaxed text-[#cfc9be]">{featured.synopsis}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/watch/${featuredEp.id}`} className="flex h-[52px] items-center gap-2 rounded-lg bg-accent px-7 font-semibold text-[#1a1208]">
              ▶ Play
            </Link>
            <Link href={`/title/${featured.id}`} className="flex h-[52px] items-center rounded-lg border border-muted/60 px-6 font-semibold">
              More info
            </Link>
            <ListButton titleId={featured.id} />
          </div>
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-[1344px] flex-col gap-12 px-4 pb-16 md:px-12">
        {continueItems.length > 0 && (
          <section aria-labelledby="cw">
            <h2 id="cw" className="mb-4 font-display text-2xl font-bold">
              Continue watching
            </h2>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {continueItems.map(({ p, found }) => (
                <Link key={found!.episode.id} href={`/watch/${found!.episode.id}`} className="flex flex-col gap-3">
                  <div className="relative">
                    <Art title={found!.title} className="aspect-video rounded-[10px]" />
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-bg/70">
                      <div className="h-1 bg-accent" style={{ width: `${Math.min(100, (p.t / p.d) * 100)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold">{found!.title.name}</div>
                    <div className="text-[13px] text-muted">{fmtTime(p.d - p.t)} left</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {rows.map((row) => (
          <section key={row.id} aria-labelledby={row.id}>
            <h2 id={row.id} className="mb-4 font-display text-2xl font-bold">
              {row.title}
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {row.ids.map((id, i) => (
                <div key={id} className="w-32 shrink-0 md:w-48">
                  <Card id={id} rank={row.id === "trending" ? i + 1 : undefined} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
