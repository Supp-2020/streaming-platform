"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Episode, Title } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import VideoPlayer from "./VideoPlayer";

export default function WatchClient({ title, episode, next }: { title: Title; episode: Episode; next: Episode | null }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const saved = useStore((s) => s.progress[episode.id]);
  const autoplayNext = useStore((s) => s.autoplayNext);
  const setAutoplayNext = useStore((s) => s.setAutoplayNext);
  const setProgress = useStore((s) => s.setProgress);
  const clearProgress = useStore((s) => s.clearProgress);

  if (!hydrated) return <div className="h-screen bg-black" />; // wait for saved position

  const label = title.kind === "series" ? `S${episode.season} · E${episode.number} · ${episode.name}` : undefined;

  return (
    <div className="relative h-screen w-screen bg-black">
      <Link
        href={`/title/${title.id}`}
        aria-label="Back to title"
        className="absolute left-4 top-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-fg/50 bg-bg/70 text-fg backdrop-blur"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </Link>
      <div className="pointer-events-none absolute left-20 top-5 z-30">
        <div className="font-display text-lg font-bold">{title.name}</div>
        {label && <div className="text-sm text-muted">{label}</div>}
      </div>
      <VideoPlayer
        key={episode.id}
        src={episode.src}
        title={title.name}
        subtitle={label}
        startAt={saved && saved.t < saved.d - 15 ? saved.t : 0}
        markers={episode.markers}
        hasNext={!!next}
        autoplayNext={autoplayNext}
        onAutoplayNextChange={setAutoplayNext}
        onProgress={(t, d) => (d - t < 15 ? clearProgress(episode.id) : setProgress(episode.id, t, d))}
        onNext={() => next && router.push(`/watch/${next.id}`)}
      />
    </div>
  );
}
