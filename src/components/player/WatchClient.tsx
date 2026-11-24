"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ListButton from "@/components/ListButton";
import type { Episode, Title } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import VideoPlayer from "./VideoPlayer";

export default function WatchClient({ title, episode, next }: { title: Title; episode: Episode; next: Episode | null }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const saved = useStore((s) => s.progress[episode.id]);
  const autoplayNext = useStore((s) => s.autoplayNext);
  const skipIntro = useStore((s) => s.skipIntro);
  const quality = useStore((s) => s.quality);
  const captionSize = useStore((s) => s.captionSize);
  const captionColor = useStore((s) => s.captionColor);
  const captionBg = useStore((s) => s.captionBg);
  const captionsDefault = useStore((s) => s.captionsDefault);
  const subLang = useStore((s) => s.subLang);
  const set = useStore((s) => s.set);
  const setProgress = useStore((s) => s.setProgress);
  const clearProgress = useStore((s) => s.clearProgress);

  const isSeries = title.kind === "series";
  const label = isSeries ? `S${episode.season} · E${episode.number} · ${episode.name}` : undefined;

  return (
    <div className="min-h-screen bg-bg">
      <header className="flex items-center gap-4 px-4 py-3 md:px-12">
        <Link href={`/title/${title.id}`} aria-label="Back to title" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-fg/50">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </Link>
        <div className="min-w-0">
          <div className="truncate font-display text-lg font-bold">{title.name}</div>
          {label && <div className="truncate text-sm text-muted">{label}</div>}
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] pb-16 sm:px-4 md:px-12">
        {/* Standard 16:9 frame */}
        <div className="aspect-video w-full overflow-hidden bg-black sm:rounded-xl">
          {hydrated ? (
            <VideoPlayer
              key={episode.id}
              src={episode.src}
              title={title.name}
              subtitle={label}
              startAt={saved && saved.t < saved.d - 15 ? saved.t : 0}
              markers={episode.markers}
              hasNext={!!next}
              autoplayNext={autoplayNext}
              onAutoplayNextChange={(v) => set({ autoplayNext: v })}
              skipIntroEnabled={skipIntro}
              quality={quality}
              captions={{ size: captionSize, color: captionColor, bg: captionBg, defaultOn: captionsDefault, lang: subLang }}
              onProgress={(t, d) => (d - t < 15 ? clearProgress(episode.id) : setProgress(episode.id, t, d))}
              onNext={() => next && router.push(`/watch/${next.id}`)}
            />
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-8 px-4 sm:px-0">
          <div className="flex min-w-0 flex-[2_1_420px] flex-col gap-4">
            <h1 className="font-display text-3xl font-extrabold tracking-tight">{isSeries ? episode.name : title.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
              <span className="rounded border border-muted/60 px-2 py-0.5 font-semibold text-fg">{title.rating}</span>
              <span>{title.year}</span>·<span>{title.genres.join(", ")}</span>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-[#cfc9be]">{isSeries ? episode.summary : title.synopsis}</p>
            <div className="flex flex-wrap gap-3">
              <ListButton titleId={title.id} label />
              {next && (
                <Link href={`/watch/${next.id}`} className="flex h-[52px] items-center rounded-lg border border-muted/60 px-5 font-semibold hover:bg-line">
                  Next episode
                </Link>
              )}
            </div>
          </div>

          {isSeries && (
            <aside aria-label="Episodes" className="flex min-w-0 flex-[1_1_300px] flex-col gap-2">
              <h2 className="font-display text-lg font-bold">Episodes</h2>
              <ul className="flex flex-col gap-1">
                {title.episodes.map((e) => (
                  <li key={e.id}>
                    <Link
                      href={`/watch/${e.id}`}
                      aria-current={e.id === episode.id ? "true" : undefined}
                      className={`flex min-h-14 items-center gap-3 rounded-xl px-3 py-2 ${e.id === episode.id ? "bg-surface shadow-[inset_3px_0_0_#F0A04B]" : "hover:bg-surface"}`}
                    >
                      <span className="w-12 shrink-0 text-sm text-muted">
                        S{e.season}·E{e.number}
                      </span>
                      <span className="truncate text-[15px] font-medium">{e.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}
