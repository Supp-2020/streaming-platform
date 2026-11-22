import { Suspense } from "react";
import { notFound } from "next/navigation";
import WatchClient from "@/components/player/WatchClient";
import { getEpisode, TITLES } from "@/lib/catalog";

export function generateStaticParams() {
  return TITLES.flatMap((t) => t.episodes.map((e) => ({ id: e.id })));
}

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="h-screen bg-black" />}>
      <Watch params={params} />
    </Suspense>
  );
}

async function Watch({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = getEpisode(id);
  if (!found) notFound();
  return <WatchClient title={found.title} episode={found.episode} next={found.next} />;
}
