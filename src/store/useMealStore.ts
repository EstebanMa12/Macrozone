import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { persistentStorage } from "./storage";

export type Meal = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
};

export type MealDraft = Omit<Meal, "id" | "createdAt">;

type MealStore = {
  meals: Meal[];
  isHydrated: boolean;
  error: string | null;
  setHydrated: (value: boolean) => void;
  addMeal: (meal: MealDraft) => Meal;
  updateMeal: (id: string, meal: MealDraft) => Meal | null;
  deleteMeal: (id: string) => void;
  clearMeals: () => void;
  getMealById: (id: string) => Meal | undefined;
};

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useMealStore = create<MealStore>()(
  persist(
    (set, get) => ({
      meals: [],
      isHydrated: false,
      error: null,
      setHydrated: (value) => set({ isHydrated: value }),
      addMeal: (meal) => {
        const newMeal: Meal = {
          ...meal,
          id: createId(),
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          meals: [newMeal, ...state.meals],
          error: null,
        }));

        return newMeal;
      },
      updateMeal: (id, meal) => {
        const existing = get().meals.find((item) => item.id === id);
        if (!existing) {
          set({ error: "Meal not found." });
          return null;
        }

        const updated: Meal = {
          ...existing,
          ...meal,
        };

        set((state) => ({
          meals: state.meals.map((item) => (item.id === id ? updated : item)),
          error: null,
        }));

        return updated;
      },
      deleteMeal: (id) => {
        set((state) => ({
          meals: state.meals.filter((meal) => meal.id !== id),
          error: null,
        }));
      },
      clearMeals: () => set({ meals: [], error: null }),
      getMealById: (id) => get().meals.find((meal) => meal.id === id),
    }),
    {
      name: "macrozone-meals",
      storage: createJSONStorage(() => persistentStorage),
      partialize: (state) => ({ meals: state.meals }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          useMealStore.setState({
            error: "Failed to load meals.",
            isHydrated: true,
          });
          return;
        }

        state?.setHydrated(true);
      },
      migrate: (persistedState) => {
        if (
          persistedState &&
          typeof persistedState === "object" &&
          "meals" in persistedState
        ) {
          return persistedState as { meals: Meal[] };
        }

        return { meals: [] };
      },
    },
  ),
);

// Migrate legacy AsyncStorage key used by the original storage module.
export async function migrateLegacyMeals(): Promise<void> {
  try {
    const legacy = await AsyncStorage.getItem("meals");
    if (!legacy) {
      return;
    }

    const parsed = JSON.parse(legacy) as Meal[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return;
    }

    const current = useMealStore.getState().meals;
    if (current.length === 0) {
      useMealStore.setState({ meals: parsed, error: null });
    }

    await AsyncStorage.removeItem("meals");
  } catch {
    useMealStore.setState({ error: "Failed to migrate previous meals." });
  }
}
