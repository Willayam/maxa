import { View, StyleSheet, Text } from "react-native";

import {
  Colors,
  Spacing,
  BorderRadius,
  FontFamily,
  FontSize,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface PhoneMockProps {
  title: string;
  subtitle: string;
  accentColor?: string;
  progress?: number;
}

/**
 * Phone mockup component for displaying app screenshots/previews
 */
export function PhoneMock({
  title,
  subtitle,
  accentColor,
  progress = 62,
}: PhoneMockProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const safeAccent = accentColor ?? colors.primary;

  return (
    <View
      style={[
        styles.shell,
        { borderColor: colors.border, backgroundColor: colors.cardBackground },
      ]}
    >
      {/* Notch */}
      <View style={[styles.notch, { backgroundColor: colors.border }]} />

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.screenLabel, { color: colors.textTertiary }]}>
          Maxa HP
        </Text>
        <View style={[styles.dot, { backgroundColor: safeAccent }]} />
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      {/* Subtitle */}
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {subtitle}
      </Text>

      {/* Progress bar */}
      <View
        style={[styles.progressTrack, { backgroundColor: colors.backgroundTertiary }]}
      >
        <View
          style={[
            styles.progressFill,
            { backgroundColor: safeAccent, width: `${progress}%` },
          ]}
        />
      </View>

      {/* Stats row */}
      <View style={styles.cardRow}>
        <View
          style={[styles.smallCard, { backgroundColor: colors.backgroundSecondary }]}
        >
          <Text style={[styles.smallNumber, { color: colors.text }]}>10</Text>
          <Text style={[styles.smallLabel, { color: colors.textSecondary }]}>
            min/dag
          </Text>
        </View>
        <View
          style={[styles.smallCard, { backgroundColor: colors.backgroundSecondary }]}
        >
          <Text style={[styles.smallNumber, { color: colors.text }]}>25</Text>
          <Text style={[styles.smallLabel, { color: colors.textSecondary }]}>
            frågor
          </Text>
        </View>
      </View>

      {/* CTA button */}
      <View style={[styles.cta, { backgroundColor: safeAccent }]}>
        <Text style={[styles.ctaText, { color: colors.textOnPrimary }]}>
          Starta pass
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderWidth: 2,
    borderRadius: BorderRadius["3xl"],
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  notch: {
    width: 64,
    height: 6,
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: Spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  screenLabel: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  title: {
    fontFamily: FontFamily.extrabold,
    fontSize: FontSize.h4,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    marginBottom: Spacing.sm,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  cardRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  smallCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  smallNumber: {
    fontSize: FontSize.h4,
    fontFamily: FontFamily.extrabold,
  },
  smallLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
  },
  cta: {
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm,
    alignItems: "center",
  },
  ctaText: {
    fontFamily: FontFamily.black,
    fontSize: FontSize.sm,
    textTransform: "uppercase",
  },
});
