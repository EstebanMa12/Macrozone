import CopyButton from "@/components/CopyButton";
import HomeHeader from "@/components/HomeHeader";
import MacroGrid from "@/components/MacroGrid";
import RecentMeals from "@/components/RecentMeals";
import ScreenShell from "@/components/ScreenShell";
import ShareButton from "@/components/ShareButton";
import { calculateTotals, filterMealsByDay } from "@/lib/macros";
import { useMealStore } from "@/store/useMealStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { colors, globalStyles } from "@/styles/global";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const meals = useMealStore((state) => state.meals);
  const isHydrated = useMealStore((state) => state.isHydrated);
  const error = useMealStore((state) => state.error);
  const goals = useSettingsStore((state) => state.goals);

  const todaysMeals = filterMealsByDay(meals);
  const totals = calculateTotals(todaysMeals);

  if (!isHydrated) {
    return (
      <ScreenShell>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={globalStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.header}>
          <Text style={globalStyles.title}>MacroZone</Text>
          <ShareButton meals={todaysMeals} />
        </View>
        <HomeHeader />
        {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}
        <MacroGrid totals={totals} goals={goals} />
        <CopyButton meals={todaysMeals} />
        <RecentMeals meals={todaysMeals} />
      </ScrollView>
    </ScreenShell>
  );
}
