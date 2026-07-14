import {
  MacroGoals,
  MacroTotals,
  formatMacroGoal,
  formatMacroValue,
} from "@/lib/macros";
import { colors } from "@/styles/global";
import { StyleSheet, View } from "react-native";
import MacroCard from "./MacroCard";

type MacroGridProps = {
  totals: MacroTotals;
  goals: MacroGoals;
};

export default function MacroGrid({ totals, goals }: MacroGridProps) {
  return (
    <View style={styles.grid}>
      <MacroCard
        label="Calories"
        value={formatMacroValue("calories", totals.calories)}
        goal={formatMacroGoal("calories", goals.calories)}
        color={colors.calories}
        progressValue={totals.calories}
        progressGoal={goals.calories}
      />
      <MacroCard
        label="Protein"
        value={formatMacroValue("protein", totals.protein)}
        goal={formatMacroGoal("protein", goals.protein)}
        color={colors.protein}
        progressValue={totals.protein}
        progressGoal={goals.protein}
      />
      <MacroCard
        label="Carbs"
        value={formatMacroValue("carbs", totals.carbs)}
        goal={formatMacroGoal("carbs", goals.carbs)}
        color={colors.carbs}
        progressValue={totals.carbs}
        progressGoal={goals.carbs}
      />
      <MacroCard
        label="Fat"
        value={formatMacroValue("fat", totals.fat)}
        goal={formatMacroGoal("fat", goals.fat)}
        color={colors.fat}
        progressValue={totals.fat}
        progressGoal={goals.fat}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
});
