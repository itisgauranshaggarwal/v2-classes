import { describe, expect, it } from "vitest";
import { achievementStats, filterAchievements } from "./alumni";
import type { Achievement } from "./types";

const base: Achievement = {
  id: "1",
  studentName: "Asha",
  photo: "",
  institute: "IIT Delhi",
  rank: "AIR 12",
  status: "published",
};

describe("alumni rules", () => {
  it("returns null stats when there are no published achievements", () => {
    expect(achievementStats([{ ...base, status: "draft" }])).toBeNull();
  });

  it("never shows draft achievements publicly", () => {
    expect(filterAchievements([{ ...base, status: "draft" }])).toHaveLength(0);
  });

  it("searches by name, institute, or rank", () => {
    const list = [
      base,
      { ...base, id: "2", studentName: "Ravi", institute: "AIIMS", rank: "AIR 5" },
    ];
    expect(filterAchievements(list, "ravi").map((a) => a.id)).toEqual(["2"]);
    expect(filterAchievements(list, "aiims").map((a) => a.id)).toEqual(["2"]);
    expect(filterAchievements(list, "air 12").map((a) => a.id)).toEqual(["1"]);
  });
});
