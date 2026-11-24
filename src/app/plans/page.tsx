"use client";
import Link from "next/link";
import Header from "@/components/Header";
import { useStore, type Billing } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

// Sample prices and limits for the demo. Replace with real values before launch.
const PLANS = [
  { name: "Basic", monthly: 4.99, quality: "720p", screens: 1, downloads: 1 },
  { name: "Standard", monthly: 9.99, quality: "1080p", screens: 2, downloads: 2, popular: true },
  { name: "Premium", monthly: 14.99, quality: "4K + HDR", screens: 4, downloads: 4 },
];
const YEARLY_FACTOR = 10; // 2 months free
const money = (n: number) => `$${n.toFixed(2)}`;

export default function PlansPage() {
  const ready = useHydrated();
  const storedPlan = useStore((s) => s.plan);
  const storedBilling = useStore((s) => s.billing);
  const set = useStore((s) => s.set);
  const plan = ready ? storedPlan : 1;
  const billing: Billing = ready ? storedBilling : "monthly";
  const price = (i: number) => (billing === "monthly" ? PLANS[i].monthly : PLANS[i].monthly * YEARLY_FACTOR);
  const subtotal = price(plan);
  const tax = subtotal * 0.08;

  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-[1344px] flex-wrap items-start gap-10 px-4 pb-20 pt-10 md:px-12">
        <div className="flex min-w-0 flex-[2_1_640px] flex-col gap-7">
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-semibold uppercase tracking-widest text-accent">Step 1 of 2</span>
            <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">Choose your plan</h1>
            <p className="text-base text-muted">Switch or cancel any time. This is a demo: nothing is charged.</p>
          </div>

          <div role="radiogroup" aria-label="Billing period" className="inline-flex self-start rounded-xl border border-[#8a8378] bg-surface p-1">
            {(["monthly", "yearly"] as const).map((b) => (
              <button key={b} role="radio" aria-checked={billing === b} onClick={() => set({ billing: b })} className={`h-11 rounded-lg px-5 text-[15px] font-semibold capitalize ${billing === b ? "bg-fg text-bg" : ""}`}>
                {b}
              </button>
            ))}
          </div>

          <div role="radiogroup" aria-label="Plan" className="grid gap-4 sm:grid-cols-3">
            {PLANS.map((p, i) => {
              const on = plan === i;
              return (
                <button key={p.name} role="radio" aria-checked={on} onClick={() => set({ plan: i })} className={`flex flex-col gap-4 rounded-2xl border-2 p-6 text-left ${on ? "border-accent bg-[#26231f]" : "border-[#4a453f] bg-surface"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-[22px] font-bold">{p.name}</span>
                    {p.popular && <span className="rounded bg-accent px-2 py-0.5 text-xs font-semibold text-[#1a1208]">Most popular</span>}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-display text-[32px] font-extrabold tracking-tight">{money(price(i))}</span>
                    <span className="text-sm text-muted">{billing === "monthly" ? "per month" : "per year · 2 months free"}</span>
                  </div>
                  <div className="h-px bg-line" />
                  <ul className="flex flex-col gap-3 text-sm leading-snug text-[#cfc9be]">
                    {[`Video quality: ${p.quality}`, `Watch on ${p.screens} ${p.screens === 1 ? "screen" : "screens"} at once`, `Download on ${p.downloads} ${p.downloads === 1 ? "device" : "devices"}`].map((f) => (
                      <li key={f} className="flex gap-2.5">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F0A04B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                          <path d="M5 12l5 5 9-10" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <span className={`mt-auto text-sm font-semibold ${on ? "text-accent" : "text-muted"}`}>{on ? "Selected" : "Choose plan"}</span>
                </button>
              );
            })}
          </div>
        </div>

        <aside aria-label="Order summary" className="flex min-w-0 flex-[1_1_320px] flex-col gap-4 rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-6">
          <h2 className="font-display text-xl font-bold">Order summary</h2>
          <dl className="flex flex-col gap-3 text-[15px]">
            <div className="flex justify-between"><dt className="text-muted">Plan</dt><dd className="font-semibold">{PLANS[plan].name}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Billing</dt><dd className="font-semibold capitalize">{billing}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{money(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Tax (sample 8%)</dt><dd>{money(tax)}</dd></div>
            <div className="h-px bg-line" />
            <div className="flex justify-between text-[17px]"><dt className="font-semibold">Total today</dt><dd className="font-bold">{money(subtotal + tax)}</dd></div>
          </dl>
          <Link href="/taste" className="flex h-[52px] items-center justify-center rounded-lg bg-accent text-base font-semibold text-[#1a1208]">
            Continue
          </Link>
          <p className="text-[13px] leading-normal text-muted">Sample prices, limits and tax. There is no payment step in this demo.</p>
        </aside>
      </main>
    </>
  );
}
