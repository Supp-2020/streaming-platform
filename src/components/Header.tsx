"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PROFILES, profileInfo, useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

const NAV = [
  { href: "/browse", label: "Home" },
  { href: "/series", label: "Series" },
  { href: "/films", label: "Films" },
  { href: "/new-hot", label: "New & Hot" },
  { href: "/my-list", label: "My list" },
  { href: "/downloads", label: "Downloads" },
];

const menuItem = "flex min-h-11 items-center gap-3 px-4 py-2.5 text-left text-[15px] hover:bg-line";

function ProfileMenu() {
  const hydrated = useHydrated();
  const profile = useStore((s) => s.profile);
  const names = useStore((s) => s.profileNames);
  const set = useStore((s) => s.set);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = profileInfo(hydrated ? profile : 0, hydrated ? names : PROFILES.map((p) => p.name));

  return (
    <div ref={box} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Profile menu, ${current.name}`}
        className="flex h-11 items-center gap-1.5 rounded-full pr-2"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-[15px] font-bold text-[#1a1208]">{current.initial}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div role="menu" aria-label="Profile" className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-[#3a3631] bg-surface py-2 shadow-2xl">
          <div className="flex flex-col">
            {PROFILES.map((p, i) => {
              const info = profileInfo(i, names);
              return (
                <button
                  key={p.name}
                  role="menuitemradio"
                  aria-checked={i === profile}
                  onClick={() => {
                    set({ profile: i });
                    setOpen(false);
                  }}
                  className={menuItem}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold" style={{ background: info.bg }}>
                    {info.initial}
                  </span>
                  <span className="flex-1">{info.name}</span>
                  {i === profile && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F0A04B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12l5 5 9-10" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
          <div className="my-2 h-px bg-line" />
          <Link role="menuitem" href="/settings" onClick={() => setOpen(false)} className={menuItem}>
            Settings
          </Link>
          <Link role="menuitem" href="/settings/account" onClick={() => setOpen(false)} className={menuItem}>
            Account
          </Link>
          <Link role="menuitem" href="/profiles" onClick={() => setOpen(false)} className={menuItem}>
            Switch profile
          </Link>
          <div className="my-2 h-px bg-line" />
          <Link role="menuitem" href="/signin" onClick={() => setOpen(false)} className={`${menuItem} text-muted`}>
            Sign out
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const path = usePathname().replace(/\/$/, "");

  return (
    <header className="flex flex-wrap items-center gap-x-10 gap-y-2 border-b border-line px-4 py-4 md:px-12">
      <Link href="/browse" className="font-display text-2xl font-extrabold tracking-tight">
        Kinora<span className="text-accent">.</span>
      </Link>
      <nav aria-label="Primary" className="order-last flex w-full gap-1 overflow-x-auto md:order-none md:w-auto md:flex-1">
        {NAV.map((n) => {
          const active = path === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 px-4 py-3 text-[15px] ${active ? "border-b-2 border-accent font-semibold text-fg" : "font-medium text-muted hover:text-fg"}`}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="ml-auto flex items-center gap-2 md:ml-0">
        <Link href="/search" aria-label="Search" className="flex h-11 w-11 items-center justify-center rounded-full border border-muted/60 hover:bg-line">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
        </Link>
        <ProfileMenu />
      </div>
    </header>
  );
}
