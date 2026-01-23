import React from 'react';
import { View, StyleSheet, useWindowDimensions, Linking } from 'react-native';

import { SiteLayout } from '@/components/site/site-layout';
import { SiteSection } from '@/components/site/section';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Colors, Spacing, FontFamily } from '@/constants/theme';
import { ExamDates2026, SiteLinks } from '@/constants/site';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProvdatumPage() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const isWide = width >= 960;

  return (
    <SiteLayout>
      <SiteSection style={styles.heroSection}>
        <View style={styles.heroContent}>
          <Text variant="hero" style={styles.heroTitle}>
            Högskoleprovet datum 2026
          </Text>
          <Text variant="bodyLg" color="secondary" style={styles.heroSubtitle}>
            Här är provdatum och anmälningsfönster för 2026. Sätt ett datum direkt – det gör
            träningen konkret.
          </Text>
          <Button size="lg" onPress={() => Linking.openURL(SiteLinks.appStoreUrl)}>
            {SiteLinks.ctaLabel}
          </Button>
        </View>
      </SiteSection>

      <SiteSection backgroundColor={colors.backgroundSecondary}>
        <View style={styles.sectionHeader}>
          <Text variant="h2">Datum & anmälan</Text>
          <Text variant="body" color="secondary">
            Anmälan sker via hogskoleprov.nu och det finns ingen sen anmälan.
          </Text>
        </View>
        <Card style={styles.tableCard}>
          <View style={[styles.tableRow, styles.tableHeader, { borderBottomColor: colors.border }]}>
            <Text variant="label" color="secondary">Tillfälle</Text>
            <Text variant="label" color="secondary">Provdatum</Text>
            <Text variant="label" color="secondary">Anmälan</Text>
          </View>
          {ExamDates2026.map((item) => (
            <View key={item.season} style={styles.tableRow}>
              <Text variant="bodySm" weight="semibold">{item.season}</Text>
              <Text variant="bodySm" color="secondary">{item.date}</Text>
              <Text variant="bodySm" color="secondary">{item.registration}</Text>
            </View>
          ))}
        </Card>
      </SiteSection>

      <SiteSection>
        <View style={styles.sectionHeader}>
          <Text variant="h2">Så sent kan du börja plugga</Text>
          <Text variant="body" color="secondary">
            Även om du börjar sent får du effekt – men planen måste vara tydlig.
          </Text>
        </View>
        <View style={[styles.timelineRow, isWide && styles.timelineRowWide]}>
          {[
            { title: '12 veckor kvar', text: '10–15 min/dag ger stabil grund.' },
            { title: '8 veckor kvar', text: '15–20 min/dag, fokus på svagheter.' },
            { title: '4 veckor kvar', text: '20 min/dag + helgpass med gamla prov.' },
          ].map((item) => (
            <Card key={item.title} style={styles.timelineCard}>
              <Text variant="h4">{item.title}</Text>
              <Text variant="bodySm" color="secondary">
                {item.text}
              </Text>
            </Card>
          ))}
        </View>
      </SiteSection>

      <SiteSection backgroundColor={colors.backgroundSecondary}>
        <View style={[styles.checklistRow, isWide && styles.checklistRowWide]}>
          <Card style={styles.checklistCard}>
            <Text variant="h3">Checklista inför provdagen</Text>
            <View style={styles.checklistItems}>
              {[
                'Anmälan klar och betald (550 kr).',
                'Giltig legitimation klar.',
                'Plan för resväg & tid på plats.',
                'Packa snacks och vatten.',
              ].map((item) => (
                <Text key={item} variant="bodySm" color="secondary">
                  • {item}
                </Text>
              ))}
            </View>
          </Card>
          <Card
            style={[
              styles.checklistCta,
              { backgroundColor: colors.primaryLight, borderColor: colors.primaryDark },
            ]}
          >
            <Text variant="h4">Räkna ner i appen</Text>
            <Text variant="bodySm" color="secondary">
              Välj ditt provdatum och få ett dagligt pass som matchar tiden du har kvar.
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
  timelineRow: {
    gap: Spacing.lg,
  },
  timelineRowWide: {
    flexDirection: 'row',
  },
  timelineCard: {
    flex: 1,
    gap: Spacing.sm,
  },
  checklistRow: {
    gap: Spacing.lg,
  },
  checklistRowWide: {
    flexDirection: 'row',
  },
  checklistCard: {
    flex: 1,
    gap: Spacing.md,
  },
  checklistItems: {
    gap: Spacing.xs,
  },
  checklistCta: {
    flex: 1,
    gap: Spacing.md,
    borderWidth: 2,
  },
});
