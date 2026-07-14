import ReminderToggle from "@/components/ReminderToggle";
import ScreenShell from "@/components/ScreenShell";
import { DEFAULT_GOALS, MacroGoals } from "@/lib/macros";
import { useSettingsStore } from "@/store/useSettingsStore";
import { colors, globalStyles } from "@/styles/global";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type GoalDraft = {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
};

function goalsToDraft(goals: MacroGoals): GoalDraft {
  return {
    calories: String(goals.calories),
    protein: String(goals.protein),
    carbs: String(goals.carbs),
    fat: String(goals.fat),
  };
}

function parseGoal(value: string): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return 0;
  }
  return Math.round(parsed);
}

export default function SettingsScreen() {
  const goals = useSettingsStore((state) => state.goals);
  const setGoals = useSettingsStore((state) => state.setGoals);
  const [draft, setDraft] = useState<GoalDraft | null>(null);
  const [errors, setErrors] = useState<string | null>(null);

  const values = draft ?? goalsToDraft(goals);

  const updateField = (field: keyof GoalDraft, value: string) => {
    setDraft({
      ...values,
      [field]: value,
    });
  };

  const handleSave = () => {
    const next: MacroGoals = {
      calories: parseGoal(values.calories),
      protein: parseGoal(values.protein),
      carbs: parseGoal(values.carbs),
      fat: parseGoal(values.fat),
    };

    if (
      next.calories <= 0 ||
      next.protein <= 0 ||
      next.carbs <= 0 ||
      next.fat <= 0
    ) {
      setErrors("All goals must be valid numbers greater than zero.");
      return;
    }

    setErrors(null);
    setGoals(next);
    setDraft(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Saved", "Your daily macro goals were updated.");
  };

  const handleReset = () => {
    setGoals(DEFAULT_GOALS);
    setDraft(goalsToDraft(DEFAULT_GOALS));
    setErrors(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <ScreenShell>
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={globalStyles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={globalStyles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Configure daily macro goals and reminder preferences.
        </Text>

        <Text style={globalStyles.sectionTitle}>Daily Goals</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Calories</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={values.calories}
            onChangeText={(value) => updateField("calories", value)}
            accessibilityLabel="Calories goal"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Protein (g)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={values.protein}
            onChangeText={(value) => updateField("protein", value)}
            accessibilityLabel="Protein goal"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Carbs (g)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={values.carbs}
            onChangeText={(value) => updateField("carbs", value)}
            accessibilityLabel="Carbs goal"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Fat (g)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={values.fat}
            onChangeText={(value) => updateField("fat", value)}
            accessibilityLabel="Fat goal"
          />
        </View>

        {errors ? <Text style={globalStyles.errorText}>{errors}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel="Save daily goals"
        >
          <Text style={styles.buttonText}>Save Goals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleReset}
          accessibilityRole="button"
          accessibilityLabel="Reset goals to defaults"
        >
          <Text style={styles.secondaryText}>Reset to defaults</Text>
        </TouchableOpacity>

        <Text style={globalStyles.sectionTitle}>Notifications</Text>
        <ReminderToggle />
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: colors.textSecondary,
    marginTop: 8,
  },
  field: {
    marginTop: 12,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: 6,
    fontSize: 13,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: colors.background,
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    marginTop: 12,
    alignItems: "center",
    padding: 12,
  },
  secondaryText: {
    color: colors.primary,
    fontSize: 14,
  },
});
