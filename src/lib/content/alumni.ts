import type { Achievement, ExamCategory } from "./types";

export const CATEGORY_LABELS: Record<ExamCategory, string> = {
  "iit-jee": "IIT / JEE",
  neet: "NEET",
  boards: "Boards",
  other: "Other Achievements",
};

export function filterAchievements(
  list: Achievement[],
  query: string,
  category: ExamCategory | "all",
) {
  const q = query.trim().toLowerCase();
  return list
    .filter((a) => a.status === "published")
    .filter((a) => category === "all" || a.category === category)
    .filter((a) => !q || a.studentName.toLowerCase().includes(q))
    .sort((a, b) => Number(b.featured) - Number(a.featured));
}

/** Statistics only count real (non-sample) published achievements. Returns null when there is no real data. */
export function achievementStats(list: Achievement[]) {
  const real = list.filter((a) => a.status === "published" && !a.isSample);
  if (real.length === 0) return null;
  const by = (c: ExamCategory) => real.filter((a) => a.category === c).length;
  return { total: real.length, jee: by("iit-jee"), neet: by("neet"), boards: by("boards") };
}
