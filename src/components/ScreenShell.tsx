import { colors } from "@/styles/global";
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenShellProps = {
  children: ReactNode;
  edges?: ("top" | "bottom" | "left" | "right")[];
};

export default function ScreenShell({
  children,
  edges = ["top", "left", "right"],
}: ScreenShellProps) {
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <View style={styles.inner}>{children}</View>
    </SafeAreaView>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View style={styles.emptyBox} accessibilityRole="summary">
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
  },
  emptyBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptyDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
