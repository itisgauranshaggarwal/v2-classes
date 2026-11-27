import { Award, GraduationCap, Sparkles, UserRound } from "lucide-react";
import type { Achievement } from "@/lib/content/types";
import { CATEGORY_LABELS } from "@/lib/content/alumni";

export function AchievementCard({ a, compact = false }: { a: Achievement; compact?: boolean }) {
  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden p-5 ${a.featured ? "card-featured" : "card-elegant"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`grid shrink-0 place-items-center overflow-hidden rounded-xl bg-surface ${compact ? "h-12 w-12" : "h-16 w-16"}`}
        >
          {a.photo ? (
            <img
              src={a.photo}
              alt={a.studentName}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRound className="h-6 w-6 text-muted-foreground" aria-hidden />
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {a.featured && (
            <span className="inline-flex items-center gap-1 rounded bg-brand px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide text-primary-foreground uppercase">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
          )}
          {a.isSample && <span className="placeholder-tag">Sample entry</span>}
        </div>
      </div>
      <p className="mt-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {CATEGORY_LABELS[a.category]} · {a.year}
      </p>
      <h3 className={`mt-1 font-display font-extrabold ${compact ? "text-lg" : "text-xl"}`}>
        {a.studentName}
      </h3>
      <p
        className={`mt-3 font-display font-extrabold tracking-tight ${a.featured ? "text-brand" : ""} ${compact ? "text-2xl" : "text-3xl"}`}
      >
        {a.result}
      </p>
      <div className="mt-auto space-y-1.5 pt-4 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <Award className="h-4 w-4 shrink-0" />
          {a.exam}
        </p>
        <p className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 shrink-0" />
          <span className="truncate">{a.institution}</span>
        </p>
      </div>
    </article>
  );
}
