type ArtTitle = { bg: string; fg: string; image?: string; imagePos?: string };

/**
 * Card artwork. Titles with an `image` show that picture; the rest show generated
 * shape artwork (kept on purpose for some titles, no copyrighted images needed).
 */
export function Art({ title, className = "" }: { title: ArtTitle; className?: string }) {
  if (title.image) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ background: title.bg }} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export; base path is added manually */}
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${title.image}`}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: title.imagePos ?? "50% 50%" }}
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: title.bg }} aria-hidden="true">
      <div className="absolute rounded-full" style={{ background: title.fg, width: "70%", paddingBottom: "70%", right: "-15%", top: "-25%" }} />
      <div className="absolute bottom-0 left-[12%] h-[60%] w-[34%] rounded-t-full bg-bg" />
    </div>
  );
}
