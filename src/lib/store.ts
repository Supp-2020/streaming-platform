"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Progress = { t: number; d: number; at: number };

type State = {
  progress: Record<string, Progress>; // keyed by episode id
  myList: string[]; // title ids
  autoplayNext: boolean;
  setProgress: (episodeId: string, t: number, d: number) => void;
  clearProgress: (episodeId: string) => void;
  toggleList: (titleId: string) => void;
  setAutoplayNext: (v: boolean) => void;
};

export const useStore = create<State>()(
  persist(
    (set) => ({
      progress: {},
      myList: [],
      autoplayNext: true,
      setProgress: (id, t, d) => set((s) => ({ progress: { ...s.progress, [id]: { t, d, at: Date.now() } } })),
      clearProgress: (id) =>
        set((s) => {
          const rest = { ...s.progress };
          delete rest[id];
          return { progress: rest };
        }),
      toggleList: (id) =>
        set((s) => ({ myList: s.myList.includes(id) ? s.myList.filter((x) => x !== id) : [...s.myList, id] })),
      setAutoplayNext: (v) => set({ autoplayNext: v }),
    }),
    { name: "kinora-v1", skipHydration: true },
  ),
);
