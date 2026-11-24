/** Generated placeholder artwork (no copyrighted images). Only needs the title's two colors. */
export function Art({ title, className = "" }: { title: { bg: string; fg: string }; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: title.bg }} aria-hidden="true">
      <div className="absolute rounded-full" style={{ background: title.fg, width: "70%", paddingBottom: "70%", right: "-15%", top: "-25%" }} />
      <div className="absolute bottom-0 left-[12%] h-[60%] w-[34%] rounded-t-full bg-bg" />
    </div>
  );
}
