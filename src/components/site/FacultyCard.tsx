import { UserRound } from "lucide-react";
import type { FacultyMember } from "@/lib/content/types";

export function FacultyCard({ f, index }: { f: FacultyMember; index: number }) {
  return (
    <article className="card-elegant group flex gap-5 p-4 transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-surface">
        {f.photo ? <img src={f.photo} alt={f.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          : <div className="grid h-full place-items-center text-center"><UserRound className="h-7 w-7 text-muted-foreground" /><span className="placeholder-tag !text-[0.55rem]">Photo</span></div>}
      </div>
      <div className="min-w-0 py-1">
        <span className="font-display text-xs font-bold text-brand">0{index + 1}</span>
        <h3 className="text-xl font-extrabold">{f.name}</h3>
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{f.focus}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.shortBio}</p>
      </div>
    </article>
  );
}
