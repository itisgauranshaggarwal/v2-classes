import { UserRound } from "lucide-react";
import type { Achievement } from "@/lib/content/types";

export function AchievementCard({ a }: { a: Achievement }) {
  const hasPhoto = Boolean(a.photo);
  const hasName = Boolean(a.name);
  const hasExam = Boolean(a.exam);
  const hasAchievement = Boolean(a.achievement);
  const hasExtra = Boolean(a.extraField);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      {hasPhoto ? (
        <img
          src={a.photo}
          alt={a.name || "Alumni achievement"}
          loading="lazy"
          className="block w-full object-cover"
        />
      ) : null}

      {hasName || hasExam || hasAchievement || hasExtra ? (
        <div className="space-y-2 p-5">
          {hasName ? <h3 className="font-display text-xl font-extrabold">{a.name}</h3> : null}

          {hasExam ? <p className="text-sm font-medium text-muted-foreground">{a.exam}</p> : null}

          {hasAchievement ? (
            <p className="font-display text-3xl font-extrabold leading-tight tracking-tight text-brand">
              {a.achievement}
            </p>
          ) : null}

          {hasExtra ? <p className="text-sm text-muted-foreground">{a.extraField}</p> : null}
        </div>
      ) : !hasPhoto ? (
        <div className="grid aspect-[4/5] place-items-center bg-surface text-muted-foreground">
          <UserRound className="h-10 w-10" aria-hidden />
        </div>
      ) : null}
    </article>
  );
}
