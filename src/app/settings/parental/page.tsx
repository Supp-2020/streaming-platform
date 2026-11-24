"use client";
import { useState } from "react";
import { btnGhost, Panel, RadioRows, Section, Switch } from "@/components/settings/ui";
import { TITLES, getTitle } from "@/lib/catalog";
import { TIERS } from "@/lib/parental";
import { PROFILES, profileInfo, useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

export default function ParentalSettings() {
  const ready = useHydrated();
  const names = useStore((s) => s.profileNames);
  const active = useStore((s) => s.profile);
  const all = useStore((s) => s.parental);
  const setParental = useStore((s) => s.setParental);
  const [picked, setPicked] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);

  const idx = picked ?? (ready ? active : 0);
  const prefs = all[idx] ?? { tier: 3, pinOn: false, pin: "", blocked: [] };
  const shown = ready ? names : PROFILES.map((p) => p.name);
  const blockable = TITLES.filter((t) => !prefs.blocked.includes(t.id));

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const chars = prefs.pin.padEnd(4, " ").split("");
    chars[i] = d || " ";
    setParental(idx, { pin: chars.join("") }); // empty digits are kept as spaces so positions stay aligned
    if (d) (document.getElementById(`pin-${i + 1}`) as HTMLInputElement | null)?.focus();
  };

  return (
    <>
      <Section
        id="pf"
        title="Parental controls"
        intro="Demo-grade: maturity level and blocked titles hide titles in lists and search (direct links still open). The PIN is saved unencrypted and isn't asked for yet."
      >
        <div className="flex items-center gap-3">
          <label htmlFor="prof" className="text-sm text-muted">
            Profile
          </label>
          <select id="prof" value={idx} onChange={(e) => setPicked(Number(e.target.value))} className="h-11 rounded-lg border border-[#8a8378] bg-surface px-3.5 text-[15px]">
            {PROFILES.map((_, i) => (
              <option key={i} value={i}>
                {profileInfo(i, shown).name}
              </option>
            ))}
          </select>
        </div>
      </Section>

      <Section id="mt" title="Maturity level" intro="Only titles at or below this level appear for this profile.">
        <RadioRows
          label="Maturity level"
          value={ready ? String(prefs.tier) : null}
          options={TIERS.map((t, i) => ({ value: String(i), label: t.label, help: t.help }))}
          onChange={(v) => setParental(idx, { tier: Number(v) })}
        />
      </Section>

      <Section id="pn" title="Profile PIN">
        <Panel>
          <div className="flex items-center justify-between gap-6 px-5 py-[18px]">
            <div className="flex flex-col gap-1">
              <span id="pn-label" className="text-base font-semibold">
                Profile PIN
              </span>
              <span className="text-sm leading-normal text-muted">Ask for a 4 digit PIN before leaving this profile or playing adult titles.</span>
            </div>
            <Switch id="pn-label" checked={ready && prefs.pinOn} onChange={(v) => setParental(idx, { pinOn: v })} />
          </div>
          {ready && prefs.pinOn && (
            <fieldset className="flex flex-col gap-2.5 px-5 py-5">
              <legend className="mb-2 text-sm font-medium">Enter a new PIN</legend>
              <div className="flex gap-2.5">
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    id={`pin-${i}`}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    autoComplete="off"
                    aria-label={`PIN digit ${i + 1}`}
                    value={(prefs.pin[i] ?? "").trim()}
                    onChange={(e) => setDigit(i, e.target.value)}
                    className="h-14 w-14 rounded-lg border border-[#8a8378] bg-bg text-center text-[22px]"
                  />
                ))}
              </div>
              <span className="text-[13px] text-muted">Avoid easy PINs like 1234. Don&apos;t reuse a real PIN: this demo stores it in plain text in your browser.</span>
            </fieldset>
          )}
        </Panel>
      </Section>

      <Section id="bt" title="Blocked titles">
        <div className="flex flex-wrap gap-2">
          {prefs.blocked.map((id) => (
            <span key={id} className="inline-flex h-11 items-center gap-1 rounded-full border border-[#8a8378] pl-4 pr-1.5 text-sm font-medium">
              {getTitle(id)?.name ?? id}
              <button onClick={() => setParental(idx, { blocked: prefs.blocked.filter((x) => x !== id) })} aria-label={`Unblock ${getTitle(id)?.name ?? id}`} className="flex h-8 w-8 items-center justify-center rounded-full">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </span>
          ))}
          <button onClick={() => setAdding(!adding)} aria-expanded={adding} className="h-11 rounded-full border border-dashed border-[#8a8378] px-[18px] text-sm font-medium">
            + Block a title
          </button>
        </div>
        {adding && (
          <Panel>
            {blockable.length === 0 && <p className="p-5 text-sm text-muted">Every title is already blocked.</p>}
            {blockable.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setParental(idx, { blocked: [...prefs.blocked, t.id] });
                  setAdding(false);
                }}
                className="flex min-h-11 items-center justify-between px-5 py-3 text-left hover:bg-line"
              >
                <span className="font-semibold">{t.name}</span>
                <span className="text-sm capitalize text-muted">
                  {t.kind} · {t.rating}
                </span>
              </button>
            ))}
            <div className="p-3">
              <button onClick={() => setAdding(false)} className={btnGhost}>
                Cancel
              </button>
            </div>
          </Panel>
        )}
      </Section>
    </>
  );
}
