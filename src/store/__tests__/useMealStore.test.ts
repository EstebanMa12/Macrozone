import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMealStore } from "../useMealStore";

describe("useMealStore", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useMealStore.setState({
      meals: [],
      isHydrated: true,
      error: null,
    });
  });

  it("adds, updates, deletes and clears meals", () => {
    const meal = useMealStore.getState().addMeal({
      name: "Eggs",
      calories: 300,
      protein: 20,
      carbs: 2,
      fat: 20,
    });

    expect(useMealStore.getState().meals).toHaveLength(1);

    useMealStore.getState().updateMeal(meal.id, {
      name: "Scrambled Eggs",
      calories: 320,
      protein: 22,
      carbs: 2,
      fat: 22,
    });

    expect(useMealStore.getState().getMealById(meal.id)?.name).toBe(
      "Scrambled Eggs",
    );

    useMealStore.getState().deleteMeal(meal.id);
    expect(useMealStore.getState().meals).toHaveLength(0);

    useMealStore.getState().addMeal({
      name: "Toast",
      calories: 200,
      protein: 6,
      carbs: 30,
      fat: 4,
    });
    useMealStore.getState().clearMeals();

    expect(useMealStore.getState().meals).toHaveLength(0);
  });
});
