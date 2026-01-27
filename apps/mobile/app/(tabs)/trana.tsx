import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Colors,
  Spacing,
  BorderRadius,
  FontFamily,
  FontSize,
  SectionColors,
  Primitives,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { triggerImpact } from '@/utils/haptics';

// Snappy animation config - no bouncy springs
const PRESS_IN_CONFIG = { duration: 80, easing: Easing.out(Easing.ease) };
const PRESS_OUT_CONFIG = { duration: 120, easing: Easing.out(Easing.ease) };

// HP Sections with mock progress data
const HP_SECTIONS = {
  verbal: [
    { code: 'ORD', name: 'Ordförståelse', progress: 45, questionsAnswered: 120 },
    { code: 'LÄS', name: 'Läsförståelse', progress: 62, questionsAnswered: 85 },
    { code: 'MEK', name: 'Meningskomplettering', progress: 38, questionsAnswered: 67 },
    { code: 'ELF', name: 'Engelsk läsförståelse', progress: 71, questionsAnswered: 94 },
  ],
  kvantitativ: [
    { code: 'XYZ', name: 'Matematisk problemlösning', progress: 55, questionsAnswered: 143 },
    { code: 'KVA', name: 'Kvantitativa jämförelser', progress: 28, questionsAnswered: 52 },
    { code: 'NOG', name: 'Kvantitativa resonemang', progress: 19, questionsAnswered: 31 },
    { code: 'DTK', name: 'Diagram, tabeller, kartor', progress: 67, questionsAnswered: 78 },
  ],
};

// Mock weakness order - sorted by weakness (lowest progress first)
// Will be replaced with real tracking in Phase 4
const WEAKNESS_ORDER = ['NOG', 'KVA', 'MEK', 'ORD'];

type TrainingMode = 'smart' | 'section' | 'simulate';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// 5-Dot Strength Indicator - like Duolingo crowns but chunky dots
interface StrengthDotsProps {
  progress: number; // 0-100
  accentColor: string;
  mutedColor: string;
}

function StrengthDots({ progress, accentColor, mutedColor }: StrengthDotsProps) {
  // Map 0-100% to 1-5 filled dots
  const filledDots = Math.max(1, Math.min(5, Math.ceil(progress / 20)));

  return (
    <View style={strengthDotsStyles.container}>
      {[1, 2, 3, 4, 5].map((dot) => (
        <View
          key={dot}
          style={[
            strengthDotsStyles.dot,
            {
              backgroundColor: dot <= filledDots ? accentColor : mutedColor,
            },
          ]}
        />
      ))}
    </View>
  );
}

const strengthDotsStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 4, // Slightly rounded squares = chunky/game-like
  },
});

interface ModeCardProps {
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
  isPro?: boolean;
  delay?: number;
}

function ModeCard({
  title,
  description,
  iconName,
  selected,
  onPress,
  isPro = false,
  delay = 0,
}: ModeCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.98, PRESS_IN_CONFIG);
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, PRESS_OUT_CONFIG);
  };

  const handlePress = () => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View entering={FadeInRight.duration(500).delay(delay)}>
      <AnimatedPressable
        style={animatedStyle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
      >
        <View
          style={[
            styles.modeCard,
            {
              backgroundColor: selected ? colors.primaryLight : colors.cardBackground,
              borderColor: selected ? colors.primary : colors.cardBorder,
              borderWidth: selected ? 3 : 2,
            },
          ]}
        >
          {/* Icon */}
          <View
            style={[
              styles.modeIconContainer,
              {
                backgroundColor: selected ? colors.primary : colors.backgroundTertiary,
              }
            ]}
          >
            <Ionicons
              name={iconName}
              size={26}
              color={selected ? colors.textOnPrimary : colors.textSecondary}
            />
          </View>

          {/* Content */}
          <View style={styles.modeContent}>
            <View style={styles.modeTitleRow}>
              <Text variant="h4">
                {title}
              </Text>
              {isPro && (
                <View style={[styles.proBadge]}>
                  <Ionicons name="star" size={10} color={Primitives.yellow[600]} />
                  <Text style={styles.proText}>PRO</Text>
                </View>
              )}
            </View>
            <Text variant="bodySm" color="secondary" numberOfLines={2}>
              {description}
            </Text>
          </View>

          {/* Selection indicator */}
          <View
            style={[
              styles.selectionIndicator,
              {
                borderColor: selected ? colors.primary : colors.border,
                backgroundColor: selected ? colors.primary : 'transparent',
              },
            ]}
          >
            {selected && (
              <Ionicons name="checkmark" size={18} color={colors.textOnPrimary} />
            )}
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

interface SectionTileProps {
  section: typeof HP_SECTIONS.verbal[0];
  selected: boolean;
  onPress: () => void;
  delay?: number;
}

function SectionTile({ section, selected, onPress, delay = 0 }: SectionTileProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const colorKey = section.code === 'LÄS' ? 'LÄS' : section.code;
  const sectionColor = SectionColors[colorKey as keyof typeof SectionColors];

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.96, PRESS_IN_CONFIG);
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, PRESS_OUT_CONFIG);
  };

  const handlePress = () => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(delay)}
      style={styles.sectionTileWrapper}
    >
      <AnimatedPressable
        style={animatedStyle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
      >
        <View
          style={[
            styles.sectionTile,
            {
              backgroundColor: selected ? colors.primaryLight : colors.cardBackground,
              borderColor: selected ? colors.primary : colors.cardBorder,
            },
          ]}
        >
          {/* Big section code - the star of the show */}
          <Text
            style={[
              styles.sectionCode,
              { color: sectionColor?.text || colors.text },
            ]}
          >
            {section.code}
          </Text>

          {/* 5-dot strength indicator */}
          <StrengthDots
            progress={section.progress}
            accentColor={sectionColor?.accent || colors.primary}
            mutedColor={colorScheme === 'dark' ? colors.backgroundTertiary : colors.border}
          />
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function TranaScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [selectedMode, setSelectedMode] = useState<TrainingMode>('smart');
  // Pre-select weakest section (first in WEAKNESS_ORDER) or first section if new user
  const [selectedSection, setSelectedSection] = useState<string>(WEAKNESS_ORDER[0] || 'ORD');
  const router = useRouter();

  // Handle mode change - pre-select weakest when entering section mode
  const handleModeChange = (mode: TrainingMode) => {
    setSelectedMode(mode);
    // Always have a section selected - default to weakest
    if (mode === 'section' && !selectedSection) {
      setSelectedSection(WEAKNESS_ORDER[0] || 'ORD');
    }
  };

  const handleStartTraining = () => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
    if (selectedMode === 'smart') {
      const weakestSections = WEAKNESS_ORDER.slice(0, 2);
      router.push({
        pathname: '/quiz',
        params: {
          section: 'SMART',
          focusSections: weakestSections.join(','),
        },
      });
    } else if (selectedMode === 'section') {
      // Start quiz with selected section (always has a value)
      router.push({
        pathname: '/quiz',
        params: { section: selectedSection },
      });
    } else if (selectedMode === 'simulate') {
      router.push({
        pathname: '/quiz',
        params: {
          section: 'SIMULATE',
          questionCount: '160',
          timed: 'true',
        },
      });
    }
  };

  // Section tile tap = SELECT
  const handleSectionPress = (sectionCode: string) => {
    setSelectedSection(sectionCode);
  };

  // Get button text based on state - NEVER disabled
  const getButtonText = () => {
    if (selectedMode === 'smart') return 'STARTA';
    if (selectedMode === 'section') return `STARTA ${selectedSection}`;
    return 'STARTA PROV';
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(100)}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <Text variant="hero" style={styles.heroTitle}>
              Träna
            </Text>
            {/* DEV: Animation playground link */}
            {__DEV__ && (
              <Pressable
                onPress={() => router.push('/quiz/playground')}
                style={[styles.devButton, { backgroundColor: colors.backgroundTertiary }]}
              >
                <Text variant="caption" color="secondary">🎛️ Dev</Text>
              </Pressable>
            )}
          </View>
          <Text variant="bodyLg" color="secondary">
            Välj hur du vill öva idag
          </Text>
        </Animated.View>

        {/* Training Mode Selection */}
        <View style={styles.modesSection}>
          <ModeCard
            title="Smart träning"
            description="AI väljer frågor baserat på dina svagaste områden"
            iconName="sparkles"
            selected={selectedMode === 'smart'}
            onPress={() => handleModeChange('smart')}
            delay={150}
          />
          <ModeCard
            title="Välj delprov"
            description="Fokusera på ett specifikt delområde av HP"
            iconName="grid-outline"
            selected={selectedMode === 'section'}
            onPress={() => handleModeChange('section')}
            delay={200}
          />
          <ModeCard
            title="Simulera HP"
            description="Fullt HP-prov under realistiska förhållanden"
            iconName="timer-outline"
            selected={selectedMode === 'simulate'}
            onPress={() => handleModeChange('simulate')}
            isPro
            delay={250}
          />
        </View>

        {/* Section Grid (shown when section mode selected) */}
        {selectedMode === 'section' && (
          <Animated.View entering={FadeInDown.duration(300)}>
            {/* Verbal Sections */}
            <View style={styles.sectionGroup}>
              <View style={styles.sectionGroupHeader}>
                <Text variant="h4">Verbala</Text>
                <View style={[styles.sectionBadge, { backgroundColor: SectionColors.ORD.light }]}>
                  <Text style={[styles.sectionBadgeText, { color: SectionColors.ORD.text }]}>4 delprov</Text>
                </View>
              </View>
              <View style={styles.sectionGrid}>
                {HP_SECTIONS.verbal.map((section, index) => (
                  <SectionTile
                    key={section.code}
                    section={section}
                    selected={selectedSection === section.code}
                    onPress={() => handleSectionPress(section.code)}
                    delay={index * 30}
                  />
                ))}
              </View>
            </View>

            {/* Quantitative Sections */}
            <View style={styles.sectionGroup}>
              <View style={styles.sectionGroupHeader}>
                <Text variant="h4">Kvantitativa</Text>
                <View style={[styles.sectionBadge, { backgroundColor: SectionColors.XYZ.light }]}>
                  <Text style={[styles.sectionBadgeText, { color: SectionColors.XYZ.text }]}>4 delprov</Text>
                </View>
              </View>
              <View style={styles.sectionGrid}>
                {HP_SECTIONS.kvantitativ.map((section, index) => (
                  <SectionTile
                    key={section.code}
                    section={section}
                    selected={selectedSection === section.code}
                    onPress={() => handleSectionPress(section.code)}
                    delay={index * 30 + 120}
                  />
                ))}
              </View>
            </View>
          </Animated.View>
        )}

        {/* Quick Stats for Smart Mode */}
        {selectedMode === 'smart' && (
          <Animated.View
            entering={FadeInDown.duration(400).delay(300)}
            style={styles.smartModeInfo}
          >
            <View style={[styles.smartInfoCard, { backgroundColor: colors.backgroundTertiary }]}>
              <View style={styles.smartInfoContent}>
                <View style={[styles.smartInfoIcon, { backgroundColor: colors.primary }]}>
                  <Ionicons name="flash" size={20} color={colors.textOnPrimary} />
                </View>
                <View style={styles.smartInfoText}>
                  <Text variant="h5" style={{ marginBottom: Spacing.xxs }}>
                    10 frågor
                  </Text>
                  <Text variant="bodySm" color="secondary">
                    ~5 min • Fokus på {WEAKNESS_ORDER[0]} och {WEAKNESS_ORDER[1]}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Simulate Mode Info */}
        {selectedMode === 'simulate' && (
          <Animated.View
            entering={FadeInDown.duration(400).delay(300)}
            style={styles.simulateInfo}
          >
            <Card>
              <View style={styles.simulateContent}>
                <View style={[styles.simulateIconContainer, { backgroundColor: colors.primary }]}>
                  <Ionicons name="school" size={32} color={colors.textOnPrimary} />
                </View>
                <Text variant="h3" style={styles.simulateTitle}>Simulerat HP</Text>
                <Text variant="body" color="secondary" style={styles.simulateSubtitle}>
                  Upplev ett fullständigt högskoleprov
                </Text>

                <View style={styles.simulateStats}>
                  <View style={styles.simulateStat}>
                    <Text style={[styles.simulateStatValue, { color: colors.primary }]}>160</Text>
                    <Text variant="caption" color="secondary">frågor</Text>
                  </View>
                  <View style={[styles.simulateDivider, { backgroundColor: colors.divider }]} />
                  <View style={styles.simulateStat}>
                    <Text style={[styles.simulateStatValue, { color: colors.streak }]}>220</Text>
                    <Text variant="caption" color="secondary">minuter</Text>
                  </View>
                  <View style={[styles.simulateDivider, { backgroundColor: colors.divider }]} />
                  <View style={styles.simulateStat}>
                    <Text style={[styles.simulateStatValue, { color: colors.success }]}>8</Text>
                    <Text variant="caption" color="secondary">delprov</Text>
                  </View>
                </View>

                <View style={[styles.tipBox, { backgroundColor: colors.backgroundTertiary }]}>
                  <Ionicons name="bulb-outline" size={16} color={colors.textSecondary} style={{ marginRight: Spacing.sm }} />
                  <Text variant="bodySm" color="secondary" style={styles.tipText}>
                    Sätt av ostörd tid och simulera provmiljön för bästa resultat
                  </Text>
                </View>
              </View>
            </Card>
          </Animated.View>
        )}

        {/* Start Button - NEVER disabled */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(300)}
          style={styles.startButtonContainer}
        >
          <Button
            fullWidth
            size="xl"
            onPress={handleStartTraining}
            leftIcon={<Ionicons name="play" size={20} color={colors.textOnPrimary} />}
          >
            {getButtonText()}
          </Button>
        </Animated.View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  header: {
    marginBottom: Spacing['2xl'],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTitle: {
    letterSpacing: -1.5,
    marginBottom: Spacing.xs,
  },
  devButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  modesSection: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
  },
  modeIconContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  modeContent: {
    flex: 1,
  },
  modeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xxs,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.md,
    backgroundColor: Primitives.yellow[100],
    borderWidth: 1,
    borderColor: Primitives.yellow[400],
  },
  proText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.bold,
    letterSpacing: 0.5,
    color: Primitives.yellow[700],
  },
  selectionIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },
  sectionGroup: {
    marginBottom: Spacing.xl,
  },
  sectionGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  sectionBadgeText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semibold,
  },
  sectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  sectionTileWrapper: {
    width: '48%',
  },
  sectionTile: {
    width: '100%',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  sectionCode: {
    fontSize: 32, // BIG and prominent
    fontFamily: FontFamily.black,
    letterSpacing: -0.5,
    lineHeight: 44, // Extra line height to prevent diacritic clipping (Ä, Ö)
  },
  smartModeInfo: {
    marginBottom: Spacing.xl,
  },
  smartInfoCard: {
    padding: Spacing.base,
    borderRadius: BorderRadius['2xl'],
  },
  smartInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smartInfoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  smartInfoText: {
    flex: 1,
  },
  simulateInfo: {
    marginBottom: Spacing.xl,
  },
  simulateContent: {
    alignItems: 'center',
  },
  simulateIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  simulateTitle: {
    marginBottom: Spacing.xs,
  },
  simulateSubtitle: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  simulateStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  simulateStat: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  simulateDivider: {
    width: 1,
    height: 40,
  },
  simulateStatValue: {
    fontSize: FontSize.h1,
    fontFamily: FontFamily.bold,
    lineHeight: 36,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    width: '100%',
  },
  tipText: {
    flex: 1,
  },
  startButtonContainer: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  bottomPadding: {
    height: Spacing['4xl'],
  },
});
