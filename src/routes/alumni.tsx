import { createFileRoute } from "@tanstack/react-router";
import { SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { useContent } from "@/lib/content/store";
import { achievementStats, CATEGORY_LABELS, filterAchievements } from "@/lib/content/alumni";
import type { ExamCategory } from "@/lib/content/types";
import { PageHero } from "@/components/site/PageHero";
import { AchievementCard } from "@/components/site/AchievementCard";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/alumni")({
  head: () => ({
    meta: [
      { title: "Alumni Achievements — V2 Classes, Hisar" },
      { name: "description", content: "The V2 Classes alumni archive: JEE, NEET, board and other achievements by our students." },
      { property: "og:title", content: "V2 Classes Alumni Achievements" },
      { property: "og:description", content: "JEE, NEET, board and other achievements by V2 Classes students." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Alumni,
});

const FILTERS: (ExamCategory | "all")[] = ["all", "iit-jee", "neet", "boards", "other"];

function Alumni() {
  const { content, ready } = useContent();
  const [cat, setCat] = useState<ExamCategory | "all">("all");
  const list = useMemo(() => filterAchievements(content.achievements, "", cat), [content.achievements, cat]);
  const stats = achievementStats(content.achievements);
  const hasSamples = content.achievements.some((a) => a.isSample && a.status === "published");

  return (
    <>
      <PageHero eyebrow="Alumni" title={<>Every result, <span className="text-brand">a story of effort.</span></>}>
        An archive of what V2 Classes students have achieved.
        {hasSamples && <span className="placeholder-tag ml-3 align-middle">Sample entries shown for preview</span>}
      </PageHero>

      {stats && (
        <section className="container-x mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
          {[["Total achievements", stats.total], ["IIT / JEE", stats.jee], ["NEET", stats.neet], ["Boards", stats.boards]].map(([l, v]) => (
            <div key={l} className="bg-background p-6"><p className="font-display text-4xl font-extrabold text-brand">{v}</p><p className="mt-1 text-sm text-muted-foreground">{l}</p></div>
          ))}
        </section>
      )}

      <section className="container-x mt-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div role="tablist" aria-label="Filter by exam" className="flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map((f) => (
              <button key={f} role="tab" aria-selected={cat === f} onClick={() => setCat(f)}
                className={`shrink-0 rounded-md border px-4 py-2 text-sm font-medium transition ${cat === f ? "border-brand bg-brand text-primary-foreground" : "border-border hover:border-foreground"}`}>
                {f === "all" ? "All" : CATEGORY_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {!ready ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}</div>
        ) : list.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-dashed border-border py-20 text-center">
            <SearchX className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-4 font-display text-xl font-bold">No achievements found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different filter.</p>
          </div>
        ) : (
          <div className="mt-10 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((a) => <div key={a.id} className={a.featured ? "sm:col-span-2 lg:col-span-1 lg:row-span-1" : ""}><AchievementCard a={a} /></div>)}
          </div>
        )}
      </section>
    </>
  );
}
