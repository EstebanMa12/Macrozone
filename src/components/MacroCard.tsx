import { calculateProgress } from "@/lib/macros";
import { colors } from "@/styles/global";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type MacroCardProps = {
  label: string;
  value: string;
  goal: string;
  color: string;
  progressValue: number;
  progressGoal: number;
};

export default function MacroCard({
  label,
  value,
  goal,
  color,
  progressValue,
  progressGoal,
}: MacroCardProps) {
  const progress = calculateProgress(progressValue, progressGoal);
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 450 });
  }, [animatedProgress, progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value * 100}%`,
  }));

  return (
    <View
      style={[styles.card, { borderLeftColor: color }]}
      accessibilityRole="summary"
      accessibilityLabel={`${label} ${value} of ${goal}`}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.goal}>/ {goal}</Text>
      <View style={styles.track}>
        <Animated.View
          style={[styles.fill, { backgroundColor: color }, barStyle]}
        />
      </View>
      <Text style={styles.percent}>{Math.round(progress * 100)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    width: "47%",
    borderLeftWidth: 4,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 4,
  },
  goal: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  track: {
    height: 6,
    backgroundColor: colors.track,
    borderRadius: 999,
    marginTop: 12,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
  percent: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textSecondary,
  },
});
