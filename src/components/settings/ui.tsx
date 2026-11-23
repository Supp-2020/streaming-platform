"use client";
import type { ReactNode } from "react";

export function Switch({ id, checked, onChange }: { id: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button role="switch" aria-checked={checked} aria-labelledby={id} onClick={() => onChange(!checked)} className="flex h-11 w-14 shrink-0 items-center">
      <span className={`relative h-[30px] w-[52px] rounded-full border-2 ${checked ? "border-accent bg-accent" : "border-[#8a8378]"}`}>
        <span className={`absolute top-[3px] h-5 w-5 rounded-full transition-all ${checked ? "left-6 bg-[#1a1208]" : "left-[3px] bg-[#cfc9be]"}`} />
      </span>
    </button>
  );
}

export function Section({ id, title, intro, children }: { id: string; title: string; intro?: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 id={id} className="font-display text-2xl font-bold">
          {title}
        </h2>
        {intro && <p className="text-sm text-muted">{intro}</p>}
      </div>
      {children}
    </section>
  );
}

/** Bordered list container; children are rows separated by dividers. */
export function Panel({ children }: { children: ReactNode }) {
  return <div className="flex flex-col divide-y divide-line rounded-xl border border-line bg-surface">{children}</div>;
}

export function ToggleRow({ id, label, help, checked, onChange }: { id: string; label: string; help: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-6 px-5 py-[18px]">
      <div className="flex flex-col gap-1">
        <span id={id} className="text-base font-semibold">
          {label}
        </span>
        <span className="max-w-[520px] text-sm leading-normal text-muted">{help}</span>
      </div>
      <Switch id={id} checked={checked} onChange={onChange} />
    </div>
  );
}

export function RadioRows<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | null;
  options: { value: T; label: string; help?: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-col divide-y divide-line rounded-xl border border-line bg-surface">
      {options.map((o) => {
        const on = value === o.value;
        return (
          <button key={o.value} role="radio" aria-checked={on} onClick={() => onChange(o.value)} className="flex min-h-11 items-center gap-4 px-5 py-4 text-left">
            <span className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 ${on ? "border-accent" : "border-[#8a8378]"}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${on ? "bg-accent" : "bg-transparent"}`} />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-base font-semibold">{o.label}</span>
              {o.help && <span className="text-sm text-muted">{o.help}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export const inputCls = "h-12 w-full rounded-lg border border-[#8a8378] bg-bg px-4 text-base text-fg placeholder:text-muted";
export const btnPrimary = "inline-flex h-12 items-center justify-center rounded-lg bg-accent px-6 text-[15px] font-semibold text-[#1a1208] disabled:opacity-50";
export const btnGhost = "inline-flex h-12 items-center justify-center rounded-lg border border-[#8a8378] px-6 text-[15px] font-semibold hover:bg-line";
