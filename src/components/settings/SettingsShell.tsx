"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { href: "/settings/account", label: "Account" },
  { href: "/settings/profiles", label: "Profiles" },
  { href: "/settings", label: "Playback" },
  { href: "/settings/subtitles", label: "Subtitles" },
  { href: "/settings/devices", label: "Devices" },
  { href: "/settings/parental", label: "Parental controls" },
];

export default function SettingsShell({ children }: { children: React.ReactNode }) {
  const path = usePathname().replace(/\/$/, "");
  const link = "rounded-lg px-4 py-3 text-[15px] font-medium text-muted hover:text-fg";

  return (
    <div className="mx-auto flex max-w-[1344px] flex-wrap items-start gap-12 px-4 pb-20 pt-10 md:px-12">
      <nav aria-label="Settings sections" className="flex w-full flex-col gap-1 md:w-[260px] md:shrink-0">
        <h1 className="mb-4 font-display text-4xl font-extrabold tracking-tight">Settings</h1>
        <div className="flex gap-1 overflow-x-auto md:flex-col">
          {SECTIONS.map((s) => {
            const active = path === s.href;
            return (
              <Link
                key={s.href}
                href={s.href}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 rounded-lg px-4 py-3 text-[15px] ${active ? "bg-surface font-semibold text-fg shadow-[inset_3px_0_0_#F0A04B]" : "font-medium text-muted hover:text-fg"}`}
              >
                {s.label}
              </Link>
            );
          })}
        </div>
        <Link href="/profiles" className={`mt-4 ${link}`}>
          Switch profile
        </Link>
        <Link href="/signin" className={link}>
          Sign out
        </Link>
      </nav>
      <main className="flex min-w-0 flex-[1_1_560px] flex-col gap-10">{children}</main>
    </div>
  );
}
