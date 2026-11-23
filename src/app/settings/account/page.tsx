"use client";
import Link from "next/link";
import { useState } from "react";
import { btnGhost, btnPrimary, inputCls, Panel, Section } from "@/components/settings/ui";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

export default function AccountSettings() {
  const ready = useHydrated();
  const email = useStore((s) => s.accountEmail);
  const set = useStore((s) => s.set);
  const resetAll = useStore((s) => s.resetAll);
  const [draft, setDraft] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const value = draft ?? (ready ? email : "");
  const valid = /^\S+@\S+\.\S+$/.test(value);

  return (
    <>
      <Section id="ac" title="Account" intro="Demo account: details stay in this browser and nothing is sent anywhere.">
        <Panel>
          <form
            className="flex flex-col gap-3 p-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (!valid) return;
              set({ accountEmail: value.trim() });
              setDraft(null);
              setMsg("Email saved.");
            }}
          >
            <label htmlFor="acct-email" className="text-sm font-medium">
              Email
            </label>
            <input id="acct-email" type="email" value={value} onChange={(e) => setDraft(e.target.value)} className={inputCls} aria-invalid={!valid} />
            <div className="flex items-center gap-4">
              <button type="submit" disabled={!valid || draft === null} className={btnPrimary}>
                Save email
              </button>
              <span role="status" className="text-sm text-muted">
                {!valid ? "Enter a valid email address." : msg}
              </span>
            </div>
          </form>
          <div className="flex items-center justify-between gap-4 p-5">
            <div>
              <div className="font-semibold">Password</div>
              <div className="text-sm text-muted">Not used in this demo.</div>
            </div>
            <button disabled className={`${btnGhost} opacity-50`}>
              Change
            </button>
          </div>
        </Panel>
      </Section>

      <Section id="plan" title="Plan">
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <div className="font-semibold">Standard</div>
              <div className="text-sm text-muted">Full HD, 2 screens at once. Sample plan, no billing.</div>
            </div>
            <span className="rounded-full border border-muted/60 px-3 py-1 text-xs font-semibold">Demo</span>
          </div>
        </Panel>
      </Section>

      <Section id="data" title="Your data in this browser" intro="Watch progress, My list and settings are saved only in this browser.">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              if (window.confirm("Reset all saved progress, My list and settings in this browser?")) {
                resetAll();
                setDraft(null);
                setMsg("");
              }
            }}
            className={btnGhost}
          >
            Reset saved data
          </button>
          <Link href="/signin" className={btnGhost}>
            Sign out
          </Link>
        </div>
      </Section>
    </>
  );
}
