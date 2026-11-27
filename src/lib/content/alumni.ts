import type { Achievement } from "./types";

export function filterAchievements(list: Achievement[], query = "") {
  const q = query.trim().toLowerCase();
  return list
    .filter((a) => a.status === "published")
    .filter(
      (a) =>
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.exam.toLowerCase().includes(q) ||
        a.achievement.toLowerCase().includes(q) ||
        a.extraField.toLowerCase().includes(q),
    )
    .sort((a, b) => Number(b.featured) - Number(a.featured));
}
