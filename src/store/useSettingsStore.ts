import { DEFAULT_GOALS, MacroGoals } from "@/lib/macros";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { persistentStorage } from "./storage";

type SettingsStore = {
  goals: MacroGoals;
  remindersEnabled: boolean;
  isHydrated: boolean;
  setHydrated: (value: boolean) => void;
  setGoals: (goals: MacroGoals) => void;
  setRemindersEnabled: (enabled: boolean) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      goals: DEFAULT_GOALS,
      remindersEnabled: false,
      isHydrated: false,
      setHydrated: (value) => set({ isHydrated: value }),
      setGoals: (goals) => set({ goals }),
      setRemindersEnabled: (enabled) => set({ remindersEnabled: enabled }),
    }),
    {
      name: "macrozone-settings",
      storage: createJSONStorage(() => persistentStorage),
      partialize: (state) => ({
        goals: state.goals,
        remindersEnabled: state.remindersEnabled,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          useSettingsStore.setState({ isHydrated: true });
          return;
        }
        state?.setHydrated(true);
      },
    },
  ),
);

export async function migrateLegacyReminders(): Promise<void> {
  try {
    const legacy = await AsyncStorage.getItem("remindersEnabled");
    if (legacy === null) {
      return;
    }

    useSettingsStore.setState({ remindersEnabled: legacy === "true" });
    await AsyncStorage.removeItem("remindersEnabled");
  } catch {
    // Ignore legacy migration failures.
  }
}
