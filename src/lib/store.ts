"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Progress = { t: number; d: number; at: number };

export type Quality = "auto" | "saver" | "high" | "max";
export type CaptionSize = "small" | "medium" | "large";
export type CaptionColor = "white" | "yellow";
export type CaptionBg = "none" | "dim" | "solid";
export type MaxRating = "U" | "12" | "16+" | "18";

export const PROFILES = [
  { name: "Alex", bg: "#2B3A55", tag: "Main profile" },
  { name: "Sam", bg: "#4A2F2F", tag: "" },
  { name: "Jo", bg: "#2C4A43", tag: "" },
  { name: "Kids", bg: "#4B4231", tag: "Ages up to 12" },
];

type Prefs = {
  profile: number; // index into PROFILES
  profileNames: string[];
  accountEmail: string;
  autoplayNext: boolean;
  previews: boolean;
  skipIntro: boolean;
  quality: Quality;
  captionsDefault: boolean;
  subLang: string; // BCP-47 prefix, e.g. "en"
  captionSize: CaptionSize;
  captionColor: CaptionColor;
  captionBg: CaptionBg;
  maxRating: MaxRating;
  pin: string; // demo-grade only: stored in plain text in this browser
};

type State = Prefs & {
  progress: Record<string, Progress>; // keyed by episode id
  myList: string[]; // title ids
  setProgress: (episodeId: string, t: number, d: number) => void;
  clearProgress: (episodeId: string) => void;
  toggleList: (titleId: string) => void;
  removeFromList: (titleIds: string[]) => void;
  addToList: (titleIds: string[]) => void;
  set: (patch: Partial<Prefs>) => void;
  resetAll: () => void;
};

const defaults: Prefs = {
  profile: 0,
  profileNames: PROFILES.map((p) => p.name),
  accountEmail: "alex@example.com",
  autoplayNext: true,
  previews: false,
  skipIntro: true,
  quality: "auto",
  captionsDefault: false,
  subLang: "en",
  captionSize: "medium",
  captionColor: "white",
  captionBg: "dim",
  maxRating: "18",
  pin: "",
};

export const useStore = create<State>()(
  persist(
    (set) => ({
      ...defaults,
      progress: {},
      myList: [],
      setProgress: (id, t, d) => set((s) => ({ progress: { ...s.progress, [id]: { t, d, at: Date.now() } } })),
      clearProgress: (id) =>
        set((s) => {
          const rest = { ...s.progress };
          delete rest[id];
          return { progress: rest };
        }),
      toggleList: (id) =>
        set((s) => ({ myList: s.myList.includes(id) ? s.myList.filter((x) => x !== id) : [...s.myList, id] })),
      removeFromList: (ids) => set((s) => ({ myList: s.myList.filter((x) => !ids.includes(x)) })),
      addToList: (ids) => set((s) => ({ myList: [...s.myList, ...ids.filter((x) => !s.myList.includes(x))] })),
      set: (patch) => set(patch),
      resetAll: () => set({ ...defaults, progress: {}, myList: [] }),
    }),
    { name: "kinora-v1", skipHydration: true },
  ),
);

/** Current profile's display name and initial (falls back to defaults before hydration). */
export function profileInfo(profile: number, names: string[]) {
  const name = names[profile] || PROFILES[profile].name;
  return { name, initial: name.charAt(0).toUpperCase() || "?", bg: PROFILES[profile].bg };
}
