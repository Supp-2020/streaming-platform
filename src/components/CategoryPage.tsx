"use client";
import { PosterGrid } from "@/components/Card";
import Header from "@/components/Header";
import { TITLES, type Title } from "@/lib/catalog";
import { useAllowed } from "@/lib/parental";

export default function CategoryPage({ kind, heading }: { kind: Title["kind"]; heading: string }) {
  const allowed = useAllowed();
  const ids = TITLES.filter((t) => t.kind === kind && allowed(t.id)).map((t) => t.id);
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1344px] px-4 py-10 md:px-12">
        <h1 className="mb-1 font-display text-4xl font-extrabold tracking-tight md:text-5xl">{heading}</h1>
        <p className="mb-8 text-[15px] text-muted">{ids.length} titles</p>
        <PosterGrid ids={ids} />
      </main>
    </>
  );
}
