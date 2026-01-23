import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Main } from "@expo/html-elements";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface SiteLayoutProps {
  children: React.ReactNode;
}

/**
 * Site layout wrapper with semantic HTML structure
 * Renders <main> on web for better SEO
 */
export function SiteLayout({ children }: SiteLayoutProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  // Background style - use solid color to avoid CSSStyleDeclaration errors
  const backgroundStyle = {
    backgroundColor: colors.background,
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={backgroundStyle}
      >
        <SiteHeader />
        <Main style={styles.main}>{children}</Main>
        <SiteFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing["6xl"],
  },
  main: {
    flex: 1,
  },
});
