import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Linking, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SiteLayout } from '@/components/site/site-layout';
import { SiteSection } from '@/components/site/section';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Colors, Spacing, BorderRadius, FontFamily, Primitives } from '@/constants/theme';
import { PracticeLinks, SiteLinks } from '@/constants/site';
import { useColorScheme } from '@/hooks/use-color-scheme';

function LinkCard({ label, href }: { label: string; href: string }) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [isHovered, setIsHovered] = useState(false);
  const isDark = colorScheme === 'dark';

  const cardStyle = {
    backgroundColor: isHovered
      ? (isDark ? 'rgba(255, 214, 10, 0.1)' : Primitives.yellow[50])
      : colors.cardBackground,
    borderColor: isHovered
      ? (isDark ? 'rgba(255, 214, 10, 0.4)' : Primitives.yellow[300])
      : colors.cardBorder,
    ...(isHovered && { transform: [{ translateY: -2 }] }),
  };

  return (
    <Pressable
      onPress={() => Linking.openURL(href)}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[styles.linkCard, cardStyle]}
    >
      <View style={styles.linkCardContent}>
        <View style={styles.linkCardIcon}>
          <Ionicons
            name="document-text-outline"
            size={24}
            color={isHovered ? colors.primary : colors.textSecondary}
          />
        </View>
        <View style={styles.linkCardText}>
          <Text variant="h5" style={{ color: isHovered ? colors.text : colors.text }}>
            {label}
          </Text>
          <Text variant="caption" color="secondary">
            Öppnas på studera.nu
          </Text>
        </View>
      </View>
      <View style={styles.linkCardArrow}>
        <Ionicons
          name="arrow-forward"
          size={20}
          color={isHovered ? colors.primary : colors.textTertiary}
        />
      </View>
    </Pressable>
  );
}

function CompareItem({
  icon,
  text,
  positive,
}: {
  icon: string;
  text: string;
  positive?: boolean;
}) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.compareItem}>
      <Ionicons
        name={icon as any}
        size={18}
        color={positive ? colors.success : colors.textTertiary}
      />
      <Text variant="bodySm" style={{ flex: 1 }}>
        {text}
      </Text>
    </View>
  );
}

export default function OvningsprovPage() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const isWide = width >= 960;
  const isDark = colorScheme === 'dark';

  const heroGradient = {
    backgroundColor: isDark ? 'rgba(255, 214, 10, 0.05)' : 'rgba(255, 200, 0, 0.08)',
  };

  const compareCardGood = {
    backgroundColor: isDark ? 'rgba(74, 222, 128, 0.1)' : colors.successLight,
    borderColor: isDark ? 'rgba(74, 222, 128, 0.3)' : colors.success,
  };

  const demoCardStyle = {
    backgroundColor: isDark ? 'rgba(255, 214, 10, 0.1)' : Primitives.yellow[50],
    borderColor: isDark ? 'rgba(255, 214, 10, 0.25)' : Primitives.yellow[300],
  };

  return (
    <SiteLayout>
      {/* Hero Section */}
      <SiteSection style={[styles.heroSection, heroGradient]}>
        <View style={styles.heroContent}>
          <View style={styles.heroBadge}>
            <Ionicons name="book-outline" size={14} color={colors.primary} />
            <Text variant="caption" weight="bold" style={{ color: colors.primary }}>
              ÖVNINGSPROV
            </Text>
          </View>
          <Text variant="hero" style={styles.heroTitle}>
            Övningsprov & gamla prov
          </Text>
          <Text variant="bodyLg" color="secondary" style={styles.heroSubtitle}>
            Officiella gamla prov är bra för att känna på formatet, men de räcker inte hela vägen.
            Här får du både länkar till alla gamla prov och en smartare plan för att faktiskt höja
            ditt resultat.
          </Text>
          <View style={styles.heroButtons}>
            <Button size="lg" onPress={() => Linking.openURL(SiteLinks.appStoreUrl)}>
              {SiteLinks.ctaLabel}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onPress={() => Linking.openURL(SiteLinks.playStoreUrl)}
            >
              Google Play
            </Button>
          </View>
        </View>
      </SiteSection>

      {/* Official Practice Links */}
      <SiteSection variant="elevated">
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Ionicons name="link-outline" size={24} color={colors.primary} />
          </View>
          <Text variant="h2">Officiella övningsprov</Text>
          <Text variant="body" color="secondary" style={{ maxWidth: 600 }}>
            Studera.nu samlar PDF:er med tidigare prov och facit. Klicka på länkarna nedan för att
            ladda ner dem direkt från de officiella sidorna.
          </Text>
        </View>
        <View style={styles.linksGrid}>
          {PracticeLinks.map((link) => (
            <LinkCard key={link.href} label={link.label} href={link.href} />
          ))}
        </View>
      </SiteSection>

      {/* Comparison Section */}
      <SiteSection>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Ionicons name="git-compare-outline" size={24} color={colors.primary} />
          </View>
          <Text variant="h2">Varför gamla prov inte räcker</Text>
          <Text variant="body" color="secondary" style={{ maxWidth: 600 }}>
            Gamla prov visar formatet, men de säger inte vad du ska träna nästa dag. Utan tydlig
            feedback är det lätt att fastna i samma fel.
          </Text>
        </View>
        <View style={[styles.compareRow, isWide && styles.compareRowWide]}>
          <View
            style={[
              styles.compareCard,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <View style={styles.compareHeader}>
              <Ionicons name="document-outline" size={28} color={colors.textTertiary} />
              <Text variant="h4" color="secondary">
                Gamla prov
              </Text>
            </View>
            <View style={styles.compareList}>
              <CompareItem icon="checkmark-circle-outline" text="Bra för att känna på tempot" />
              <CompareItem icon="close-circle-outline" text="Svårt att se svagheter" />
              <CompareItem icon="close-circle-outline" text="Ingen daglig plan" />
              <CompareItem icon="close-circle-outline" text="Inga förklaringar" />
            </View>
          </View>
          <View style={[styles.compareCard, styles.compareCardHighlight, compareCardGood]}>
            <View style={styles.compareHeader}>
              <View
                style={[
                  styles.compareIconBadge,
                  {
                    backgroundColor: isDark ? 'rgba(74, 222, 128, 0.2)' : Primitives.success[100],
                  },
                ]}
              >
                <Ionicons name="rocket-outline" size={24} color={colors.success} />
              </View>
              <Text variant="h4">Maxa HP</Text>
              <View
                style={[
                  styles.recommendBadge,
                  {
                    backgroundColor: isDark ? 'rgba(74, 222, 128, 0.2)' : Primitives.success[100],
                  },
                ]}
              >
                <Text variant="caption" weight="bold" style={{ color: colors.success }}>
                  Rekommenderat
                </Text>
              </View>
            </View>
            <View style={styles.compareList}>
              <CompareItem icon="checkmark-circle" text="Adaptiva pass varje dag" positive />
              <CompareItem icon="checkmark-circle" text="Fokus på svagaste delprov" positive />
              <CompareItem icon="checkmark-circle" text="AI-förklaringar på varje fråga" positive />
              <CompareItem icon="checkmark-circle" text="Statistik som visar framsteg" positive />
            </View>
          </View>
        </View>
      </SiteSection>

      {/* Demo Section */}
      <SiteSection variant="highlight">
        <View style={[styles.demoRow, isWide && styles.demoRowWide]}>
          <View style={[styles.demoCard, demoCardStyle]}>
            <View style={styles.demoBadgeRow}>
              <View
                style={[
                  styles.demoBadge,
                  {
                    backgroundColor: isDark
                      ? 'rgba(255, 214, 10, 0.2)'
                      : Primitives.yellow[200],
                  },
                ]}
              >
                <Text variant="caption" weight="bold" style={{ color: colors.textOnPrimary }}>
                  GRATIS
                </Text>
              </View>
              <View
                style={[
                  styles.demoBadge,
                  {
                    backgroundColor: isDark ? 'rgba(0, 229, 255, 0.15)' : Primitives.blue[100],
                  },
                ]}
              >
                <Ionicons
                  name="sparkles"
                  size={12}
                  color={isDark ? '#00E5FF' : Primitives.blue[600]}
                />
                <Text
                  variant="caption"
                  weight="bold"
                  style={{ color: isDark ? '#00E5FF' : Primitives.blue[600] }}
                >
                  AI-coach
                </Text>
              </View>
            </View>
            <Text variant="h2" style={{ letterSpacing: -0.5 }}>
              Träna gratis på ett helt pass
            </Text>
            <Text variant="body" color="secondary">
              Ingen inloggning krävs för första passet. Testa direkt och se hur appen bryter ner
              varje fråga och delprov så att du vet exakt vad du behöver jobba på.
            </Text>
            <View style={{ marginTop: Spacing.md }}>
              <Button size="lg" onPress={() => Linking.openURL(SiteLinks.appStoreUrl)}>
                {SiteLinks.ctaLabel}
              </Button>
            </View>
          </View>
          <View
            style={[
              styles.featuresCard,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <Text variant="h4">Det här får du i appen</Text>
            <View style={styles.featuresList}>
              {[
                { icon: 'analytics-outline', text: 'Nivåtest som sätter startpunkt' },
                { icon: 'calendar-outline', text: 'Daglig plan med blandade delprov' },
                { icon: 'bar-chart-outline', text: 'Statistik på tid och träffsäkerhet' },
                { icon: 'bulb-outline', text: 'AI-förklaringar som gör att du lär dig' },
              ].map((item) => (
                <View key={item.text} style={styles.featureItem}>
                  <View
                    style={[
                      styles.featureIcon,
                      {
                        backgroundColor: isDark
                          ? 'rgba(255, 214, 10, 0.1)'
                          : Primitives.yellow[50],
                      },
                    ]}
                  >
                    <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                  </View>
                  <Text variant="bodySm">{item.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </SiteSection>
    </SiteLayout>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    paddingTop: Spacing['5xl'],
    paddingBottom: Spacing['4xl'],
  },
  heroContent: {
    gap: Spacing.lg,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  heroTitle: {
    fontFamily: FontFamily.extrabold,
    letterSpacing: -1.5,
    maxWidth: 700,
  },
  heroSubtitle: {
    maxWidth: 620,
    lineHeight: 28,
  },
  heroButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  sectionHeader: {
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 214, 10, 0.1)',
  },
  linksGrid: {
    gap: Spacing.md,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 2,
  },
  linkCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  linkCardIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  linkCardText: {
    gap: 2,
  },
  linkCardArrow: {
    opacity: 0.5,
  },
  compareRow: {
    gap: Spacing.lg,
  },
  compareRowWide: {
    flexDirection: 'row',
  },
  compareCard: {
    flex: 1,
    padding: Spacing.xl,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 2,
    gap: Spacing.lg,
  },
  compareCardHighlight: {
    borderWidth: 2,
  },
  compareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  compareIconBadge: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  compareList: {
    gap: Spacing.md,
  },
  compareItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  demoRow: {
    gap: Spacing.lg,
  },
  demoRowWide: {
    flexDirection: 'row',
  },
  demoCard: {
    flex: 1,
    padding: Spacing['2xl'],
    borderRadius: BorderRadius['3xl'],
    borderWidth: 2,
    gap: Spacing.md,
  },
  demoBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  featuresCard: {
    flex: 1,
    padding: Spacing.xl,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 2,
    gap: Spacing.lg,
  },
  featuresList: {
    gap: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
