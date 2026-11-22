// Mock catalog. Streams are public test streams (Mux, Unified Streaming, Bitmovin/Blender, Apple).
// Artwork is generated from colors (no copyrighted images). Swap for a real API later.

export type Marker = { introStart?: number; introEnd?: number; creditsStart?: number };

export type Episode = {
  id: string;
  season: number;
  number: number;
  name: string;
  summary: string;
  src: string;
  duration: number; // seconds (approximate, for UI before metadata loads)
  markers?: Marker;
};

export type Title = {
  id: string;
  name: string;
  kind: "series" | "film" | "documentary";
  year: number;
  rating: string;
  genres: string[];
  synopsis: string;
  cast: string[];
  bg: string;
  fg: string;
  badges: string[];
  episodes: Episode[];
};

const STREAMS = {
  bbb: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  sintel: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
  tears: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
  apple: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
};

const ep = (
  titleId: string,
  season: number,
  number: number,
  name: string,
  summary: string,
  src: string,
  duration: number,
  markers?: Marker,
): Episode => ({ id: `${titleId}-s${season}e${number}`, season, number, name, summary, src, duration, markers });

export const TITLES: Title[] = [
  {
    id: "big-buck-bunny",
    name: "Big Buck Bunny",
    kind: "film",
    year: 2008,
    rating: "U",
    genres: ["Animation", "Comedy"],
    synopsis: "A giant rabbit with a heart bigger than himself takes on three bullying rodents. Blender Foundation open movie.",
    cast: ["Blender Foundation"],
    bg: "#2C4A43",
    fg: "#F0A04B",
    badges: ["HD"],
    episodes: [ep("big-buck-bunny", 1, 1, "Big Buck Bunny", "The full short film.", STREAMS.bbb, 596, { introStart: 2, introEnd: 12, creditsStart: 570 })],
  },
  {
    id: "sintel",
    name: "Sintel",
    kind: "film",
    year: 2010,
    rating: "12",
    genres: ["Fantasy", "Animation"],
    synopsis: "A lonely young woman searches for the baby dragon she befriended. Blender Foundation open movie.",
    cast: ["Blender Foundation"],
    bg: "#4A2F2F",
    fg: "#E9B44C",
    badges: ["HD", "Dolby"],
    episodes: [ep("sintel", 1, 1, "Sintel", "The full short film.", STREAMS.sintel, 888, { introStart: 3, introEnd: 15, creditsStart: 800 })],
  },
  {
    id: "tears-of-steel",
    name: "Tears of Steel",
    kind: "film",
    year: 2012,
    rating: "12",
    genres: ["Sci-Fi", "Action"],
    synopsis: "Warriors and scientists try to save the world from destructive robots. Blender Foundation open movie.",
    cast: ["Blender Foundation"],
    bg: "#2B3A55",
    fg: "#D9D2C3",
    badges: ["4K", "HDR"],
    episodes: [ep("tears-of-steel", 1, 1, "Tears of Steel", "The full short film.", STREAMS.tears, 734, { introStart: 2, introEnd: 10, creditsStart: 690 })],
  },
  {
    id: "test-pattern",
    name: "Signal Lost",
    kind: "series",
    year: 2024,
    rating: "16+",
    genres: ["Mystery", "Drama"],
    synopsis: "Demo series that cycles through public test streams so you can try intro skipping, next-episode and the episode list.",
    cast: ["Placeholder Cast"],
    bg: "#3B2F4A",
    fg: "#F0A04B",
    badges: ["4K", "HDR"],
    episodes: [
      ep("test-pattern", 1, 1, "Pilot", "Demo episode backed by Big Buck Bunny.", STREAMS.bbb, 596, { introStart: 5, introEnd: 20, creditsStart: 560 }),
      ep("test-pattern", 1, 2, "Second Signal", "Demo episode backed by Sintel.", STREAMS.sintel, 888, { introStart: 5, introEnd: 20, creditsStart: 800 }),
      ep("test-pattern", 1, 3, "Static", "Demo episode backed by Tears of Steel.", STREAMS.tears, 734, { introStart: 5, introEnd: 20, creditsStart: 690 }),
      ep("test-pattern", 2, 1, "Return", "Demo episode with multi-audio and subtitles (Apple bipbop).", STREAMS.apple, 1800, { introStart: 3, introEnd: 12 }),
    ],
  },
  {
    id: "bipbop",
    name: "Audio & Subtitles Lab",
    kind: "documentary",
    year: 2023,
    rating: "U",
    genres: ["Technology"],
    synopsis: "Apple's advanced HLS sample: multiple audio tracks, subtitles and renditions. Use it to test the track menus.",
    cast: ["Apple"],
    bg: "#4B4231",
    fg: "#2B3A55",
    badges: ["HD"],
    episodes: [ep("bipbop", 1, 1, "Advanced stream", "Multi-audio, multi-subtitle HLS sample.", STREAMS.apple, 1800)],
  },
];

export const ROWS = [
  { id: "trending", title: "Trending this week", ids: ["tears-of-steel", "test-pattern", "sintel", "big-buck-bunny", "bipbop"] },
  { id: "films", title: "Films", ids: ["big-buck-bunny", "sintel", "tears-of-steel"] },
  { id: "series", title: "Series & docs", ids: ["test-pattern", "bipbop"] },
];

export const getTitle = (id: string) => TITLES.find((t) => t.id === id);

export function getEpisode(episodeId: string) {
  for (const title of TITLES) {
    const i = title.episodes.findIndex((e) => e.id === episodeId);
    if (i >= 0) return { title, episode: title.episodes[i], next: title.episodes[i + 1] ?? null };
  }
  return null;
}

export const searchTitles = (q: string) => {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return TITLES.filter((t) => t.name.toLowerCase().includes(s) || t.genres.some((g) => g.toLowerCase().includes(s)));
};

export const fmtTime = (sec: number) => {
  if (!isFinite(sec)) return "0:00";
  const s = Math.floor(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${r}` : `${m}:${r}`;
};
