import React from 'react';
import { View, StyleSheet, useWindowDimensions, Linking } from 'react-native';

import { SiteLayout } from '@/components/site/site-layout';
import { SiteSection } from '@/components/site/section';
import { InlineLink } from '@/components/site/inline-link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Colors, Spacing, FontFamily } from '@/constants/theme';
import { GuideQuickFacts, SiteLinks } from '@/constants/site';
import { useColorScheme } from '@/hooks/use-color-scheme';

const EXAM_STRUCTURE = [
  { title: 'Kvantitativt', detail: 'XYZ, KVA, NOG, DTK' },
  { title: 'Verbalt', detail: 'ORD, LÄS, MEK, ELF' },
  { title: 'Utprövning', detail: 'Ej poängsatt' },
] as const;

const DAILY_ROUTINE_STEPS = [
  '2 min uppvärmning',
  '8–12 min blandade frågor',
  '2 min repetition av svaga delar',
] as const;

export default function GuidePage() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const isWide = width >= 960;

  return (
    <SiteLayout>
      <SiteSection style={styles.heroSection}>
        <View style={styles.heroContent}>
          <Text variant="hero" style={styles.heroTitle}>
            Komplett guide till högskoleprovet
          </Text>
          <Text variant="bodyLg" color="secondary" style={styles.heroSubtitle}>
            Här får du en snabb överblick av hur provet fungerar, vad poängen betyder och hur du
            bygger en plan som faktiskt håller.
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

      <SiteSection backgroundColor={colors.backgroundSecondary}>
        <View style={styles.sectionHeader}>
          <Text variant="h2">Snabba fakta</Text>
          <Text variant="body" color="secondary">
            Det här vill de flesta veta direkt när de googlar “högskoleprovet”.
          </Text>
        </View>
        <View style={[styles.factsGrid, isWide && styles.factsGridWide]}>
          {GuideQuickFacts.map((fact) => (
            <Card key={fact} style={styles.factCard}>
              <Text variant="bodySm" color="secondary">
                {fact}
              </Text>
            </Card>
          ))}
        </View>
      </SiteSection>

      <SiteSection>
        <View style={styles.sectionHeader}>
          <Text variant="h2">Så är provet uppbyggt</Text>
          <Text variant="body" color="secondary">
            Du skriver fem pass á 55 minuter. Två kvantitativa, två verbala och ett utprövningspass.
            Ordningen lottas. Fokus ligger på tempo, återhämtning och tydlig struktur.
          </Text>
        </View>
        <View style={[styles.structureRow, isWide && styles.structureRowWide]}>
          {EXAM_STRUCTURE.map((item) => (
            <Card key={item.title} style={styles.structureCard}>
              <Text variant="h4">{item.title}</Text>
              <Text variant="bodySm" color="secondary">
                {item.detail}
              </Text>
            </Card>
          ))}
        </View>
      </SiteSection>

      <SiteSection backgroundColor={colors.backgroundSecondary}>
        <View style={styles.sectionHeader}>
          <Text variant="h2">När skrivs högskoleprovet?</Text>
          <Text variant="body" color="secondary">
            Se exakta datum och anmälningstider här:
            {' '}
            <InlineLink href="/hogskoleprovet/provdatum-2026">provdatum 2026</InlineLink>.
          </Text>
        </View>
        <Card style={styles.calloutCard}>
          <Text variant="bodySm" color="secondary">
            Ju tidigare du sätter ett provdatum, desto lättare blir det att skapa en plan.
          </Text>
        </Card>
      </SiteSection>

      <SiteSection>
        <View style={styles.sectionHeader}>
          <Text variant="h2">Hur fungerar poäng & normering?</Text>
          <Text variant="body" color="secondary">
            Resultatet går från 0.00 till 2.00. Antalet rätta svar normeras mot en skala där
            2.00 är toppresultat. Läs mer i vår sida om
            {' '}
            <InlineLink href="/hogskoleprovet/poang-antagning">poäng och antagning</InlineLink>.
          </Text>
        </View>
      </SiteSection>

      <SiteSection backgroundColor={colors.backgroundSecondary}>
        <View style={[styles.planRow, isWide && styles.planRowWide]}>
          <Card style={styles.planCard}>
            <Text variant="h3">Bästa sättet att förbereda sig</Text>
            <Text variant="bodySm" color="secondary">
              1) Välj provdatum. 2) Gör nivåtest. 3) Kör dagliga pass på 10–20 min. Det är den
              korta rutinen som ger störst effekt när du behöver bygga tempo och säkerhet.
            </Text>
            <Button size="lg" onPress={() => Linking.openURL(SiteLinks.appStoreUrl)}>
              {SiteLinks.ctaLabel}
            </Button>
          </Card>
          <Card
            style={[
              styles.planCardAlt,
              { backgroundColor: colors.primaryLight, borderColor: colors.primaryDark },
            ]}
          >
            <Text variant="h4">Daglig rutin som funkar</Text>
            <View style={styles.planList}>
              {DAILY_ROUTINE_STEPS.map((item) => (
                <Text key={item} variant="bodySm" color="secondary">
                  • {item}
                </Text>
              ))}
            </View>
          </Card>
        </View>
      </SiteSection>
    </SiteLayout>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    paddingTop: Spacing['6xl'],
    paddingBottom: Spacing['5xl'],
  },
  heroContent: {
    gap: Spacing.lg,
  },
  heroTitle: {
    fontFamily: FontFamily.extrabold,
    letterSpacing: -1.2,
  },
  heroSubtitle: {
    maxWidth: 620,
  },
  heroButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  sectionHeader: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  factsGrid: {
    gap: Spacing.lg,
  },
  factsGridWide: {
    flexDirection: 'row',
  },
  factCard: {
    flex: 1,
  },
  structureRow: {
    gap: Spacing.lg,
  },
  structureRowWide: {
    flexDirection: 'row',
  },
  structureCard: {
    flex: 1,
    gap: Spacing.sm,
  },
  calloutCard: {
    padding: Spacing.xl,
  },
  planRow: {
    gap: Spacing.lg,
  },
  planRowWide: {
    flexDirection: 'row',
  },
  planCard: {
    flex: 1,
    gap: Spacing.md,
  },
  planCardAlt: {
    flex: 1,
    gap: Spacing.sm,
    borderWidth: 2,
  },
  planList: {
    gap: Spacing.xs,
  },
});
