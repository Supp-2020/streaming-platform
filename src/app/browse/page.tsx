import { Suspense } from "react";
import BrowseClient from "@/components/BrowseClient";
import Header from "@/components/Header";

export default function BrowsePage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="mx-auto h-96 w-full max-w-[1344px] animate-pulse rounded-2xl bg-surface" />}>
        <BrowseClient />
      </Suspense>
    </>
  );
}
