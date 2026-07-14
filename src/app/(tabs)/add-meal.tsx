import ScreenShell from "@/components/ScreenShell";
import { validateMealInput } from "@/lib/validation";
import { Meal, useMealStore } from "@/store/useMealStore";
import { colors, globalStyles } from "@/styles/global";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type FormState = {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
};

function mealToForm(meal?: Meal): FormState {
  if (!meal) {
    return {
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
    };
  }

  return {
    name: meal.name,
    calories: String(meal.calories),
    protein: String(meal.protein),
    carbs: String(meal.carbs),
    fat: String(meal.fat),
  };
}

export default function AddMealScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const mealId = typeof params.id === "string" ? params.id : undefined;

  const meals = useMealStore((state) => state.meals);
  const addMeal = useMealStore((state) => state.addMeal);
  const updateMeal = useMealStore((state) => state.updateMeal);

  const existingMeal = useMemo(
    () => meals.find((meal) => meal.id === mealId),
    [meals, mealId],
  );

  const isEditing = Boolean(existingMeal);
  const initialForm = mealToForm(existingMeal);

  const [draft, setDraft] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeMealId, setActiveMealId] = useState<string | undefined>(mealId);

  // Reset local draft when navigating between create/edit targets.
  if (activeMealId !== mealId) {
    setActiveMealId(mealId);
    setDraft(null);
    setErrors({});
  }

  const form = draft ?? initialForm;

  const updateField = (field: keyof FormState, value: string) => {
    setDraft({
      ...form,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    const result = validateMealInput(form);

    if (!result.values) {
      setErrors(result.errors);
      return;
    }

    setErrors({});

    if (isEditing && mealId) {
      updateMeal(mealId, result.values);
    } else {
      addMeal(result.values);
    }

    setDraft(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/");
  };

  return (
    <ScreenShell>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={globalStyles.container}
          contentContainerStyle={globalStyles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={globalStyles.title}>
            {isEditing ? "Edit Meal" : "Add Meal"}
          </Text>
          <Text style={styles.subtitle}>
            {isEditing
              ? "Update macros for this meal."
              : "Log a meal with calories and macros."}
          </Text>

          <Text style={styles.label}>Meal name</Text>
          <TextInput
            style={[styles.input, errors.name ? styles.inputError : null]}
            placeholder="Chicken bowl"
            placeholderTextColor={colors.textSecondary}
            value={form.name}
            onChangeText={(value) => updateField("name", value)}
            accessibilityLabel="Meal name"
          />
          {errors.name ? (
            <Text style={globalStyles.errorText}>{errors.name}</Text>
          ) : null}

          <Text style={styles.label}>Calories</Text>
          <TextInput
            style={[styles.input, errors.calories ? styles.inputError : null]}
            placeholder="520"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            value={form.calories}
            onChangeText={(value) => updateField("calories", value)}
            accessibilityLabel="Calories"
          />
          {errors.calories ? (
            <Text style={globalStyles.errorText}>{errors.calories}</Text>
          ) : null}

          <View style={styles.row}>
            <View style={styles.rowInput}>
              <Text style={styles.label}>Protein (g)</Text>
              <TextInput
                style={[styles.input, errors.protein ? styles.inputError : null]}
                placeholder="40"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={form.protein}
                onChangeText={(value) => updateField("protein", value)}
                accessibilityLabel="Protein grams"
              />
              {errors.protein ? (
                <Text style={globalStyles.errorText}>{errors.protein}</Text>
              ) : null}
            </View>
            <View style={styles.rowInput}>
              <Text style={styles.label}>Carbs (g)</Text>
              <TextInput
                style={[styles.input, errors.carbs ? styles.inputError : null]}
                placeholder="45"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={form.carbs}
                onChangeText={(value) => updateField("carbs", value)}
                accessibilityLabel="Carbs grams"
              />
              {errors.carbs ? (
                <Text style={globalStyles.errorText}>{errors.carbs}</Text>
              ) : null}
            </View>
            <View style={styles.rowInput}>
              <Text style={styles.label}>Fat (g)</Text>
              <TextInput
                style={[styles.input, errors.fat ? styles.inputError : null]}
                placeholder="18"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={form.fat}
                onChangeText={(value) => updateField("fat", value)}
                accessibilityLabel="Fat grams"
              />
              {errors.fat ? (
                <Text style={globalStyles.errorText}>{errors.fat}</Text>
              ) : null}
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            accessibilityRole="button"
            accessibilityLabel={isEditing ? "Save meal changes" : "Add meal"}
          >
            <Text style={styles.buttonText}>
              {isEditing ? "Save Changes" : "Add Meal"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 8,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputError: {
    borderColor: colors.alert,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  rowInput: {
    flex: 1,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
    minHeight: 52,
    justifyContent: "center",
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
});
