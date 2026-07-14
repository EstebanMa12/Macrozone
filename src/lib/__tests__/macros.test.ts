import {
  DEFAULT_GOALS,
  buildDailySummaryText,
  buildWeeklySeries,
  calculateProgress,
  calculateTotals,
  filterMealsByDay,
  formatMacroGoal,
  formatMacroValue,
} from "../macros";

const meals = [
  {
    createdAt: new Date(2026, 6, 13, 9).toISOString(),
    calories: 500,
    protein: 40,
    carbs: 40,
    fat: 15,
  },
  {
    createdAt: new Date(2026, 6, 13, 13).toISOString(),
    calories: 700,
    protein: 35,
    carbs: 80,
    fat: 20,
  },
  {
    createdAt: new Date(2026, 6, 12, 19).toISOString(),
    calories: 900,
    protein: 50,
    carbs: 90,
    fat: 30,
  },
];

describe("macro helpers", () => {
  it("calculates totals", () => {
    expect(calculateTotals(meals)).toEqual({
      calories: 2100,
      protein: 125,
      carbs: 210,
      fat: 65,
    });
  });

  it("filters meals by day", () => {
    const today = filterMealsByDay(meals, "2026-07-13");
    expect(today).toHaveLength(2);
    expect(calculateTotals(today).calories).toBe(1200);
  });

  it("calculates capped progress", () => {
    expect(calculateProgress(500, 1000)).toBe(0.5);
    expect(calculateProgress(1500, 1000)).toBe(1);
    expect(calculateProgress(100, 0)).toBe(0);
  });

  it("formats values and goals", () => {
    expect(formatMacroValue("calories", 1234.6)).toBe("1235");
    expect(formatMacroValue("protein", 40.2)).toBe("40g");
    expect(formatMacroGoal("calories", DEFAULT_GOALS.calories)).toBe("2,000");
    expect(formatMacroGoal("fat", 65)).toBe("65g");
  });

  it("builds weekly series", () => {
    const series = buildWeeklySeries(meals, "calories", 2, new Date(2026, 6, 13));
    expect(series).toEqual([
      { dayKey: "2026-07-12", value: 900 },
      { dayKey: "2026-07-13", value: 1200 },
    ]);
  });

  it("builds daily summary text", () => {
    const text = buildDailySummaryText(calculateTotals(meals.slice(0, 2)), 2);
    expect(text).toContain("Calories: 1200");
    expect(text).toContain("Meals: 2 logged today");
  });
});
