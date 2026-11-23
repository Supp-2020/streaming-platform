"use client";
import Link from "next/link";
import { PROFILES, profileInfo, useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

export default function ProfilesPage() {
  const hydrated = useHydrated();
  const stored = useStore((s) => s.profile);
  const set = useStore((s) => s.set);
  const names = useStore((s) => s.profileNames);
  const sel = hydrated ? stored : 0;
  const nameOf = (i: number) => profileInfo(i, hydrated ? names : PROFILES.map((p) => p.name));

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-10 px-4 py-24">
      <Link href="/signin" className="absolute left-6 top-8 font-display text-2xl font-extrabold tracking-tight md:left-12">
        Kinora<span className="text-accent">.</span>
      </Link>

      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-[56px]">Who&apos;s watching?</h1>
        <p className="text-[17px] text-muted">Pick a profile to see your list, progress and recommendations.</p>
      </div>

      <div role="group" aria-label="Profiles" className="flex flex-wrap justify-center gap-6">
        {PROFILES.map((p, i) => (
          <button key={p.name} onClick={() => set({ profile: i })} aria-pressed={sel === i} className="flex w-40 flex-col items-center gap-4 p-3">
            <div
              className="relative flex h-[132px] w-[132px] items-center justify-center rounded-xl font-display text-[56px] font-extrabold"
              style={{ background: p.bg }}
            >
              {nameOf(i).initial}
              {sel === i &&
                ["-left-2 -top-2 border-l-[3px] border-t-[3px]", "-right-2 -top-2 border-r-[3px] border-t-[3px]", "-bottom-2 -left-2 border-b-[3px] border-l-[3px]", "-bottom-2 -right-2 border-b-[3px] border-r-[3px]"].map((c) => (
                  <span key={c} className={`absolute h-[18px] w-[18px] border-accent ${c}`} />
                ))}
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-base font-semibold">{nameOf(i).name}</span>
              <span className="min-h-4 text-[13px] text-muted">{p.tag}</span>
            </div>
          </button>
        ))}
        <button disabled title="Demo: adding profiles isn't built" className="flex w-40 flex-col items-center gap-4 p-3 opacity-60">
          <div className="flex h-[132px] w-[132px] items-center justify-center rounded-xl border border-[#8a8378]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <span className="text-base font-semibold">Add profile</span>
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/browse" className="flex h-[52px] items-center rounded-lg bg-accent px-8 text-base font-semibold text-[#1a1208]">
          Continue as {nameOf(sel).name}
        </Link>
        <Link href="/settings/profiles" className="flex h-[52px] items-center rounded-lg border border-[#8a8378] px-6 text-base font-semibold">
          Manage profiles
        </Link>
      </div>
    </div>
  );
}
