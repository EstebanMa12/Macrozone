import { Meal, useMealStore } from "@/store/useMealStore";
import { colors } from "@/styles/global";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type MealItemProps = {
  meal: Meal;
  showDate?: boolean;
};

export default function MealItem({ meal, showDate = false }: MealItemProps) {
  const deleteMeal = useMealStore((state) => state.deleteMeal);

  const handlePress = () => {
    router.push({
      pathname: "/add-meal",
      params: { id: meal.id },
    });
  };

  const handleLongPress = () => {
    Alert.alert(
      "Delete Meal",
      `Are you sure you want to delete "${meal.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            deleteMeal(meal.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ],
    );
  };

  const dateLabel = new Date(meal.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      onLongPress={handleLongPress}
      accessibilityRole="button"
      accessibilityLabel={`${meal.name}, ${meal.calories} calories. Tap to edit, long press to delete.`}
    >
      <View style={styles.row}>
        <Text style={styles.name}>{meal.name}</Text>
        {showDate ? <Text style={styles.date}>{dateLabel}</Text> : null}
      </View>
      <Text style={styles.macros}>
        {meal.calories} cal • {meal.protein}g P • {meal.carbs}g C • {meal.fat}g F
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  macros: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
