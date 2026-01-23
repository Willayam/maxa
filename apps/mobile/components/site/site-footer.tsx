import { useState } from "react";
import { Link, type Href } from "expo-router";
import {
  Pressable,
  View,
  Linking,
  useWindowDimensions,
  Text,
  StyleSheet,
} from "react-native";
import { Footer } from "@expo/html-elements";

import { Button } from "@/components/ui/button";
import { Text as ThemedText } from "@/components/ui/text";
import {
  Colors,
  Spacing,
  BorderRadius,
  FontFamily,
  FontSize,
  Primitives,
} from "@/constants/theme";
import { SiteLinks, SeoFooterText } from "@/constants/site";
import { useColorScheme } from "@/hooks/use-color-scheme";

function FooterLink({ href, label }: { href: Href; label: string }) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href} asChild>
      <Pressable
        style={styles.footerLink}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
      >
        <Text
          style={[
            styles.footerLinkText,
            { color: isHovered ? colors.primary : colors.textSecondary },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Link>
  );
}

export function SiteFooter() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const isDark = colorScheme === "dark";

  return (
    <Footer
      style={StyleSheet.flatten([
        styles.footer,
        {
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.border,
        },
      ])}
    >
      <View style={styles.container}>
        {/* CTA Card */}
        <View
          style={[
            styles.ctaCard,
            {
              backgroundColor: isDark ? "rgba(255, 214, 10, 0.08)" : Primitives.yellow[50],
              borderColor: isDark ? "rgba(255, 214, 10, 0.25)" : Primitives.yellow[200],
            },
          ]}
        >
          <View style={styles.ctaContent}>
            <View style={styles.ctaText}>
              <ThemedText variant="h2" style={{ letterSpacing: -0.5 }}>
                Redo för ett högre HP-resultat?
              </ThemedText>
              <ThemedText
                variant="bodyLg"
                color="secondary"
                style={{ maxWidth: 480 }}
              >
                Starta gratis och få ett dagligt pass som byggs runt dina svaga
                delar.
              </ThemedText>
            </View>
            <View style={styles.ctaButtons}>
              <Button
                onPress={() => Linking.openURL(SiteLinks.appStoreUrl)}
                size="lg"
              >
                App Store
              </Button>
              <Button
                variant="secondary"
                onPress={() => Linking.openURL(SiteLinks.playStoreUrl)}
                size="lg"
              >
                Google Play
              </Button>
            </View>
          </View>
        </View>

        {/* Footer Nav */}
        <View style={[styles.footerNav, !isWide && styles.footerNavStacked]}>
          <View style={styles.footerLinks}>
            {SiteLinks.nav.map((item) => (
              <FooterLink
                key={item.label}
                href={item.href}
                label={item.label}
              />
            ))}
          </View>
          <View style={styles.footerBrand}>
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
            <Text style={[styles.footerBrandText, { color: colors.textTertiary }]}>
              {SiteLinks.brand} · Högskoleprovet, varje dag.
            </Text>
          </View>
        </View>

        {/* SEO Footer */}
        <View style={[styles.seoSection, { borderTopColor: colors.border }]}>
          <Text style={[styles.seoText, { color: colors.textTertiary }]}>
            {SeoFooterText}
          </Text>
        </View>
      </View>
    </Footer>
  );
}

const styles = {
  footer: {
    borderTopWidth: 1,
    paddingVertical: Spacing["5xl"],
  },
  container: {
    maxWidth: 1120,
    width: "100%",
    alignSelf: "center" as const,
    paddingHorizontal: Spacing.xl,
    gap: Spacing["3xl"],
  },
  ctaCard: {
    borderWidth: 2,
    borderRadius: BorderRadius["3xl"],
    padding: Spacing["3xl"],
    overflow: "hidden" as const,
  },
  ctaContent: {
    gap: Spacing.xl,
  },
  ctaText: {
    gap: Spacing.md,
  },
  ctaButtons: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: Spacing.md,
  },
  footerNav: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    gap: Spacing.xl,
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.2)",
  },
  footerNavStacked: {
    flexDirection: "column" as const,
    alignItems: "flex-start" as const,
  },
  footerLinks: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: Spacing.lg,
  },
  footerLink: {
    paddingVertical: Spacing.xs,
  },
  footerLinkText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
  },
  footerBrand: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: Spacing.sm,
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  logoText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
  },
  footerBrandText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
  },
  seoSection: {
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
  },
  seoText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    lineHeight: 22,
    opacity: 0.7,
  },
} as const;
