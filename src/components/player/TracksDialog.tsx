"use client";
import Link from "next/link";
import { useEffect, useReducer, useRef } from "react";
import type videojs from "video.js";

type VjsPlayer = ReturnType<typeof videojs>;
type AudioTrack = { label: string; language: string; kind: string; enabled: boolean };
type TextTrackLike = TextTrack;

const toArray = <T,>(list: { length: number }) => Array.from({ length: list.length }, (_, i) => (list as unknown as T[])[i]);

function Radio({ checked, onSelect, children }: { checked: boolean; onSelect: () => void; children: React.ReactNode }) {
  return (
    <button
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className={`flex min-h-12 items-center gap-3.5 rounded-lg px-3.5 py-3 text-left text-base hover:bg-line ${checked ? "font-semibold" : ""}`}
    >
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${checked ? "border-accent" : "border-[#8a8378]"}`}>
        <span className={`h-2 w-2 rounded-full ${checked ? "bg-accent" : "bg-transparent"}`} />
      </span>
      {children}
    </button>
  );
}

/** Audio and subtitle track picker, driven by the tracks the stream actually carries. */
export default function TracksDialog({ player, onClose }: { player: VjsPlayer; onClose: () => void }) {
  const [, refresh] = useReducer((n: number) => n + 1, 0);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = player.audioTracks();
    const text = player.textTracks();
    const events = ["change", "addtrack", "removetrack"];
    events.forEach((e) => {
      audio.addEventListener(e, refresh);
      text.addEventListener(e, refresh);
    });
    box.current?.focus({ preventScroll: true });
    // Video.js listens for keys on the player element; stop them here so Space/arrows don't control playback.
    const el = box.current;
    const stop = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "Escape") onClose();
    };
    el?.addEventListener("keydown", stop);
    return () => {
      events.forEach((e) => {
        audio.removeEventListener(e, refresh);
        text.removeEventListener(e, refresh);
      });
      el?.removeEventListener("keydown", stop);
    };
  }, [player, onClose]);

  const audio = toArray<AudioTrack>(player.audioTracks());
  const subs = toArray<TextTrackLike>(player.textTracks()).filter((t) => t.kind === "subtitles" || t.kind === "captions");
  const subsOff = subs.every((t) => t.mode !== "showing");

  const pickAudio = (i: number) => {
    const list = player.audioTracks() as unknown as AudioTrack[];
    toArray<AudioTrack>(list).forEach((t, j) => (t.enabled = j === i));
    refresh();
  };
  const pickSub = (i: number | null) => {
    subs.forEach((t, j) => (t.mode = j === i ? "showing" : "disabled"));
    refresh();
  };
  const name = (t: { label: string; language: string }, fallback: string) => t.label || t.language || fallback;

  return (
    // Fixed to the viewport (also works in fullscreen) so it isn't cramped inside a small phone-sized frame.
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-bg/80 p-4 text-fg">
      <div ref={box} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="tracks-title" className="flex max-h-full w-full max-w-[760px] flex-col gap-5 overflow-y-auto rounded-2xl border border-[#4a453f] bg-surface p-5 outline-none md:p-7">
        <h2 id="tracks-title" className="font-display text-[26px] font-bold tracking-tight">
          Audio &amp; subtitles
        </h2>
        <div className="grid gap-7 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <h3 id="ah" className="mb-1 ml-3.5 text-[13px] font-semibold uppercase tracking-widest text-muted">
              Audio
            </h3>
            <div role="radiogroup" aria-labelledby="ah" className="flex flex-col">
              {audio.length === 0 && <p className="px-3.5 py-3 text-[15px] text-muted">This stream has a single audio track.</p>}
              {audio.map((t, i) => (
                <Radio key={i} checked={t.enabled} onSelect={() => pickAudio(i)}>
                  {name(t, `Track ${i + 1}`)}
                  {t.kind === "description" && " (audio description)"}
                </Radio>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 id="sh" className="mb-1 ml-3.5 text-[13px] font-semibold uppercase tracking-widest text-muted">
              Subtitles
            </h3>
            <div role="radiogroup" aria-labelledby="sh" className="flex flex-col">
              <Radio checked={subsOff} onSelect={() => pickSub(null)}>
                Off
              </Radio>
              {subs.length === 0 && <p className="px-3.5 py-3 text-[15px] text-muted">This stream has no subtitles.</p>}
              {subs.map((t, i) => (
                <Radio key={i} checked={t.mode === "showing"} onSelect={() => pickSub(i)}>
                  {name(t, `Subtitles ${i + 1}`)}
                  {t.kind === "captions" && " (captions)"}
                </Radio>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <span className="text-[13px] text-muted">
            Subtitle size and style are in{" "}
            <Link href="/settings/subtitles" className="underline">
              Settings
            </Link>
            .
          </span>
          <button onClick={onClose} className="inline-flex h-12 items-center rounded-lg bg-accent px-7 text-[15px] font-semibold text-[#1a1208]">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
