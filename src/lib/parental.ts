"use client";
import { getTitle } from "./catalog";
import { useStore } from "./store";
import { useHydrated } from "./useHydrated";

const RATING_RANK: Record<string, number> = { U: 0, "12": 1, "16+": 2, "18": 3 };

export const TIERS = [
  { label: "Little kids", help: "Titles made for the youngest viewers (U)." },
  { label: "Older kids", help: "Adds titles rated 12 for children who follow longer stories." },
  { label: "Teens", help: "Adds titles rated 16+. No 18-rated content." },
  { label: "Adults", help: "Everything in the catalogue." },
];

/** Returns a predicate: is this title allowed for the active profile? Hides titles in lists and search. */
export function useAllowed() {
  const ready = useHydrated();
  const profile = useStore((s) => s.profile);
  const prefs = useStore((s) => s.parental[s.profile]);
  return (titleId: string) => {
    if (!ready || !prefs) return true;
    const t = getTitle(titleId);
    if (!t) return false;
    if (prefs.blocked.includes(titleId)) return false;
    return (RATING_RANK[t.rating] ?? 3) <= prefs.tier && profile >= 0;
  };
}
