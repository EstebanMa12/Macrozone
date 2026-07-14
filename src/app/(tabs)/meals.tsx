import MealItem from "@/components/MealItem";
import ScreenShell, { EmptyState } from "@/components/ScreenShell";
import { formatDayLabel, getTodayKey, groupByDayKey } from "@/lib/date";
import { useMealStore } from "@/store/useMealStore";
import { colors, globalStyles } from "@/styles/global";
import { useMemo } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AllMealsScreen() {
  const meals = useMealStore((state) => state.meals);
  const clearMeals = useMealStore((state) => state.clearMeals);

  const grouped = useMemo(() => {
    const byDay = groupByDayKey(meals);
    return Object.entries(byDay).sort(([a], [b]) => b.localeCompare(a));
  }, [meals]);

  const handleClearAll = () => {
    if (meals.length === 0) {
      return;
    }

    Alert.alert(
      "Clear all meals",
      "This will permanently delete your entire meal history.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => clearMeals(),
        },
      ],
    );
  };

  return (
    <ScreenShell>
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={globalStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.header}>
          <Text style={globalStyles.title}>All Meals</Text>
          <TouchableOpacity
            onPress={handleClearAll}
            accessibilityRole="button"
            accessibilityLabel="Clear all meals"
          >
            <Text style={styles.clearButton}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {grouped.length === 0 ? (
          <View style={{ marginTop: 24 }}>
            <EmptyState
              title="No meal history yet"
              description="Meals you log will appear here grouped by day."
            />
          </View>
        ) : (
          grouped.map(([dayKey, dayMeals]) => (
            <View key={dayKey} style={styles.group}>
              <Text style={styles.groupTitle}>
                {dayKey === getTodayKey()
                  ? `Today · ${formatDayLabel(dayKey)}`
                  : formatDayLabel(dayKey)}
              </Text>
              {dayMeals.map((meal) => (
                <MealItem key={meal.id} meal={meal} showDate />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  clearButton: {
    color: colors.alert,
    fontSize: 16,
    fontWeight: "600",
  },
  group: {
    marginTop: 24,
  },
  groupTitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
});
