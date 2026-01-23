import React from 'react';
import { View, StyleSheet, useWindowDimensions, Linking } from 'react-native';

import { SiteLayout } from '@/components/site/site-layout';
import { SiteSection } from '@/components/site/section';
import { InlineLink } from '@/components/site/inline-link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Colors, Spacing, FontFamily } from '@/constants/theme';
import { ScoreExamples, SiteLinks } from '@/constants/site';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function PoangAntagningPage() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const isWide = width >= 960;

  return (
    <SiteLayout>
      <SiteSection style={styles.heroSection}>
        <View style={styles.heroContent}>
          <Text variant="hero" style={styles.heroTitle}>
            Poäng, normering & antagning
          </Text>
          <Text variant="bodyLg" color="secondary" style={styles.heroSubtitle}>
            Vad räcker 1.3, 1.7 eller 2.0 till? Här får du en snabb bild av skalan och hur
            högskoleprovet används i urvalet.
          </Text>
          <Button size="lg" onPress={() => Linking.openURL(SiteLinks.appStoreUrl)}>
            {SiteLinks.ctaLabel}
          </Button>
        </View>
      </SiteSection>

      <SiteSection backgroundColor={colors.backgroundSecondary}>
        <View style={styles.sectionHeader}>
          <Text variant="h2">Så fungerar poängen</Text>
          <Text variant="body" color="secondary">
            Skalan går från 0.00 till 2.00. Antalet rätta svar normeras mot en nationell skala och
            ditt bästa resultat gäller. Läs mer om provets upplägg i vår
            {' '}
            <InlineLink href="/hogskoleprovet/guide">guide</InlineLink>.
          </Text>
        </View>
        <View style={[styles.scaleRow, isWide && styles.scaleRowWide]}>
          {[
            { title: '0.00–0.50', text: 'Basnivå, behöver mer grundträning.' },
            { title: '0.60–1.10', text: 'Stabil start, bygg tempo och säkerhet.' },
            { title: '1.20–1.60', text: 'Konkurrenskraftigt på många program.' },
            { title: '1.70–2.00', text: 'Toppoäng för de mest populära programmen.' },
          ].map((item) => (
            <Card key={item.title} style={styles.scaleCard}>
              <Text variant="h4">{item.title}</Text>
              <Text variant="bodySm" color="secondary">
                {item.text}
              </Text>
            </Card>
          ))}
        </View>
      </SiteSection>

      <SiteSection>
        <View style={styles.sectionHeader}>
          <Text variant="h2">Vad räcker poängen till?</Text>
          <Text variant="body" color="secondary">
            Intervallen nedan är exempel från HP-kvoten och varierar mellan terminer.
          </Text>
        </View>
        <Card style={styles.tableCard}>
          <View style={[styles.tableRow, styles.tableHeader, { borderBottomColor: colors.border }]}>
            <Text variant="label" color="secondary">Program</Text>
            <Text variant="label" color="secondary">Typisk HP</Text>
          </View>
          {ScoreExamples.map((item) => (
            <View key={item.program} style={styles.tableRow}>
              <Text variant="bodySm" weight="semibold">{item.program}</Text>
              <Text variant="bodySm" color="secondary">{item.range}</Text>
            </View>
          ))}
        </Card>
      </SiteSection>

      <SiteSection backgroundColor={colors.backgroundSecondary}>
        <View style={[styles.incomeRow, isWide && styles.incomeRowWide]}>
          <Card style={styles.incomeCard}>
            <Text variant="h3">Varför poängen spelar roll</Text>
            <Text variant="bodySm" color="secondary">
              Ett högre HP-resultat kan öppna dörrar till utbildningar med högre framtida
              livsinkomst och bättre karriärval. Det gör att varje poäng är värd att jaga.
            </Text>
          </Card>
          <Card
            style={[
              styles.incomeCardAlt,
              { backgroundColor: colors.backgroundSecondary, borderColor: colors.blue },
            ]}
          >
            <Text variant="h4">Exempelplan: 1.1 → 1.6</Text>
            <Text variant="bodySm" color="secondary">
              12 veckor, 15 min per dag. Fokus på två svagaste delprov och repetera feltyper varje
              vecka.
            </Text>
            <Button size="lg" onPress={() => Linking.openURL(SiteLinks.appStoreUrl)}>
              {SiteLinks.ctaLabel}
            </Button>
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
  sectionHeader: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  scaleRow: {
    gap: Spacing.lg,
  },
  scaleRowWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  scaleCard: {
    flex: 1,
    minWidth: 220,
    gap: Spacing.sm,
  },
  tableCard: {
    gap: Spacing.sm,
  },
  tableHeader: {
    borderBottomWidth: 2,
    paddingBottom: Spacing.sm,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  incomeRow: {
    gap: Spacing.lg,
  },
  incomeRowWide: {
    flexDirection: 'row',
  },
  incomeCard: {
    flex: 1,
    gap: Spacing.sm,
  },
  incomeCardAlt: {
    flex: 1,
    gap: Spacing.md,
    borderWidth: 2,
  },
});
