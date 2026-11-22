"use client";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

export default function ListButton({ titleId, label = false }: { titleId: string; label?: boolean }) {
  const hydrated = useHydrated();
  const inList = useStore((s) => s.myList.includes(titleId));
  const toggle = useStore((s) => s.toggleList);
  const on = hydrated && inList;
  return (
    <button
      onClick={() => toggle(titleId)}
      aria-pressed={on}
      aria-label={on ? "Remove from my list" : "Add to my list"}
      className="flex h-[52px] items-center justify-center gap-2 rounded-lg border border-muted/60 px-4 font-semibold hover:bg-line"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d={on ? "M5 12l5 5 9-10" : "M12 5v14M5 12h14"} />
      </svg>
      {label && (on ? "In my list" : "My list")}
    </button>
  );
}
