"use client";
import { Panel, Section, inputCls } from "@/components/settings/ui";
import { PROFILES, profileInfo, useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

export default function ProfileSettings() {
  const ready = useHydrated();
  const names = useStore((s) => s.profileNames);
  const active = useStore((s) => s.profile);
  const set = useStore((s) => s.set);
  const shown = ready ? names : PROFILES.map((p) => p.name);

  return (
    <Section id="pr" title="Profiles" intro="Rename profiles and choose which one is active. Each profile shares this browser's list and progress in the demo.">
      <Panel>
        {PROFILES.map((p, i) => {
          const info = profileInfo(i, shown);
          const isKids = p.name === "Kids";
          return (
            <div key={p.name} className="flex flex-wrap items-center gap-4 p-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-display text-2xl font-extrabold" style={{ background: info.bg }}>
                {info.initial}
              </span>
              <div className="flex min-w-[200px] flex-1 flex-col gap-1.5">
                <label htmlFor={`pn-${i}`} className="text-sm text-muted">
                  {p.tag || `Profile ${i + 1}`}
                </label>
                <input
                  id={`pn-${i}`}
                  value={shown[i]}
                  maxLength={20}
                  disabled={isKids}
                  onChange={(e) => set({ profileNames: names.map((n, j) => (j === i ? e.target.value : n)) })}
                  onBlur={(e) => !e.target.value.trim() && set({ profileNames: names.map((n, j) => (j === i ? PROFILES[i].name : n)) })}
                  className={`${inputCls} disabled:opacity-60`}
                />
              </div>
              {ready && active === i ? (
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-[#1a1208]">Active</span>
              ) : (
                <button onClick={() => set({ profile: i })} className="h-11 rounded-lg border border-[#8a8378] px-4 text-sm font-semibold hover:bg-line">
                  Use this profile
                </button>
              )}
            </div>
          );
        })}
      </Panel>
    </Section>
  );
}
