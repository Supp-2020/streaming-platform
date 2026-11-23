// Mock catalog. Streams are public test streams (Mux, Longtail/JW, Unified Streaming, Apple).
// Each URL was checked to respond with HTTP 200 on 2026-11-23, but third-party hosts can go away.
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
  bbb: { src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", duration: 596 }, // Big Buck Bunny (Mux)
  bbbFull: { src: "https://playertest.longtailvideo.com/adaptive/bbbfull/bbbfull.m3u8", duration: 596 },
  elephants: { src: "https://playertest.longtailvideo.com/adaptive/elephants_dream_v4/index.m3u8", duration: 654 },
  tears: { src: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", duration: 734 },
  muxTest: { src: "https://test-streams.mux.dev/test_001/stream.m3u8", duration: 300 },
  muxPts: { src: "https://test-streams.mux.dev/pts_shift/master.m3u8", duration: 300 },
  appleAdv: { src: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8", duration: 1800 },
  appleTs: { src: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8", duration: 1800 },
  apple169: { src: "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8", duration: 1800 },
  apple43: { src: "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8", duration: 1800 },
};
type Stream = (typeof STREAMS)[keyof typeof STREAMS];

const INTRO: Marker = { introStart: 4, introEnd: 20 };

/** Build episodes from [season, name, summary, stream] tuples; numbering restarts each season. */
function episodes(titleId: string, list: [number, string, string, Stream][], markers: Marker = INTRO): Episode[] {
  const counts: Record<number, number> = {};
  return list.map(([season, name, summary, stream]) => {
    const number = (counts[season] = (counts[season] ?? 0) + 1);
    return {
      id: `${titleId}-s${season}e${number}`,
      season,
      number,
      name,
      summary,
      src: stream.src,
      duration: stream.duration,
      markers: { ...markers, creditsStart: Math.max(30, stream.duration - 35) },
    };
  });
}

export const TITLES: Title[] = [
  // ---- Films ----
  {
    id: "big-buck-bunny",
    name: "Big Buck Bunny",
    kind: "film",
    year: 2008,
    rating: "U",
    genres: ["Animation", "Comedy", "Family"],
    synopsis: "A giant rabbit with a heart bigger than himself takes on three bullying rodents. Blender Foundation open movie.",
    cast: ["Blender Foundation"],
    bg: "#2C4A43",
    fg: "#F0A04B",
    badges: ["HD"],
    episodes: episodes("big-buck-bunny", [[1, "Big Buck Bunny", "The full short film.", STREAMS.bbb]], { introStart: 2, introEnd: 12 }),
  },
  {
    id: "elephants-dream",
    name: "Elephants Dream",
    kind: "film",
    year: 2006,
    rating: "12",
    genres: ["Sci-Fi", "Fantasy", "Animation"],
    synopsis: "Two strange characters explore a capricious and seemingly infinite machine. The first Blender Foundation open movie.",
    cast: ["Blender Foundation"],
    bg: "#4A2F2F",
    fg: "#E9B44C",
    badges: ["HD"],
    episodes: episodes("elephants-dream", [[1, "Elephants Dream", "The full short film.", STREAMS.elephants]], { introStart: 3, introEnd: 14 }),
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
    episodes: episodes("tears-of-steel", [[1, "Tears of Steel", "The full short film.", STREAMS.tears]], { introStart: 2, introEnd: 10 }),
  },
  {
    id: "bunny-extended",
    name: "Big Buck Bunny: Director's Cut",
    kind: "film",
    year: 2008,
    rating: "U",
    genres: ["Animation", "Family"],
    synopsis: "Demo title that plays the same film from a second host, handy for comparing stream sources.",
    cast: ["Blender Foundation"],
    bg: "#4B4231",
    fg: "#F0A04B",
    badges: ["HD"],
    episodes: episodes("bunny-extended", [[1, "Director's Cut", "Same film, different CDN.", STREAMS.bbbFull]], { introStart: 2, introEnd: 12 }),
  },

  // ---- Series (demo episodes cycle through test streams) ----
  {
    id: "test-pattern",
    name: "Signal Lost",
    kind: "series",
    year: 2024,
    rating: "16+",
    genres: ["Mystery", "Drama", "Sci-Fi"],
    synopsis: "A radio engineer chases a signal that shouldn't exist. Demo series: try intro skip, next episode and the season list.",
    cast: ["Placeholder Cast"],
    bg: "#3B2F4A",
    fg: "#F0A04B",
    badges: ["4K", "HDR"],
    episodes: episodes("test-pattern", [
      [1, "Pilot", "A strange transmission interrupts the night shift.", STREAMS.bbb],
      [1, "Second Signal", "The source moves, and so does the engineer.", STREAMS.elephants],
      [1, "Static", "Nothing on the dial is what it seems.", STREAMS.tears],
      [2, "Return", "Months later, the signal comes back louder.", STREAMS.muxTest],
      [2, "Feedback", "A familiar voice answers.", STREAMS.muxPts],
    ]),
  },
  {
    id: "neon-harbor",
    name: "Neon Harbor",
    kind: "series",
    year: 2025,
    rating: "18",
    genres: ["Thriller", "Crime"],
    synopsis: "A dockside detective untangles a smuggling ring where every witness has a second identity.",
    cast: ["Placeholder Cast"],
    bg: "#2B3A55",
    fg: "#F0A04B",
    badges: ["HD", "Dolby"],
    episodes: episodes("neon-harbor", [
      [1, "Low Tide", "A body surfaces at Pier 9.", STREAMS.tears],
      [1, "False Manifest", "The cargo records don't add up.", STREAMS.bbbFull],
      [1, "Night Shift", "A witness vanishes before dawn.", STREAMS.elephants],
      [2, "High Tide", "The ring changes hands.", STREAMS.muxPts],
    ]),
  },
  {
    id: "the-long-night",
    name: "The Long Night",
    kind: "series",
    year: 2023,
    rating: "12",
    genres: ["Fantasy", "Adventure", "Family"],
    synopsis: "Four friends travel through a city that only exists after midnight.",
    cast: ["Placeholder Cast"],
    bg: "#2C4A43",
    fg: "#D9D2C3",
    badges: ["HD"],
    episodes: episodes("the-long-night", [
      [1, "Midnight", "The clocks stop at 12:00.", STREAMS.elephants],
      [1, "The Quiet Streets", "Nobody else is awake.", STREAMS.bbb],
      [1, "Lantern Market", "A trade that costs a memory.", STREAMS.muxTest],
    ]),
  },
  {
    id: "orbit-city",
    name: "Orbit City",
    kind: "series",
    year: 2025,
    rating: "12",
    genres: ["Sci-Fi", "Action", "Comedy"],
    synopsis: "The maintenance crew of a space station keeps the lights on while everyone else saves the galaxy.",
    cast: ["Placeholder Cast"],
    bg: "#35404A",
    fg: "#E9B44C",
    badges: ["4K"],
    episodes: episodes("orbit-city", [
      [1, "Airlock", "A leak on day one.", STREAMS.tears],
      [1, "Zero Gravity Day", "The crew's day off goes sideways.", STREAMS.muxPts],
    ]),
  },

  // ---- Documentaries ----
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
    episodes: episodes("bipbop", [[1, "Advanced stream (fMP4)", "Multi-audio, multi-subtitle HLS sample.", STREAMS.appleAdv]], { introStart: 3, introEnd: 12 }),
  },
  {
    id: "test-card-chronicles",
    name: "Test Card Chronicles",
    kind: "documentary",
    year: 2022,
    rating: "U",
    genres: ["Technology", "History"],
    synopsis: "How streaming video gets from a server to your screen, told through the test patterns engineers use.",
    cast: ["Apple", "Mux"],
    bg: "#3B2F4A",
    fg: "#E9B44C",
    badges: ["HD"],
    episodes: episodes("test-card-chronicles", [
      [1, "Widescreen", "16:9 adaptive renditions.", STREAMS.apple169],
      [1, "Classic 4:3", "Legacy aspect ratio variants.", STREAMS.apple43],
      [1, "Transport Streams", "MPEG-TS segments with subtitles.", STREAMS.appleTs],
    ]),
  },
];

export const ROWS = [
  { id: "trending", title: "Trending this week", ids: ["tears-of-steel", "test-pattern", "neon-harbor", "big-buck-bunny", "orbit-city", "elephants-dream", "the-long-night", "bipbop"] },
  { id: "new", title: "New releases", ids: ["orbit-city", "neon-harbor", "bunny-extended", "test-card-chronicles"] },
  { id: "films", title: "Films", ids: ["big-buck-bunny", "elephants-dream", "tears-of-steel", "bunny-extended"] },
  { id: "series", title: "Series", ids: ["test-pattern", "neon-harbor", "the-long-night", "orbit-city"] },
  { id: "scifi", title: "Sci-Fi & Fantasy", ids: ["tears-of-steel", "elephants-dream", "orbit-city", "test-pattern", "the-long-night"] },
  { id: "family", title: "Family", ids: ["big-buck-bunny", "bunny-extended", "the-long-night"] },
  { id: "docs", title: "Documentaries", ids: ["bipbop", "test-card-chronicles"] },
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
