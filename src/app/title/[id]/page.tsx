import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Art } from "@/components/Art";
import Header from "@/components/Header";
import ListButton from "@/components/ListButton";
import { getTitle, TITLES } from "@/lib/catalog";

export function generateStaticParams() {
  return TITLES.map((t) => ({ id: t.id }));
}

export default function TitlePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="h-72 animate-pulse bg-surface" />}>
      <TitleDetails params={params} />
    </Suspense>
  );
}

async function TitleDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = getTitle(id);
  if (!t) notFound();
  const seasons = [...new Set(t.episodes.map((e) => e.season))];

  return (
    <>
      <Header />
      <Art title={t} className="h-72" />
      <div className="mx-auto flex w-full max-w-[1344px] flex-wrap gap-12 px-6 pb-16 md:px-12">
        <div className="-mt-16 relative flex min-w-0 flex-[2_1_560px] flex-col gap-6">
          <h1 className="font-display text-5xl font-extrabold tracking-tight">{t.name}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            <span className="rounded border border-muted/60 px-2 py-0.5 font-semibold text-fg">{t.rating}</span>
            <span>{t.year}</span>·<span>{t.genres.join(", ")}</span>·<span>{t.badges.join(" · ")}</span>
          </div>
          <div className="flex gap-3">
            <Link href={`/watch/${t.episodes[0].id}`} className="flex h-[52px] items-center gap-2 rounded-lg bg-accent px-7 font-semibold text-[#1a1208]">
              ▶ Play
            </Link>
            <ListButton titleId={t.id} label />
          </div>
          <p className="max-w-2xl text-[17px] leading-relaxed text-[#cfc9be]">{t.synopsis}</p>

          {seasons.map((s) => (
            <section key={s} aria-label={`Season ${s}`}>
              <h2 className="mb-2 font-display text-xl font-bold">{t.kind === "series" ? `Season ${s}` : "Watch"}</h2>
              <ul className="flex flex-col gap-1">
                {t.episodes
                  .filter((e) => e.season === s)
                  .map((e) => (
                    <li key={e.id}>
                      <Link href={`/watch/${e.id}`} className="flex items-center gap-4 rounded-xl p-3 hover:bg-surface">
                        <span className="w-7 text-center font-display text-xl font-bold text-muted">{e.number}</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold">{e.name}</div>
                          <div className="text-sm text-muted">{e.summary}</div>
                        </div>
                        <span className="text-sm text-muted">{Math.round(e.duration / 60)} min</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
        <aside className="flex-[1_1_280px] pt-8">
          <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5 text-sm">
            <h2 className="font-display text-lg font-bold">Details</h2>
            <div><div className="text-muted">Cast</div>{t.cast.join(", ")}</div>
            <div><div className="text-muted">Genres</div>{t.genres.join(", ")}</div>
          </div>
        </aside>
      </div>
    </>
  );
}
