import { Meal } from "@/store/useMealStore";
import { globalStyles } from "@/styles/global";
import { StyleSheet, Text, View } from "react-native";
import MealItem from "./MealItem";
import { EmptyState } from "./ScreenShell";

type RecentMealsProps = {
  meals: Meal[];
};

export default function RecentMeals({ meals }: RecentMealsProps) {
  return (
    <View style={styles.section}>
      <Text style={globalStyles.sectionTitle}>Today&apos;s Meals</Text>
      {meals.length === 0 ? (
        <EmptyState
          title="No meals logged today"
          description="Add your first meal to start tracking today's macros."
        />
      ) : (
        meals.map((meal) => <MealItem key={meal.id} meal={meal} />)
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 8,
  },
});
