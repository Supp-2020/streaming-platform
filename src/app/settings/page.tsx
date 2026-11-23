"use client";
import { RadioRows, Panel, Section, ToggleRow } from "@/components/settings/ui";
import { useStore, type Quality } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

const QUALITIES: { value: Quality; label: string; help: string }[] = [
  { value: "auto", label: "Auto", help: "Adjusts to your connection. Recommended." },
  { value: "saver", label: "Data saver", help: "Uses the least data. Caps playback at 480p." },
  { value: "high", label: "High", help: "Full HD where available (up to 1080p)." },
  { value: "max", label: "Maximum", help: "Highest rendition the stream offers." },
];

export default function PlaybackSettings() {
  const ready = useHydrated();
  const s = useStore();

  return (
    <>
      <Section id="pb" title="Playback">
        <Panel>
          <ToggleRow id="lbl-auto" label="Autoplay next episode" help="The next episode starts after a short countdown you can cancel." checked={ready && s.autoplayNext} onChange={(v) => s.set({ autoplayNext: v })} />
          <ToggleRow id="lbl-prev" label="Autoplay previews while browsing" help="Off by default. Preview playback is not built yet in this demo." checked={ready && s.previews} onChange={(v) => s.set({ previews: v })} />
          <ToggleRow id="lbl-skip" label="Show Skip intro button" help="Appears during title sequences. You choose whether to skip." checked={ready && s.skipIntro} onChange={(v) => s.set({ skipIntro: v })} />
        </Panel>
      </Section>
      <Section id="qt" title="Streaming quality">
        <RadioRows label="Streaming quality" value={ready ? s.quality : null} options={QUALITIES} onChange={(v) => s.set({ quality: v })} />
      </Section>
    </>
  );
}
