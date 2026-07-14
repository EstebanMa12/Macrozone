import { DayKey, dayKeyFromIso, getLastNDays, getTodayKey } from "./date";

export type MacroTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type MacroGoals = MacroTotals;

export type MacroKey = keyof MacroTotals;

export type MealLike = {
  createdAt: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export const EMPTY_TOTALS: MacroTotals = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
};

export const DEFAULT_GOALS: MacroGoals = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 65,
};

export function calculateTotals(meals: MealLike[]): MacroTotals {
  return meals.reduce<MacroTotals>(
    (acc, meal) => ({
      calories: acc.calories + (Number(meal.calories) || 0),
      protein: acc.protein + (Number(meal.protein) || 0),
      carbs: acc.carbs + (Number(meal.carbs) || 0),
      fat: acc.fat + (Number(meal.fat) || 0),
    }),
    { ...EMPTY_TOTALS },
  );
}

export function filterMealsByDay<T extends MealLike>(
  meals: T[],
  dayKey: DayKey = getTodayKey(),
): T[] {
  return meals.filter((meal) => dayKeyFromIso(meal.createdAt) === dayKey);
}

export function calculateProgress(value: number, goal: number): number {
  if (!goal || goal <= 0) {
    return 0;
  }

  return Math.min(Math.max(value / goal, 0), 1);
}

export function formatMacroValue(key: MacroKey, value: number): string {
  const rounded = Math.round(value);
  return key === "calories" ? `${rounded}` : `${rounded}g`;
}

export function formatMacroGoal(key: MacroKey, goal: number): string {
  return key === "calories"
    ? goal.toLocaleString("en-US")
    : `${goal.toLocaleString("en-US")}g`;
}

export function buildWeeklySeries(
  meals: MealLike[],
  key: MacroKey = "calories",
  days = 7,
  now: Date = new Date(),
): { dayKey: DayKey; value: number }[] {
  const dayKeys = getLastNDays(days, now);

  return dayKeys.map((dayKey) => ({
    dayKey,
    value: calculateTotals(filterMealsByDay(meals, dayKey))[key],
  }));
}

export function buildDailySummaryText(
  totals: MacroTotals,
  mealCount: number,
): string {
  return [
    "MacroZone Daily Summary",
    "",
    `Calories: ${Math.round(totals.calories)}`,
    `Protein: ${Math.round(totals.protein)}g`,
    `Carbs: ${Math.round(totals.carbs)}g`,
    `Fat: ${Math.round(totals.fat)}g`,
    "",
    `Meals: ${mealCount} logged today`,
  ].join("\n");
}
