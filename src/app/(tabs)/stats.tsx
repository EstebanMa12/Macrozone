import ScreenShell, { EmptyState } from "@/components/ScreenShell";
import WeeklyChart from "@/components/WeeklyChart";
import {
  buildWeeklySeries,
  calculateTotals,
  filterMealsByDay,
} from "@/lib/macros";
import { useMealStore } from "@/store/useMealStore";
import { colors, globalStyles } from "@/styles/global";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function StatsScreen() {
  const meals = useMealStore((state) => state.meals);
  const todayTotals = calculateTotals(filterMealsByDay(meals));
  const weekSeries = buildWeeklySeries(meals, "calories", 7);
  const weekCalories = weekSeries.reduce((sum, day) => sum + day.value, 0);
  const activeDays = weekSeries.filter((day) => day.value > 0).length;

  return (
    <ScreenShell>
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={globalStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={globalStyles.title}>Stats</Text>
        <Text style={styles.subtitle}>
          Track your weekly macro trends and daily totals.
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Today</Text>
            <Text style={styles.summaryValue}>
              {Math.round(todayTotals.calories)}
            </Text>
            <Text style={styles.summaryUnit}>kcal</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>This week</Text>
            <Text style={styles.summaryValue}>{Math.round(weekCalories)}</Text>
            <Text style={styles.summaryUnit}>
              kcal · {activeDays} active day{activeDays === 1 ? "" : "s"}
            </Text>
          </View>
        </View>

        {meals.length === 0 ? (
          <EmptyState
            title="Not enough data yet"
            description="Log meals for a few days to see your weekly trend chart."
          />
        ) : (
          <WeeklyChart meals={meals} />
        )}

        <Text style={styles.footnote}>
          Tip: switch macros above the chart to compare protein, carbs, and fat.
        </Text>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  summaryValue: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 8,
  },
  summaryUnit: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  footnote: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 16,
    lineHeight: 18,
  },
});
