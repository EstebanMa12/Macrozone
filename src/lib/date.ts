export type DayKey = string; // YYYY-MM-DD in local time

export function toDayKey(date: Date): DayKey {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayKey(now: Date = new Date()): DayKey {
  return toDayKey(now);
}

export function dayKeyFromIso(iso: string): DayKey {
  return toDayKey(new Date(iso));
}

export function isSameLocalDay(iso: string, day: Date = new Date()): boolean {
  return dayKeyFromIso(iso) === toDayKey(day);
}

export function startOfLocalDay(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getLastNDays(n: number, now: Date = new Date()): DayKey[] {
  const days: DayKey[] = [];
  const start = startOfLocalDay(now);

  for (let i = n - 1; i >= 0; i -= 1) {
    const day = new Date(start);
    day.setDate(start.getDate() - i);
    days.push(toDayKey(day));
  }

  return days;
}

export function formatDayLabel(dayKey: DayKey): string {
  const [year, month, day] = dayKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatWeekdayShort(dayKey: DayKey): string {
  const [year, month, day] = dayKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function groupByDayKey<T extends { createdAt: string }>(
  items: T[],
): Record<DayKey, T[]> {
  return items.reduce<Record<DayKey, T[]>>((acc, item) => {
    const key = dayKeyFromIso(item.createdAt);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}
