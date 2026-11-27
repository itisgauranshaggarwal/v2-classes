import { describe, expect, it } from "vitest";
import { filterAchievements } from "./alumni";
import type { Achievement } from "./types";

const base: Achievement = {
  id: "1",
  featured: false,
  name: "Asha",
  photo: "",
  exam: "NEET",
  achievement: "AIR 12",
  extraField: "",
  status: "published",
};

describe("alumni rules", () => {
  it("never shows draft achievements publicly", () => {
    expect(filterAchievements([{ ...base, status: "draft" }])).toHaveLength(0);
  });

  it("sorts featured achievements first", () => {
    const list = [base, { ...base, id: "2", name: "Ravi", featured: true }];
    expect(filterAchievements(list).map((a) => a.id)).toEqual(["2", "1"]);
  });

  it("searches by name, exam, achievement, or extra field", () => {
    const list = [
      base,
      {
        ...base,
        id: "2",
        name: "Ravi",
        exam: "JEE Main",
        achievement: "AIR 5",
        extraField: "IIT Delhi",
      },
    ];
    expect(filterAchievements(list, "ravi").map((a) => a.id)).toEqual(["2"]);
    expect(filterAchievements(list, "jee").map((a) => a.id)).toEqual(["2"]);
    expect(filterAchievements(list, "air 12").map((a) => a.id)).toEqual(["1"]);
    expect(filterAchievements(list, "iit delhi").map((a) => a.id)).toEqual(["2"]);
  });
});
