import { useState } from "react";
import { Link, type Href } from "expo-router";
import {
  Pressable,
  View,
  useWindowDimensions,
  Linking,
  Text,
  StyleSheet,
} from "react-native";
import { Header, Nav } from "@expo/html-elements";

import { Button } from "@/components/ui/button";
import { Colors, Spacing, BorderRadius, FontFamily, FontSize } from "@/constants/theme";
import { SiteLinks } from "@/constants/site";
import { useColorScheme } from "@/hooks/use-color-scheme";

function NavLink({ href, label }: { href: Href; label: string }) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href} asChild>
      <Pressable
        style={[
          styles.navLink,
          isHovered && { backgroundColor: "rgba(255, 200, 0, 0.1)" },
        ]}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
      >
        <Text
          style={[
            styles.navLinkText,
            { color: isHovered ? colors.primary : colors.textSecondary },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Link>
  );
}

export function SiteHeader() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const isDark = colorScheme === "dark";

  return (
    <Header
      style={StyleSheet.flatten([
        styles.header,
        {
          backgroundColor: colors.cardBackground,
          borderBottomColor: colors.border,
        },
      ])}
    >
      <View style={styles.container}>
        {/* Brand Row */}
        <View style={styles.brandRow}>
          <Link href="/" asChild>
            <Pressable style={styles.brand}>
              <View
                style={[
                  styles.logoMark,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={[styles.logoText, { color: colors.textOnPrimary }]}>
                  HP
                </Text>
              </View>
              <Text style={[styles.brandName, { color: colors.text }]}>
                {SiteLinks.brand}
              </Text>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: isDark
                      ? "rgba(88, 204, 2, 0.15)"
                      : "#D1FAE5",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: isDark ? "#4ADE80" : "#58CC02" },
                  ]}
                >
                  Gratis att börja
                </Text>
              </View>
            </Pressable>
          </Link>
        </View>

        {/* Navigation */}
        <Nav style={StyleSheet.flatten([styles.nav, !isWide && styles.navStacked])}>
          <View style={styles.navLinks}>
            {SiteLinks.nav.map((item) => (
              <NavLink key={item.label} href={item.href} label={item.label} />
            ))}
          </View>
          <Button
            size="md"
            onPress={() => Linking.openURL(SiteLinks.appStoreUrl)}
          >
            {SiteLinks.ctaLabel}
          </Button>
        </Nav>
      </View>
    </Header>
  );
}

const styles = {
  header: {
    borderBottomWidth: 1,
    zIndex: 100,
  },
  container: {
    maxWidth: 1120,
    width: "100%",
    alignSelf: "center" as const,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  brandRow: {
    width: "100%",
  },
  brand: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: Spacing.sm,
    flexWrap: "wrap" as const,
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  logoText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
  },
  brandName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.h4,
    letterSpacing: -0.5,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontFamily: FontFamily.semibold,
    fontSize: 11,
  },
  nav: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    gap: Spacing.lg,
    flexWrap: "wrap" as const,
  },
  navStacked: {
    flexDirection: "column" as const,
    alignItems: "flex-start" as const,
  },
  navLinks: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: Spacing.xs,
  },
  navLink: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  navLinkText: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.xs,
  },
} as const;
