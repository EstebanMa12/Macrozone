import { buildDailySummaryText, calculateTotals } from "@/lib/macros";
import { Meal } from "@/store/useMealStore";
import { colors } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { Share, TouchableOpacity } from "react-native";

type ShareButtonProps = {
  meals: Meal[];
};

export default function ShareButton({ meals }: ShareButtonProps) {
  const handleShare = async () => {
    const totals = calculateTotals(meals);
    await Share.share({
      message: buildDailySummaryText(totals, meals.length),
    });
  };

  return (
    <TouchableOpacity
      onPress={handleShare}
      accessibilityRole="button"
      accessibilityLabel="Share today's macro summary"
      hitSlop={12}
    >
      <Ionicons name="share-outline" size={24} color={colors.primary} />
    </TouchableOpacity>
  );
}
