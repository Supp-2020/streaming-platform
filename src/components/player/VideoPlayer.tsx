"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import videojs from "video.js";
import "videojs-contrib-quality-menu";
import type { Marker } from "@/lib/catalog";

type VjsPlayer = ReturnType<typeof videojs>;

export type VideoPlayerProps = {
  src: string;
  title: string;
  subtitle?: string;
  poster?: string;
  startAt?: number;
  markers?: Marker;
  hasNext: boolean;
  autoplayNext: boolean;
  onAutoplayNextChange: (v: boolean) => void;
  onProgress: (t: number, d: number) => void;
  onNext: () => void;
  skipIntroEnabled: boolean;
  quality: "auto" | "saver" | "high" | "max";
  captions: {
    size: "small" | "medium" | "large";
    color: "white" | "yellow";
    bg: "none" | "dim" | "solid";
    defaultOn: boolean;
    lang: string;
  };
};

type QualityLevel = { height?: number; enabled: boolean };
type QualityLevels = { length: number; [i: number]: QualityLevel; on: (e: string, f: () => void) => void; off: (e: string, f: () => void) => void };
type WithPlugins = { qualityLevels?: () => QualityLevels; textTrackSettings?: { setValues: (v: object) => void; updateDisplay: () => void } };

const MAX_HEIGHT = { auto: Infinity, max: Infinity, high: 1080, saver: 480 };
const CAPTION_PERCENT = { small: "0.75", medium: "1.00", large: "1.50" };
const CAPTION_COLOR = { white: "#FFF", yellow: "#FF0" };
const CAPTION_BG_OPACITY = { none: "0", dim: "0.5", solid: "1" };

const MAX_RETRIES = 3;
const NEXT_COUNTDOWN = 8;

/** Mount with `key={episodeId}` so per-episode state resets on episode change. */
export default function VideoPlayer(props: VideoPlayerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VjsPlayer | null>(null);
  const [playerEl, setPlayerEl] = useState<Element | null>(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ended, setEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const retries = useRef(0);
  const lastSave = useRef(0);

  // Keep latest props in a ref so player callbacks never go stale.
  const latest = useRef(props);
  useEffect(() => {
    latest.current = props;
  });

  // ---- create / destroy the Video.js player once ----
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const video = document.createElement("video-js");
    video.classList.add("vjs-big-play-centered", "kinora-player");
    video.setAttribute("aria-label", "Video player");
    host.appendChild(video);

    const player = videojs(video, {
      controls: true,
      preload: "auto",
      fill: true,
      playsinline: true,
      playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
      controlBar: {
        skipButtons: { backward: 10, forward: 10 },
        pictureInPictureToggle: true,
        remainingTimeDisplay: true,
        currentTimeDisplay: true,
        timeDivider: true,
        durationDisplay: false,
      },
      userActions: { hotkeys },
      html5: { vhs: { overrideNative: true } },
    });
    playerRef.current = player;

    try {
      (player as unknown as { qualityMenu: () => void }).qualityMenu();
    } catch {
      /* quality menu is optional */
    }

    player.on("timeupdate", () => {
      const t = player.currentTime() ?? 0;
      const d = player.duration() ?? 0;
      setTime(Math.floor(t));
      if (isFinite(d)) setDuration(d);
      if (Date.now() - lastSave.current > 5000 && d > 0) {
        lastSave.current = Date.now();
        latest.current.onProgress(t, d);
      }
    });
    player.on("pause", () => {
      const d = player.duration() ?? 0;
      if (d > 0) latest.current.onProgress(player.currentTime() ?? 0, d);
    });
    player.on("playing", () => {
      retries.current = 0;
      setError(null);
      setEnded(false);
    });
    player.on("ended", () => setEnded(true));
    player.on("error", () => {
      // Error recovery: retry with backoff, then give up.
      if (retries.current < MAX_RETRIES) {
        retries.current += 1;
        const at = player.currentTime() ?? 0;
        setError(`Connection problem. Retrying (${retries.current}/${MAX_RETRIES})…`);
        setTimeout(() => {
          if (player.isDisposed()) return;
          player.error(null);
          player.src({ src: latest.current.src, type: "application/x-mpegURL" });
          player.one("loadedmetadata", () => player.currentTime(at));
          player.play()?.catch(() => {});
        }, 1000 * retries.current);
      } else {
        setError("Playback failed. Check your connection and try again.");
      }
    });
    player.ready(() => setPlayerEl(player.el()));

    // Media Session API: hardware keys + lock screen.
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => void player.play());
      navigator.mediaSession.setActionHandler("pause", () => player.pause());
      navigator.mediaSession.setActionHandler("seekbackward", () => void player.currentTime((player.currentTime() ?? 0) - 10));
      navigator.mediaSession.setActionHandler("seekforward", () => void player.currentTime((player.currentTime() ?? 0) + 10));
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        if (latest.current.hasNext) latest.current.onNext();
      });
    }

    return () => {
      const d = player.duration() ?? 0;
      if (d > 0) latest.current.onProgress(player.currentTime() ?? 0, d);
      setPlayerEl(null);
      playerRef.current = null;
      player.dispose();
    };
  }, []);

  // ---- load source ----
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    retries.current = 0;
    player.poster(props.poster ?? "");
    player.src({ src: props.src, type: "application/x-mpegURL" });
    player.one("loadedmetadata", () => {
      const start = latest.current.startAt ?? 0;
      const d = player.duration() ?? 0;
      if (start > 5 && (!isFinite(d) || start < d - 10)) player.currentTime(start); // resume
    });
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: props.title, artist: "Kinora", album: props.subtitle ?? "" });
    }
  }, [props.src, props.poster, props.title, props.subtitle]);

  // ---- apply saved settings: caption size and quality cap ----
  const { captions, quality } = props;
  useEffect(() => {
    const p = playerRef.current as unknown as WithPlugins | null;
    if (!p?.textTrackSettings) return;
    try {
      p.textTrackSettings.setValues({
        fontPercent: CAPTION_PERCENT[captions.size],
        color: CAPTION_COLOR[captions.color],
        backgroundColor: "#000",
        backgroundOpacity: CAPTION_BG_OPACITY[captions.bg],
      });
      p.textTrackSettings.updateDisplay();
    } catch {
      /* optional */
    }
  }, [captions.size, captions.color, captions.bg, playerEl]);

  // Turn on a matching subtitle track by default when the stream offers one.
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !playerEl || !captions.defaultOn) return;
    const list = player.textTracks();
    const pick = () => {
      let chosen = false;
      for (let i = 0; i < list.length; i++) {
        const t = (list as unknown as TextTrack[])[i];
        if ((t.kind === "subtitles" || t.kind === "captions") && !chosen && t.language?.toLowerCase().startsWith(captions.lang)) {
          t.mode = "showing";
          chosen = true;
        }
      }
    };
    pick();
    list.addEventListener("addtrack", pick);
    return () => list.removeEventListener("addtrack", pick);
  }, [captions.defaultOn, captions.lang, playerEl]);

  useEffect(() => {
    const ql = (playerRef.current as unknown as WithPlugins | null)?.qualityLevels?.();
    if (!ql) return;
    const cap = MAX_HEIGHT[quality];
    const apply = () => {
      const levels = Array.from({ length: ql.length }, (_, i) => ql[i]);
      const allowed = levels.filter((l) => !l.height || l.height <= cap);
      const useCap = allowed.length > 0; // never disable every level
      levels.forEach((l) => (l.enabled = useCap ? allowed.includes(l) : true));
    };
    apply();
    ql.on("addqualitylevel", apply);
    return () => ql.off("addqualitylevel", apply);
  }, [quality, playerEl]);

  // ---- overlays (rendered inside the player element so they survive fullscreen) ----
  const m = props.markers;
  const creditsAt = m?.creditsStart ?? (duration > 0 ? duration - 20 : Infinity);
  const nearEnd = props.hasNext && !dismissed && (ended || time >= creditsAt);
  const showSkipIntro = props.skipIntroEnabled && m?.introStart !== undefined && m.introEnd !== undefined && time >= m.introStart && time < m.introEnd;

  const overlay = (
    <>
      {showSkipIntro && (
        <button
          onClick={() => playerRef.current?.currentTime(m!.introEnd!)}
          className="absolute bottom-24 left-6 z-20 rounded-lg border border-fg/60 bg-bg/80 px-5 py-3 text-sm font-semibold text-fg backdrop-blur hover:bg-fg hover:text-bg"
        >
          Skip intro
        </button>
      )}
      {nearEnd && (
        <UpNext
          autoplay={props.autoplayNext}
          onAutoplayChange={props.onAutoplayNextChange}
          onPlay={props.onNext}
          onDismiss={() => setDismissed(true)}
        />
      )}
      {error && (
        <div role="alert" className="absolute left-1/2 top-6 z-20 -translate-x-1/2 rounded-lg bg-bg/90 px-4 py-2 text-sm text-fg">
          {error}
        </div>
      )}
    </>
  );

  return (
    <div className="relative h-full w-full bg-black">
      <div data-vjs-player ref={hostRef} className="h-full w-full" />
      {playerEl && createPortal(overlay, playerEl)}
    </div>
  );
}

function UpNext(props: {
  autoplay: boolean;
  onAutoplayChange: (v: boolean) => void;
  onPlay: () => void;
  onDismiss: () => void;
}) {
  const { autoplay, onPlay } = props;
  const [left, setLeft] = useState(NEXT_COUNTDOWN);
  useEffect(() => {
    const id = setInterval(() => setLeft((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (left <= 0 && autoplay) onPlay();
  }, [left, autoplay, onPlay]);

  return (
    <div className="absolute bottom-24 right-6 z-20 flex w-72 flex-col gap-3 rounded-xl border border-[#3a3631] bg-surface p-4 text-fg shadow-xl">
      <span className="text-xs text-muted">Up next{autoplay ? ` in ${Math.max(0, left)}s` : ""}</span>
      <div className="flex gap-2">
        <button onClick={props.onPlay} className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-[#1a1208]">
          Play next
        </button>
        <button onClick={props.onDismiss} className="rounded-lg border border-muted/60 px-3 py-2.5 text-sm">
          Stay
        </button>
      </div>
      <label className="flex items-center gap-2 text-xs text-muted">
        <input type="checkbox" checked={autoplay} onChange={(e) => props.onAutoplayChange(e.target.checked)} />
        Autoplay next episode
      </label>
    </div>
  );
}

/** Keyboard shortcuts: Space/K, J/L ±10s, ←/→ ±5s, ↑/↓ volume, M mute, F fullscreen, C captions, 0-9 jump. */
function hotkeys(this: VjsPlayer, e: KeyboardEvent) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias -- Video.js calls this handler with the player as `this`
  const player = this;
  const key = e.key.toLowerCase();
  const seek = (delta: number) => player.currentTime(Math.max(0, (player.currentTime() ?? 0) + delta));
  const vol = (delta: number) => player.volume(Math.min(1, Math.max(0, (player.volume() ?? 0) + delta)));
  const togglePlay = () => {
    if (player.paused()) void player.play();
    else player.pause();
  };

  const actions: Record<string, () => void> = {
    " ": togglePlay,
    k: togglePlay,
    j: () => seek(-10),
    l: () => seek(10),
    arrowleft: () => seek(-5),
    arrowright: () => seek(5),
    arrowup: () => vol(0.05),
    arrowdown: () => vol(-0.05),
    m: () => player.muted(!player.muted()),
    f: () => {
      if (player.isFullscreen()) player.exitFullscreen();
      else player.requestFullscreen();
    },
    c: () => {
      const list = player.textTracks();
      for (let i = 0; i < list.length; i++) {
        const t = (list as unknown as TextTrack[])[i];
        if (t.kind === "captions" || t.kind === "subtitles") t.mode = t.mode === "showing" ? "disabled" : "showing";
      }
    },
  };
  for (let n = 0; n <= 9; n++) {
    actions[String(n)] = () => {
      const d = player.duration() ?? 0;
      if (isFinite(d)) player.currentTime((d * n) / 10);
    };
  }

  const act = actions[key];
  if (act) {
    e.preventDefault();
    e.stopPropagation();
    act();
  }
}
