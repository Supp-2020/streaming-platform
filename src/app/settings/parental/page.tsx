"use client";
import { useState } from "react";
import { btnGhost, btnPrimary, inputCls, Panel, RadioRows, Section } from "@/components/settings/ui";
import { useStore, type MaxRating } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

const RATINGS: { value: MaxRating; label: string; help: string }[] = [
  { value: "U", label: "U", help: "Suitable for all ages." },
  { value: "12", label: "12 and under", help: "Up to 12 rated titles." },
  { value: "16+", label: "16+", help: "Up to 16+ rated titles." },
  { value: "18", label: "All titles", help: "Everything, including 18-rated." },
];

export default function ParentalSettings() {
  const ready = useHydrated();
  const maxRating = useStore((s) => s.maxRating);
  const pin = useStore((s) => s.pin);
  const set = useStore((s) => s.set);
  const [draft, setDraft] = useState("");
  const [msg, setMsg] = useState("");

  const valid = /^\d{4}$/.test(draft);
  const hasPin = ready && pin.length === 4;

  return (
    <>
      <Section
        id="pc"
        title="Parental controls"
        intro="Demo-grade only: these preferences are saved in this browser but are not enforced anywhere yet, and the PIN is stored unencrypted. Don't reuse a real PIN."
      >
        <RadioRows label="Maximum rating" value={ready ? maxRating : null} options={RATINGS} onChange={(v) => set({ maxRating: v })} />
      </Section>

      <Section id="pin" title="Profile PIN" intro="A 4-digit PIN you could require before switching to an adult profile.">
        <Panel>
          <form
            className="flex flex-col gap-3 p-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (!valid) return;
              set({ pin: draft });
              setDraft("");
              setMsg("PIN saved.");
            }}
          >
            <label htmlFor="pin-in" className="text-sm font-medium">
              {hasPin ? "Change PIN" : "Set a PIN"}
            </label>
            <input
              id="pin-in"
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              value={draft}
              onChange={(e) => setDraft(e.target.value.replace(/\D/g, ""))}
              placeholder="4 digits"
              className={`${inputCls} max-w-[200px] tracking-[0.4em]`}
            />
            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" disabled={!valid} className={btnPrimary}>
                {hasPin ? "Update PIN" : "Save PIN"}
              </button>
              {hasPin && (
                <button
                  type="button"
                  onClick={() => {
                    set({ pin: "" });
                    setMsg("PIN removed.");
                  }}
                  className={btnGhost}
                >
                  Remove PIN
                </button>
              )}
              <span role="status" className="text-sm text-muted">
                {msg || (hasPin ? "A PIN is set." : "No PIN set.")}
              </span>
            </div>
          </form>
        </Panel>
      </Section>
    </>
  );
}
