import { formatWeekdayShort } from "@/lib/date";
import { MacroKey, buildWeeklySeries } from "@/lib/macros";
import { Meal } from "@/store/useMealStore";
import { colors } from "@/styles/global";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

type WeeklyChartProps = {
  meals: Meal[];
};

const OPTIONS: { key: MacroKey; label: string; color: string }[] = [
  { key: "calories", label: "Calories", color: colors.calories },
  { key: "protein", label: "Protein", color: colors.protein },
  { key: "carbs", label: "Carbs", color: colors.carbs },
  { key: "fat", label: "Fat", color: colors.fat },
];

export default function WeeklyChart({ meals }: WeeklyChartProps) {
  const [selected, setSelected] = useState<MacroKey>("calories");
  const option = OPTIONS.find((item) => item.key === selected) ?? OPTIONS[0];
  const series = buildWeeklySeries(meals, selected, 7);

  const chartData = series.map((item) => ({
    value: Math.round(item.value),
    label: formatWeekdayShort(item.dayKey),
    frontColor: option.color,
  }));

  const maxValue = Math.max(...chartData.map((item) => item.value), 1);

  return (
    <View>
      <View style={styles.filters}>
        {OPTIONS.map((item) => {
          const active = item.key === selected;
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.chip, active && { backgroundColor: item.color }]}
              onPress={() => setSelected(item.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Show ${item.label} trend`}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>{option.label} · last 7 days</Text>
        <BarChart
          data={chartData}
          barWidth={28}
          spacing={18}
          roundedTop
          roundedBottom
          hideRules={false}
          rulesColor={colors.track}
          rulesType="solid"
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisTextStyle={styles.axis}
          xAxisLabelTextStyle={styles.axis}
          noOfSections={4}
          maxValue={Math.ceil(maxValue * 1.2)}
          isAnimated
          animationDuration={600}
          backgroundColor={colors.card}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextActive: {
    color: colors.background,
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    overflow: "hidden",
  },
  chartTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  axis: {
    color: colors.textSecondary,
    fontSize: 11,
  },
});
