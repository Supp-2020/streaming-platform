import Link from "next/link";
import { Art } from "@/components/Art";
import { getTitle } from "@/lib/catalog";

export function Card({ id, rank }: { id: string; rank?: number }) {
  const t = getTitle(id)!;
  return (
    <Link href={`/title/${t.id}`} className="group flex flex-col gap-2.5 p-1">
      <div className="relative">
        <Art title={t} className="aspect-[2/3] rounded-[10px] transition-transform group-hover:scale-[1.03]" />
        {rank && <span className="absolute left-3 top-3 min-w-9 rounded-md bg-fg px-1.5 text-center font-display text-2xl font-extrabold text-bg">{rank}</span>}
      </div>
      <div>
        <div className="text-sm font-semibold">{t.name}</div>
        <div className="text-[13px] capitalize text-muted">
          {t.kind} · {t.genres[0]} · {t.rating}
        </div>
      </div>
    </Link>
  );
}

export function PosterGrid({ ids }: { ids: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {ids.map((id) => (
        <Card key={id} id={id} />
      ))}
    </div>
  );
}

export function Pill({ active, children, ...rest }: { active?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      aria-pressed={active}
      {...rest}
      className={`inline-flex h-11 items-center rounded-full border px-[18px] text-sm ${active ? "border-fg bg-fg font-semibold text-bg" : "border-muted/60 font-medium text-fg hover:bg-line"}`}
    >
      {children}
    </button>
  );
}
