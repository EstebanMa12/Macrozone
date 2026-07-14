import {
  formatWeekdayShort,
  getLastNDays,
  getTodayKey,
  groupByDayKey,
  isSameLocalDay,
  toDayKey,
} from "../date";

describe("date helpers", () => {
  const now = new Date(2026, 6, 13, 15, 30, 0); // Jul 13, 2026 local

  it("builds local day keys", () => {
    expect(toDayKey(now)).toBe("2026-07-13");
    expect(getTodayKey(now)).toBe("2026-07-13");
  });

  it("detects same local day from local timestamps", () => {
    const sameDay = new Date(2026, 6, 13, 8, 0, 0).toISOString();
    const previousDay = new Date(2026, 6, 12, 8, 0, 0).toISOString();

    expect(isSameLocalDay(sameDay, now)).toBe(true);
    expect(isSameLocalDay(previousDay, now)).toBe(false);
  });

  it("returns last N days ending today", () => {
    expect(getLastNDays(3, now)).toEqual([
      "2026-07-11",
      "2026-07-12",
      "2026-07-13",
    ]);
  });

  it("groups meals by local day", () => {
    const meals = [
      { createdAt: new Date(2026, 6, 13, 8).toISOString(), id: "1" },
      { createdAt: new Date(2026, 6, 12, 20).toISOString(), id: "2" },
      { createdAt: new Date(2026, 6, 13, 19).toISOString(), id: "3" },
    ];

    const grouped = groupByDayKey(meals);
    expect(grouped["2026-07-13"]).toHaveLength(2);
    expect(grouped["2026-07-12"]).toHaveLength(1);
  });

  it("formats weekday labels", () => {
    expect(formatWeekdayShort("2026-07-13")).toMatch(
      /Mon|Tue|Wed|Thu|Fri|Sat|Sun/,
    );
  });
});
