import { colors } from "@/styles/global";
import { StyleSheet, Text, View } from "react-native";

export default function HomeHeader() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={styles.wrap}>
      <Text style={styles.date}>{currentDate}</Text>
      <Text style={styles.subtitle}>Today&apos;s macros</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 20,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginTop: 4,
    fontWeight: "600",
  },
});
