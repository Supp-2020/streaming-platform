"use client";
import { useState } from "react";
import { Panel, Section } from "@/components/settings/ui";

type Device = { id: string; name: string; where: string; last: string; current?: boolean };

// Sample data: there is no backend, so these are illustrative.
const INITIAL: Device[] = [
  { id: "this", name: "This browser", where: "Current session", last: "Active now", current: true },
  { id: "tv", name: "Living room TV", where: "Smart TV app", last: "2 days ago" },
  { id: "phone", name: "Phone", where: "Mobile browser", last: "Last week" },
  { id: "tablet", name: "Tablet", where: "Tablet app", last: "3 weeks ago" },
];

export default function DeviceSettings() {
  const [devices, setDevices] = useState(INITIAL);
  const [removed, setRemoved] = useState<Device | null>(null);

  return (
    <Section id="dv" title="Devices" intro="Devices signed in to your account. Sample data for the demo.">
      <Panel>
        {devices.map((d) => (
          <div key={d.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-line" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="12" rx="2" />
                  <path d="M8 20h8M12 16v4" />
                </svg>
              </span>
              <div>
                <div className="font-semibold">
                  {d.name}
                  {d.current && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-[#1a1208]">This device</span>}
                </div>
                <div className="text-sm text-muted">
                  {d.where} · {d.last}
                </div>
              </div>
            </div>
            {!d.current && (
              <button
                onClick={() => {
                  setDevices(devices.filter((x) => x.id !== d.id));
                  setRemoved(d);
                }}
                className="h-11 rounded-lg border border-[#8a8378] px-4 text-sm font-semibold hover:bg-line"
              >
                Sign out
              </button>
            )}
          </div>
        ))}
        {devices.length === 1 && <p className="p-5 text-sm text-muted">No other devices are signed in.</p>}
      </Panel>

      {removed && (
        <div role="status" className="flex items-center gap-4 self-start rounded-2xl border border-[#8a8378] bg-[#302c27] py-2.5 pl-6 pr-2.5">
          <span className="text-[15px]">{removed.name} signed out</span>
          <button
            onClick={() => {
              setDevices(INITIAL.filter((x) => x.id === removed.id || devices.some((y) => y.id === x.id)));
              setRemoved(null);
            }}
            className="h-11 px-4 text-[15px] font-semibold text-accent"
          >
            Undo
          </button>
        </div>
      )}
    </Section>
  );
}
