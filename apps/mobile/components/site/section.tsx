import { Section as HtmlSection, Article } from "@expo/html-elements";
import { View, ViewStyle, StyleProp, StyleSheet } from "react-native";
import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type SectionVariant = "default" | "elevated" | "highlight" | "gradient";

interface SiteSectionProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  variant?: SectionVariant;
  narrow?: boolean;
  as?: "section" | "article";
}

/**
 * SEO-friendly section component
 * Renders semantic <section> or <article> on web for better SEO
 */
export function SiteSection({
  children,
  style,
  innerStyle,
  backgroundColor,
  variant = "default",
  narrow = false,
  as = "section",
}: SiteSectionProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const isDark = colorScheme === "dark";
  const Component = as === "article" ? Article : HtmlSection;

  const getVariantStyles = () => {
    switch (variant) {
      case "elevated":
        return {
          backgroundColor: colors.cardBackground,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: colors.border,
        };
      case "highlight":
        return {
          backgroundColor: isDark ? "rgba(255, 214, 10, 0.06)" : colors.primaryLight,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: isDark ? "rgba(255, 214, 10, 0.2)" : "rgba(255, 200, 0, 0.2)",
        };
      case "gradient":
        return {
          backgroundColor: colors.backgroundSecondary,
        };
      default:
        return {
          backgroundColor: backgroundColor ?? colors.background,
        };
    }
  };

  return (
    <Component
      style={StyleSheet.flatten([styles.section, getVariantStyles() as ViewStyle, style])}
    >
      <View style={[styles.inner, narrow && styles.narrow, innerStyle]}>
        {children}
      </View>
    </Component>
  );
}

const styles = {
  section: {
    paddingVertical: Spacing["4xl"],
  },
  inner: {
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center" as const,
    paddingHorizontal: Spacing.xl,
  },
  narrow: {
    maxWidth: 860,
  },
} as const;
