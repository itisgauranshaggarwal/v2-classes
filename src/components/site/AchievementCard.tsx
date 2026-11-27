import { GraduationCap, UserRound } from "lucide-react";
import type { Achievement } from "@/lib/content/types";

export function AchievementCard({ a, compact = false }: { a: Achievement; compact?: boolean }) {
  return (
    <article className="card-elegant flex h-full flex-col overflow-hidden">
      <div className="aspect-[4/4.5] bg-surface">
        {a.photo ? (
          <img
            src={a.photo}
            alt={a.studentName}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center">
            <UserRound className="h-10 w-10 text-muted-foreground" aria-hidden />
          </div>
        )}
      </div>
      <div className={compact ? "p-4" : "p-5"}>
        <h3 className={`font-display font-extrabold ${compact ? "text-lg" : "text-xl"}`}>
          {a.studentName || "Student Name"}
        </h3>
        <p
          className={`mt-2 font-display font-extrabold tracking-tight text-brand ${compact ? "text-xl" : "text-2xl"}`}
        >
          {a.rank || "Rank / Position"}
        </p>
        {a.institute ? (
          <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
            <GraduationCap className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{a.institute}</span>
          </p>
        ) : null}
      </div>
    </article>
  );
}
