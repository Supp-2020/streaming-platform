"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Art } from "@/components/Art";
import ListButton from "@/components/ListButton";
import { getEpisode, getTitle, ROWS, fmtTime } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

export default function BrowseClient() {
  const hydrated = useHydrated();
  const onlyList = useSearchParams().get("list") === "1";
  const progress = useStore((s) => s.progress);
  const myList = useStore((s) => s.myList);

  const featured = getTitle("tears-of-steel")!;
  const featuredEp = featured.episodes[0];

  const continueItems = hydrated
    ? Object.entries(progress)
        .sort((a, b) => b[1].at - a[1].at)
        .map(([id, p]) => ({ p, found: getEpisode(id) }))
        .filter((x) => x.found)
    : [];

  if (onlyList) {
    const items = myList.map(getTitle).filter(Boolean);
    return (
      <main className="mx-auto w-full max-w-[1344px] px-6 py-10 md:px-12">
        <h1 className="mb-6 font-display text-3xl font-bold">My list</h1>
        {!hydrated ? null : items.length === 0 ? (
          <p className="text-muted">Nothing here yet. Add titles with the + button.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {items.map((t) => (
              <Card key={t!.id} id={t!.id} />
            ))}
          </div>
        )}
      </main>
    );
  }

  return (
    <>
      <section aria-label="Featured" className="mx-auto flex w-full max-w-[1344px] flex-wrap gap-10 px-6 pb-14 pt-10 md:px-12">
        <div className="flex min-w-0 flex-[1_1_440px] flex-col justify-center gap-5">
          <div className="text-[13px] font-semibold uppercase tracking-widest text-accent">Featured</div>
          <h1 className="font-display text-5xl font-extrabold leading-none tracking-tight md:text-7xl">{featured.name}</h1>
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
        <Art title={featured} className="min-h-[360px] flex-[1.3_1_520px] rounded-2xl" />
      </section>

      <main className="mx-auto flex w-full max-w-[1344px] flex-col gap-12 px-6 pb-16 md:px-12">
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

        {ROWS.map((row) => (
          <section key={row.id} aria-labelledby={row.id}>
            <h2 id={row.id} className="mb-4 font-display text-2xl font-bold">
              {row.title}
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {row.ids.map((id, i) => (
                <div key={id} className="w-40 shrink-0 md:w-48">
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

function Card({ id, rank }: { id: string; rank?: number }) {
  const t = getTitle(id)!;
  return (
    <Link href={`/title/${t.id}`} className="group flex flex-col gap-2.5">
      <div className="relative">
        <Art title={t} className="aspect-[2/3] rounded-[10px] transition-transform group-hover:scale-[1.03]" />
        {rank && <span className="absolute left-3 top-3 min-w-9 rounded-md bg-fg px-1.5 text-center font-display text-2xl font-extrabold text-bg">{rank}</span>}
      </div>
      <div>
        <div className="text-sm font-semibold">{t.name}</div>
        <div className="text-[13px] capitalize text-muted">
          {t.kind} · {t.genres[0]}
        </div>
      </div>
    </Link>
  );
}
