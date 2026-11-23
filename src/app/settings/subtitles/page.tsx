"use client";
import { Panel, Section, ToggleRow } from "@/components/settings/ui";
import { Pill } from "@/components/Card";
import { useStore, type CaptionBg, type CaptionColor, type CaptionSize } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

const LANGS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "hi", label: "Hindi" },
];

const SIZES: { value: CaptionSize; label: string; px: string }[] = [
  { value: "small", label: "Small", px: "16px" },
  { value: "medium", label: "Medium", px: "22px" },
  { value: "large", label: "Large", px: "30px" },
];
const COLORS: { value: CaptionColor; label: string; css: string }[] = [
  { value: "white", label: "White", css: "#F3EFE8" },
  { value: "yellow", label: "Yellow", css: "#FFE14D" },
];
const BGS: { value: CaptionBg; label: string; css: string }[] = [
  { value: "none", label: "None", css: "transparent" },
  { value: "dim", label: "Dim", css: "rgba(11,10,9,0.6)" },
  { value: "solid", label: "Solid", css: "#0b0a09" },
];

function PillGroup<T extends string>({ label, value, options, onChange }: { label: string; value: T | null; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Pill key={o.value} role="radio" aria-checked={value === o.value} active={value === o.value} onClick={() => onChange(o.value)}>
          {o.label}
        </Pill>
      ))}
    </div>
  );
}

export default function SubtitleSettings() {
  const ready = useHydrated();
  const s = useStore();
  const size = SIZES.find((x) => x.value === s.captionSize)!;
  const color = COLORS.find((x) => x.value === s.captionColor)!;
  const bg = BGS.find((x) => x.value === s.captionBg)!;

  return (
    <>
      <Section id="sb" title="Subtitles" intro="Subtitle tracks only appear on streams that include them (try “Audio & Subtitles Lab”).">
        <Panel>
          <ToggleRow id="lbl-cc" label="Turn subtitles on by default" help="Shows a subtitle track automatically when one matches your language." checked={ready && s.captionsDefault} onChange={(v) => s.set({ captionsDefault: v })} />
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-[18px]">
            <label htmlFor="sublang" className="text-base font-semibold">
              Preferred language
            </label>
            <select id="sublang" value={ready ? s.subLang : "en"} onChange={(e) => s.set({ subLang: e.target.value })} className="h-11 rounded-lg border border-[#8a8378] bg-bg px-3.5 text-[15px]">
              {LANGS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </Panel>
      </Section>

      <Section id="style" title="Subtitle style">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted">Size</span>
            <PillGroup label="Caption size" value={ready ? s.captionSize : null} options={SIZES} onChange={(v) => s.set({ captionSize: v })} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted">Text color</span>
            <PillGroup label="Caption color" value={ready ? s.captionColor : null} options={COLORS} onChange={(v) => s.set({ captionColor: v })} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted">Background</span>
            <PillGroup label="Caption background" value={ready ? s.captionBg : null} options={BGS} onChange={(v) => s.set({ captionBg: v })} />
          </div>
          <div role="img" aria-label="Subtitle preview" className="relative flex h-[200px] items-end justify-center overflow-hidden rounded-xl bg-[#2b3a55] pb-7">
            <div className="absolute -top-14 right-14 h-[220px] w-[220px] rounded-full bg-accent" />
            <span className="relative rounded px-3.5 py-1 font-medium leading-snug" style={{ fontSize: size.px, color: color.css, background: bg.css }}>
              Sample subtitle line
            </span>
          </div>
        </div>
      </Section>
    </>
  );
}
