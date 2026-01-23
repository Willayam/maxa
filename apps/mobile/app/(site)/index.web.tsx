import { View, useWindowDimensions, Linking, StyleSheet } from "react-native";

import { SiteLayout } from "@/components/site/site-layout";
import { SiteSection } from "@/components/site/section";
import { PhoneMock } from "@/components/site/phone-mock";
import { InlineLink } from "@/components/site/inline-link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Text } from "@/components/ui/text";
import {
  Colors,
  Spacing,
  BorderRadius,
  FontFamily,
  FontSize,
} from "@/constants/theme";
import {
  SiteLinks,
  PricingTiers,
  FaqItems,
  SeoFooterText,
  NextExamDate,
} from "@/constants/site";
import { useColorScheme } from "@/hooks/use-color-scheme";

const STEPS_CONTENT = [
  {
    title: "Välj provdatum & mål",
    text: "Sätt ett tydligt mål och få en personlig plan.",
  },
  { title: "Gör nivåtestet", text: "Vi hittar dina svagaste delar direkt." },
  {
    title: "Följ dagens pass",
    text: "Korta pass varje dag ger stabil progression.",
  },
] as const;

const FEATURES_CONTENT = [
  {
    title: "Smart fokus",
    text: "Appen väljer frågor som ger mest effekt just nu.",
    accentKey: "primary",
  },
  {
    title: "Tydliga framsteg",
    text: "Se statistik per delprov och håll koll på streaken.",
    accentKey: "success",
  },
  {
    title: "AI-förklaringar",
    text: "Få hjälp direkt när du kör fast i en fråga.",
    accentKey: "blue",
  },
] as const;

function useDaysUntilExam() {
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  return Math.max(
    0,
    Math.ceil(
      (NextExamDate.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24)
    )
  );
}

export default function HomePage() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const isWide = width >= 960;
  const daysUntilExam = useDaysUntilExam();

  return (
    <SiteLayout>
      {/* Hero Section */}
      <SiteSection style={styles.heroSection}>
        {/* Background blobs */}
        <View style={styles.heroGlow}>
          <View
            style={[
              styles.heroBlob,
              styles.heroBlobPrimary,
              { backgroundColor: colors.primary },
            ]}
          />
          <View
            style={[
              styles.heroBlob,
              styles.heroBlobBlue,
              { backgroundColor: colors.blue },
            ]}
          />
        </View>

        <View style={[styles.heroContent, isWide && styles.heroContentWide]}>
          <View style={styles.heroCopy}>
            <View style={styles.heroBadges}>
              <Chip size="sm" variant="soft">
                Högskoleprovet app
              </Chip>
              <Chip size="sm" variant="soft">
                10–20 min/dag
              </Chip>
              <Chip size="sm" variant="soft">
                Gratis att börja
              </Chip>
            </View>

            <Text variant="hero" style={styles.heroTitle}>
              Maxa ditt resultat på Högskoleprovet med 10–20 min om dagen
            </Text>

            <Text variant="bodyLg" color="secondary" style={styles.heroSubtitle}>
              App-baserad träning som fokuserar på dina svagaste delar – gratis
              att börja.
            </Text>

            <View style={styles.heroButtons}>
              <Button
                size="xl"
                onPress={() => Linking.openURL(SiteLinks.appStoreUrl)}
              >
                App Store
              </Button>
              <Button
                variant="secondary"
                size="xl"
                onPress={() => Linking.openURL(SiteLinks.playStoreUrl)}
              >
                Google Play
              </Button>
            </View>

            <Text variant="caption" color="tertiary" style={styles.heroMeta}>
              {daysUntilExam} dagar kvar till nästa prov · Anmälan via
              hogskoleprov.nu
            </Text>
          </View>

          <View style={styles.heroMock}>
            <PhoneMock
              title="Dagens pass"
              subtitle="Fokus på NOG + LÄS"
              accentColor={colors.primary}
              progress={68}
            />
          </View>
        </View>
      </SiteSection>

      {/* Stats Section */}
      <SiteSection variant="elevated">
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{daysUntilExam}</Text>
            <Text variant="caption" color="secondary">
              dagar kvar
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              550 kr
            </Text>
            <Text variant="caption" color="secondary">
              provavgift 2026
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>0.90</Text>
            <Text variant="caption" color="secondary">
              snitt senaste prov
            </Text>
          </Card>
        </View>
      </SiteSection>

      {/* How it works */}
      <SiteSection as="article">
        <View style={styles.sectionHeader}>
          <Text variant="h2">Så funkar Maxa HP</Text>
          <Text variant="body" color="secondary">
            Tre enkla steg som gör att du håller rutinen hela vägen till
            provdagen.
          </Text>
        </View>

        <View style={[styles.stepsRow, isWide && styles.stepsRowWide]}>
          {STEPS_CONTENT.map((step, index) => (
            <Card key={step.title} style={styles.stepCard}>
              <View
                style={[styles.stepBadge, { backgroundColor: colors.primaryLight }]}
              >
                <Text style={[styles.stepNumber, { color: colors.primary }]}>
                  0{index + 1}
                </Text>
              </View>
              <Text variant="h4">{step.title}</Text>
              <Text variant="bodySm" color="secondary">
                {step.text}
              </Text>
            </Card>
          ))}
        </View>
      </SiteSection>

      {/* Features */}
      <SiteSection variant="elevated" as="article">
        <View style={styles.sectionHeader}>
          <Text variant="h2">Träning som prioriterar dina svagheter</Text>
          <Text variant="body" color="secondary">
            Maxa HP kombinerar snabb övning, feedback och en tydlig plan mot din
            målnivå.
          </Text>
        </View>

        <View style={[styles.featureRow, isWide && styles.featureRowWide]}>
          {FEATURES_CONTENT.map((feature) => {
            const accent = colors[feature.accentKey as keyof typeof colors] as string;
            return (
              <Card key={feature.title} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: accent }]}>
                  <Text
                    style={[styles.featureIconText, { color: colors.textOnPrimary }]}
                  >
                    ★
                  </Text>
                </View>
                <Text variant="h4">{feature.title}</Text>
                <Text variant="bodySm" color="secondary">
                  {feature.text}
                </Text>
                <View style={styles.featureMock}>
                  <PhoneMock
                    title={feature.title}
                    subtitle="2-minuterspass"
                    accentColor={accent}
                    progress={72}
                  />
                </View>
              </Card>
            );
          })}
        </View>
      </SiteSection>

      {/* Pricing */}
      <SiteSection as="article">
        <View style={styles.sectionHeader}>
          <Text variant="h2">Prisnivåer som slår provavgiften</Text>
          <Text variant="body" color="secondary">
            Välj det som passar dig. Alla planer ger dagliga pass och fokus på
            svaga delar.
          </Text>
        </View>

        <View style={[styles.pricingRow, isWide && styles.pricingRowWide]}>
          {PricingTiers.map((tier) => (
            <Card
              key={tier.name}
              style={[
                styles.pricingCard,
                tier.highlight && { borderColor: colors.primary, borderWidth: 3 },
              ]}
            >
              <View style={styles.pricingHeader}>
                <Text variant="h4">{tier.name}</Text>
                <Text style={styles.pricingPrice}>{tier.price}</Text>
                <Text variant="bodySm" color="secondary">
                  {tier.description}
                </Text>
              </View>
              <View style={styles.pricingList}>
                {tier.bullets.map((item) => (
                  <Text key={item} variant="bodySm" color="secondary">
                    • {item}
                  </Text>
                ))}
              </View>
              <Button
                size="lg"
                variant={tier.highlight ? "primary" : "secondary"}
                onPress={() => Linking.openURL(SiteLinks.appStoreUrl)}
              >
                {SiteLinks.ctaLabel}
              </Button>
            </Card>
          ))}
        </View>
      </SiteSection>

      {/* FAQ */}
      <SiteSection variant="elevated" as="article">
        <View style={styles.sectionHeader}>
          <Text variant="h2">Vanliga frågor</Text>
          <Text variant="body" color="secondary">
            Kort och konkret – mer får du i appen.
          </Text>
        </View>

        <View style={styles.faqGrid}>
          {FaqItems.map((item) => (
            <Card key={item.question} style={styles.faqCard}>
              <Text variant="h5">{item.question}</Text>
              <Text variant="bodySm" color="secondary">
                {item.answer}
              </Text>
            </Card>
          ))}
        </View>
      </SiteSection>

      {/* More resources */}
      <SiteSection as="article">
        <View style={styles.sectionHeader}>
          <Text variant="h2">Förbered dig smartare</Text>
          <Text variant="body" color="secondary">
            Vill du läsa mer? Börja med vår{" "}
            <InlineLink href="/hogskoleprovet/guide">kompletta guide</InlineLink>{" "}
            eller kolla{" "}
            <InlineLink href="/hogskoleprovet/provdatum-2026">
              provdatum 2026
            </InlineLink>
            .
          </Text>
        </View>

        <Card style={styles.seoCard}>
          <Text variant="bodySm" color="secondary">
            {SeoFooterText}
          </Text>
        </Card>
      </SiteSection>
    </SiteLayout>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    paddingTop: Spacing["6xl"],
    paddingBottom: Spacing["5xl"],
    position: "relative",
    overflow: "hidden",
  },
  heroGlow: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  heroBlob: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 210,
  },
  heroBlobPrimary: {
    top: -120,
    left: -120,
  },
  heroBlobBlue: {
    bottom: -160,
    right: -120,
  },
  heroContent: {
    gap: Spacing["3xl"],
  },
  heroContentWide: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroCopy: {
    flex: 1,
    gap: Spacing.lg,
  },
  heroBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  heroTitle: {
    fontFamily: FontFamily.extrabold,
    letterSpacing: -1.4,
  },
  heroSubtitle: {
    maxWidth: 520,
  },
  heroButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  heroMeta: {
    paddingTop: Spacing.sm,
  },
  heroMock: {
    width: "100%",
    maxWidth: 360,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.lg,
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    minWidth: 200,
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  statValue: {
    fontSize: FontSize.h2,
    fontFamily: FontFamily.extrabold,
  },
  sectionHeader: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  stepsRow: {
    gap: Spacing.lg,
  },
  stepsRowWide: {
    flexDirection: "row",
  },
  stepCard: {
    flex: 1,
    gap: Spacing.sm,
  },
  stepBadge: {
    alignSelf: "flex-start",
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  stepNumber: {
    fontFamily: FontFamily.black,
    fontSize: FontSize.sm,
  },
  featureRow: {
    gap: Spacing.lg,
  },
  featureRowWide: {
    flexDirection: "row",
  },
  featureCard: {
    flex: 1,
    gap: Spacing.md,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  featureIconText: {
    fontFamily: FontFamily.black,
  },
  featureMock: {
    marginTop: Spacing.sm,
  },
  pricingRow: {
    gap: Spacing.lg,
  },
  pricingRowWide: {
    flexDirection: "row",
  },
  pricingCard: {
    flex: 1,
    gap: Spacing.lg,
  },
  pricingHeader: {
    gap: Spacing.xs,
  },
  pricingPrice: {
    fontSize: FontSize.h2,
    fontFamily: FontFamily.black,
  },
  pricingList: {
    gap: Spacing.xs,
  },
  faqGrid: {
    gap: Spacing.lg,
  },
  faqCard: {
    gap: Spacing.sm,
  },
  seoCard: {
    padding: Spacing["3xl"],
  },
});
