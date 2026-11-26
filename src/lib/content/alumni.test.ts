import { describe, expect, it } from "vitest";
import { achievementStats, filterAchievements } from "./alumni";
import type { Achievement } from "./types";

const base: Achievement = { id: "1", studentName: "Asha", photo: "", exam: "NEET", category: "neet", result: "", institution: "", year: "", featured: false, status: "published", isSample: false };

describe("alumni rules", () => {
  it("hides statistics when only sample entries exist", () => {
    expect(achievementStats([{ ...base, isSample: true }])).toBeNull();
  });
  it("never shows draft achievements publicly", () => {
    expect(filterAchievements([{ ...base, status: "draft" }], "", "all")).toHaveLength(0);
  });
  it("filters by category and searches by name", () => {
    const list = [base, { ...base, id: "2", studentName: "Ravi", category: "iit-jee" as const }];
    expect(filterAchievements(list, "", "iit-jee").map((a) => a.id)).toEqual(["2"]);
    expect(filterAchievements(list, "ash", "all").map((a) => a.id)).toEqual(["1"]);
  });
});
