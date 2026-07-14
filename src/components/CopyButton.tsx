import { buildDailySummaryText, calculateTotals } from "@/lib/macros";
import { Meal } from "@/store/useMealStore";
import { colors } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";

type CopyButtonProps = {
  meals: Meal[];
};

export default function CopyButton({ meals }: CopyButtonProps) {
  const handleCopy = async () => {
    const totals = calculateTotals(meals);
    const summary = buildDailySummaryText(totals, meals.length);

    await Clipboard.setStringAsync(summary);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Copied!", "Today's macro summary copied to clipboard.");
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleCopy}
      accessibilityRole="button"
      accessibilityLabel="Copy today's macro summary"
    >
      <Ionicons name="copy-outline" size={18} color={colors.primary} />
      <Text style={styles.text}>Copy Summary</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    minHeight: 44,
  },
  text: {
    color: colors.primary,
    fontSize: 14,
  },
});
