import Header from "@/components/Header";
import SettingsShell from "@/components/settings/SettingsShell";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <SettingsShell>{children}</SettingsShell>
    </>
  );
}
