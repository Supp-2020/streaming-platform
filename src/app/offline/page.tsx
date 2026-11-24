"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OfflinePage() {
  const router = useRouter();
  const [tries, setTries] = useState(0);

  const retry = () => {
    if (navigator.onLine) router.push("/browse");
    else setTries(tries + 1);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-5 px-4 text-center">
      <Link href="/browse" className="absolute left-6 top-8 font-display text-2xl font-extrabold tracking-tight md:left-12">
        Kinora<span className="text-accent">.</span>
      </Link>
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#A8A196" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 8.8a15 15 0 0119.9 0M5 12.5a10.5 10.5 0 0114 0M8.5 16.2a5.5 5.5 0 017 0" />
        <circle cx="12" cy="19.5" r="0.8" fill="#A8A196" />
        <path d="M3 3l18 18" />
      </svg>
      <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-[44px]">You are offline</h1>
      <p role="status" className="max-w-[460px] text-[17px] leading-relaxed text-muted">
        {tries === 0 ? "Check your Wi-Fi or mobile data. Anything you downloaded is still available to watch." : "Still no connection. Your downloads are available while you reconnect."}
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-3">
        <button onClick={retry} className="h-[52px] rounded-lg bg-accent px-8 text-base font-semibold text-[#1a1208]">
          {tries === 0 ? "Try again" : `Try again (${tries})`}
        </button>
        <Link href="/downloads" className="inline-flex h-[52px] items-center rounded-lg border border-[#8a8378] px-7 text-base font-semibold">
          Go to Downloads
        </Link>
      </div>
    </div>
  );
}
