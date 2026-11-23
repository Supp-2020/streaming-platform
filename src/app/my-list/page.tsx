"use client";
import Link from "next/link";
import { useState } from "react";
import { Art } from "@/components/Art";
import { Card, Pill } from "@/components/Card";
import Header from "@/components/Header";
import { getTitle } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

const FILTERS = [
  { label: "All", kind: null },
  { label: "Series", kind: "series" },
  { label: "Films", kind: "film" },
  { label: "Documentaries", kind: "documentary" },
] as const;

export default function MyListPage() {
  const hydrated = useHydrated();
  const myList = useStore((s) => s.myList);
  const removeFromList = useStore((s) => s.removeFromList);
  const addToList = useStore((s) => s.addToList);

  const [editing, setEditing] = useState(false);
  const [sel, setSel] = useState<string[]>([]);
  const [filter, setFilter] = useState(0);
  const [lastRemoved, setLastRemoved] = useState<string[]>([]);

  const all = hydrated ? myList : [];
  const kind = FILTERS[filter].kind;
  const visible = all.filter((id) => !kind || getTitle(id)?.kind === kind);

  const toggleSel = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const remove = () => {
    removeFromList(sel);
    setLastRemoved(sel);
    setSel([]);
    setEditing(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-[1344px] flex-1 flex-col gap-7 px-4 pb-24 pt-10 md:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">My list</h1>
            <span role="status" className="text-[15px] text-muted">
              {all.length === 0 ? "No titles" : `${all.length} ${all.length === 1 ? "title" : "titles"}${editing ? " · Select titles to remove them" : ""}`}
            </span>
          </div>
          {all.length > 0 && (
            <div className="flex items-center gap-2">
              {editing && (
                <button onClick={() => setSel(visible)} className="h-12 px-5 text-[15px] font-semibold">
                  Select all
                </button>
              )}
              <button
                onClick={() => {
                  setEditing(!editing);
                  setSel([]);
                }}
                className="h-12 rounded-lg border border-[#8a8378] px-6 text-[15px] font-semibold"
              >
                {editing ? "Done" : "Edit list"}
              </button>
            </div>
          )}
        </div>

        <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-2">
          {FILTERS.map((f, i) => (
            <Pill key={f.label} active={filter === i} onClick={() => setFilter(i)}>
              {f.label}
            </Pill>
          ))}
        </div>

        {hydrated && visible.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#8a8378] px-4 py-24 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#A8A196" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 4h12v17l-6-4-6 4z" />
            </svg>
            <h2 className="font-display text-2xl font-bold">{all.length === 0 ? "Your list is empty" : "Nothing here yet"}</h2>
            <p className="max-w-sm text-[15px] leading-relaxed text-muted">
              {all.length === 0 ? "Add series and films with the plus button and they will wait for you here." : "No titles of this type are on your list. Try another filter."}
            </p>
            <Link href="/browse" className="mt-2 flex h-12 items-center rounded-lg bg-accent px-6 text-[15px] font-semibold text-[#1a1208]">
              Browse titles
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {visible.map((id) => {
            const t = getTitle(id)!;
            if (!editing) return <Card key={id} id={id} />;
            const on = sel.includes(id);
            return (
              <button key={id} onClick={() => toggleSel(id)} aria-pressed={on} aria-label={`${on ? "Deselect" : "Select"} ${t.name}`} className="flex flex-col gap-3 p-2 text-left">
                <div className="relative w-full">
                  <Art title={t} className="aspect-[2/3] w-full rounded-[10px]" />
                  {on && (
                    <>
                      {["-left-2 -top-2 border-l-[3px] border-t-[3px]", "-right-2 -top-2 border-r-[3px] border-t-[3px]", "-bottom-2 -left-2 border-b-[3px] border-l-[3px]", "-bottom-2 -right-2 border-b-[3px] border-r-[3px]"].map((c) => (
                        <span key={c} className={`absolute h-[18px] w-[18px] border-accent ${c}`} />
                      ))}
                    </>
                  )}
                  <span className={`absolute right-2.5 top-2.5 flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 text-[#1a1208] ${on ? "border-accent bg-accent" : "border-fg bg-bg/70"}`}>
                    {on && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12l5 5 9-10" />
                      </svg>
                    )}
                  </span>
                </div>
                <div>
                  <div className="text-[15px] font-semibold">{t.name}</div>
                  <div className="text-[13px] capitalize text-muted">{t.kind}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pointer-events-none fixed inset-x-0 bottom-6 flex justify-center px-4">
          {editing && sel.length > 0 && (
            <div role="region" aria-label="Selection actions" className="pointer-events-auto flex items-center gap-4 rounded-2xl border border-[#8a8378] bg-[#302c27] py-2.5 pl-6 pr-2.5">
              <span role="status" className="whitespace-nowrap text-[15px] font-semibold">
                {sel.length} selected
              </span>
              <button onClick={() => setSel([])} className="h-11 px-4 text-[15px] font-semibold">
                Clear
              </button>
              <button onClick={remove} className="h-11 rounded-lg bg-accent px-5 text-[15px] font-semibold text-[#1a1208]">
                Remove from list
              </button>
            </div>
          )}
          {!editing && lastRemoved.length > 0 && (
            <div role="status" className="pointer-events-auto flex items-center gap-4 rounded-2xl border border-[#8a8378] bg-[#302c27] py-2.5 pl-6 pr-2.5">
              <span className="whitespace-nowrap text-[15px]">
                {lastRemoved.length} {lastRemoved.length === 1 ? "title" : "titles"} removed
              </span>
              <button
                onClick={() => {
                  addToList(lastRemoved);
                  setLastRemoved([]);
                }}
                className="h-11 px-4 text-[15px] font-semibold text-accent"
              >
                Undo
              </button>
              <button onClick={() => setLastRemoved([])} aria-label="Dismiss" className="flex h-11 w-11 items-center justify-center rounded-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
