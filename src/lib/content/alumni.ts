import type { Achievement } from "./types";

export function filterAchievements(list: Achievement[], query = "") {
  const q = query.trim().toLowerCase();
  return list
    .filter((a) => a.status === "published")
    .filter(
      (a) =>
        !q ||
        a.studentName.toLowerCase().includes(q) ||
        a.institute.toLowerCase().includes(q) ||
        a.rank.toLowerCase().includes(q),
    );
}

export function achievementStats(list: Achievement[]) {
  const published = list.filter((a) => a.status === "published");
  if (published.length === 0) return null;
  return { total: published.length };
}
