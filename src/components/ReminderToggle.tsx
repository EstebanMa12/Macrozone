import { useSettingsStore } from "@/store/useSettingsStore";
import { colors } from "@/styles/global";
import {
  cancelMealReminders,
  scheduleMealReminders,
} from "@/utils/notifications";
import { Platform, StyleSheet, Switch, Text, View } from "react-native";

export default function ReminderToggle() {
  const remindersEnabled = useSettingsStore((state) => state.remindersEnabled);
  const setRemindersEnabled = useSettingsStore(
    (state) => state.setRemindersEnabled,
  );

  const toggle = async (value: boolean) => {
    if (Platform.OS === "web") {
      return;
    }

    if (value) {
      const scheduled = await scheduleMealReminders();
      if (!scheduled) {
        return;
      }
      setRemindersEnabled(true);
      return;
    }

    await cancelMealReminders();
    setRemindersEnabled(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.copy}>
        <Text style={styles.label}>Meal Reminders</Text>
        <Text style={styles.helper}>
          {Platform.OS === "web"
            ? "Reminders are available on iOS and Android."
            : "Daily reminders at 12:00 and 18:00."}
        </Text>
      </View>
      <Switch
        value={remindersEnabled}
        onValueChange={toggle}
        disabled={Platform.OS === "web"}
        trackColor={{ false: colors.surface, true: colors.primary }}
        accessibilityLabel="Toggle meal reminders"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    gap: 16,
  },
  copy: {
    flex: 1,
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  helper: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
});
