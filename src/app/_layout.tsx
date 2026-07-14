import {
  migrateLegacyMeals,
  useMealStore,
} from "@/store/useMealStore";
import {
  migrateLegacyReminders,
  useSettingsStore,
} from "@/store/useSettingsStore";
import { syncMealReminders } from "@/utils/notifications";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const mealHydrated = useMealStore((state) => state.isHydrated);
  const settingsHydrated = useSettingsStore((state) => state.isHydrated);
  const remindersEnabled = useSettingsStore((state) => state.remindersEnabled);

  useEffect(() => {
    void migrateLegacyMeals();
    void migrateLegacyReminders();
  }, []);

  useEffect(() => {
    if (!mealHydrated || !settingsHydrated) {
      return;
    }

    void syncMealReminders(remindersEnabled);
  }, [mealHydrated, settingsHydrated, remindersEnabled]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
