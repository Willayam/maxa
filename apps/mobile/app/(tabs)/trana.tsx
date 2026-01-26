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
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import {
  Colors,
  Spacing,
  BorderRadius,
  FontFamily,
  FontSize,
  SectionColors,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { triggerImpact } from '@/utils/haptics';

// HP Sections with mock progress data
const HP_SECTIONS = {
  verbal: [
    { code: 'ORD', name: 'Ordforstaelse', progress: 45, questionsAnswered: 120 },
    { code: 'LAS', name: 'Lasforstaelse', progress: 62, questionsAnswered: 85 },
    { code: 'MEK', name: 'Meningskomplettering', progress: 38, questionsAnswered: 67 },
    { code: 'ELF', name: 'Engelsk lasforstaelse', progress: 71, questionsAnswered: 94 },
  ],
  kvantitativ: [
    { code: 'XYZ', name: 'Matematisk problemlosning', progress: 55, questionsAnswered: 143 },
    { code: 'KVA', name: 'Kvantitativa jamforelser', progress: 28, questionsAnswered: 52 },
    { code: 'NOG', name: 'Kvantitativa resonemang', progress: 19, questionsAnswered: 31 },
    { code: 'DTK', name: 'Diagram, tabeller, kartor', progress: 67, questionsAnswered: 78 },
  ],
};

// Mock weakness order - sorted by weakness (lowest progress first)
// Will be replaced with real tracking in Phase 4
const WEAKNESS_ORDER = ['NOG', 'KVA', 'MEK', 'ORD'];

type TrainingMode = 'smart' | 'section' | 'simulate';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ModeCardProps {
  title: string;
  description: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
  isPro?: boolean;
  delay?: number;
}

function ModeCard({
  title,
  description,
  icon,
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
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
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
              backgroundColor: colors.cardBackground,
              borderColor: selected ? colors.primary : colors.cardBorder,
              borderWidth: selected ? 3 : 2,
            },
          ]}
        >
          {/* Icon */}
          <View style={[styles.modeIconContainer, { backgroundColor: selected ? colors.primaryLight : colors.backgroundTertiary }]}>
            <Text style={styles.modeIcon}>{icon}</Text>
          </View>

          {/* Content */}
          <View style={styles.modeContent}>
            <View style={styles.modeTitleRow}>
              <Text variant="h4">
                {title}
              </Text>
              {isPro && (
                <View style={[styles.proBadge, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.proText, { color: colors.textOnPrimary }]}>PRO</Text>
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
              <Text style={[styles.checkmark, { color: colors.textOnPrimary }]}>✓</Text>
            )}
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

interface SectionTileProps {
  section: typeof HP_SECTIONS.verbal[0];
  onPress: () => void;
  delay?: number;
}

function SectionTile({ section, onPress, delay = 0 }: SectionTileProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const sectionColor = SectionColors[section.code as keyof typeof SectionColors];

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  // Progress color based on performance
  const getProgressColor = () => {
    if (section.progress < 33) return colors.progressWeak;
    if (section.progress < 66) return colors.progressMedium;
    return colors.progressStrong;
  };

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(delay)}>
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
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionCode,
                { color: sectionColor?.text || colors.text },
              ]}
            >
              {section.code}
            </Text>
            <Text
              style={[
                styles.sectionProgress,
                { color: getProgressColor() },
              ]}
            >
              {section.progress}%
            </Text>
          </View>
          <Text variant="caption" color="secondary" numberOfLines={1}>
            {section.name}
          </Text>
          <View style={styles.sectionProgressBar}>
            <ProgressBar
              progress={section.progress}
              size="sm"
              color={sectionColor?.accent || colors.primary}
            />
          </View>
          <Text variant="caption" color="tertiary">
            {section.questionsAnswered} fragor
          </Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function TranaScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [selectedMode, setSelectedMode] = useState<TrainingMode>('smart');
  const router = useRouter();

  const handleStartTraining = () => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
    if (selectedMode === 'smart') {
      // Pick 2 weakest sections for smart mix
      const weakestSections = WEAKNESS_ORDER.slice(0, 2);
      router.push({
        pathname: '/quiz',
        params: {
          section: 'SMART',
          focusSections: weakestSections.join(','),
        },
      });
    } else if (selectedMode === 'section') {
      // Section mode handled by section tile press
      // Button shows instruction to select section above
      console.log('Select a section above to start');
    } else if (selectedMode === 'simulate') {
      // Simulate mode - full HP test
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

  const handleSectionPress = (sectionCode: string) => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/quiz',
      params: { section: sectionCode },
    });
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
            Valj hur du vill ova idag
          </Text>
        </Animated.View>

        {/* Training Mode Selection */}
        <View style={styles.modesSection}>
          <ModeCard
            title="Smart träning"
            description="AI valjer fragor baserat pa dina svagaste omraden"
            icon="🎯"
            selected={selectedMode === 'smart'}
            onPress={() => setSelectedMode('smart')}
            delay={150}
          />
          <ModeCard
            title="Valj delprov"
            description="Fokusera pa ett specifikt delomrade av HP"
            icon="📚"
            selected={selectedMode === 'section'}
            onPress={() => setSelectedMode('section')}
            delay={200}
          />
          <ModeCard
            title="Simulera HP"
            description="Fullt HP-prov under realistiska forhallanden"
            icon="⏱️"
            selected={selectedMode === 'simulate'}
            onPress={() => setSelectedMode('simulate')}
            isPro
            delay={250}
          />
        </View>

        {/* Section Grid (shown when section mode selected) */}
        {selectedMode === 'section' && (
          <Animated.View entering={FadeInDown.duration(400)}>
            {/* Verbal Sections */}
            <View style={styles.sectionGroup}>
              <View style={styles.sectionGroupHeader}>
                <Text variant="h4">Verbala</Text>
                <View style={[styles.sectionBadge, { backgroundColor: colors.primaryLight }]}>
                  <Text variant="caption" color="primary">4 delprov</Text>
                </View>
              </View>
              <View style={styles.sectionGrid}>
                {HP_SECTIONS.verbal.map((section, index) => (
                  <SectionTile
                    key={section.code}
                    section={section}
                    onPress={() => handleSectionPress(section.code)}
                    delay={index * 50}
                  />
                ))}
              </View>
            </View>

            {/* Quantitative Sections */}
            <View style={styles.sectionGroup}>
              <View style={styles.sectionGroupHeader}>
                <Text variant="h4">Kvantitativa</Text>
                <View style={[styles.sectionBadge, { backgroundColor: colors.successLight }]}>
                  <Text variant="caption" color="success">4 delprov</Text>
                </View>
              </View>
              <View style={styles.sectionGrid}>
                {HP_SECTIONS.kvantitativ.map((section, index) => (
                  <SectionTile
                    key={section.code}
                    section={section}
                    onPress={() => handleSectionPress(section.code)}
                    delay={index * 50 + 200}
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
            <Card>
              <View style={styles.smartInfoContent}>
                <View style={[styles.smartInfoIcon, { backgroundColor: colors.primaryLight }]}>
                  <Text style={styles.smartInfoEmoji}>🎯</Text>
                </View>
                <View style={styles.smartInfoText}>
                  <Text variant="h5" style={{ marginBottom: Spacing.xxs }}>
                    10 fragor
                  </Text>
                  <Text variant="bodySm" color="secondary">
                    ~5 min • Fokus pa {WEAKNESS_ORDER[0]} och {WEAKNESS_ORDER[1]}
                  </Text>
                </View>
              </View>
            </Card>
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
                <View style={[styles.simulateIconContainer, { backgroundColor: colors.primaryLight }]}>
                  <Text style={styles.simulateIcon}>🎓</Text>
                </View>
                <Text variant="h3" style={styles.simulateTitle}>Simulerat HP</Text>
                <Text variant="body" color="secondary" style={styles.simulateSubtitle}>
                  Upplev ett fullstandigt hogskoleprovet
                </Text>

                <View style={styles.simulateStats}>
                  <View style={styles.simulateStat}>
                    <Text style={[styles.simulateStatValue, { color: colors.primary }]}>160</Text>
                    <Text variant="caption" color="secondary">fragor</Text>
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
                  <Text style={styles.tipEmoji}>💡</Text>
                  <Text variant="bodySm" color="secondary" style={styles.tipText}>
                    Satt av ostord tid och simulera provmiljon for basta resultat
                  </Text>
                </View>
              </View>
            </Card>
          </Animated.View>
        )}

        {/* Start Button */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(400)}
          style={styles.startButtonContainer}
        >
          <Button
            fullWidth
            size="xl"
            onPress={handleStartTraining}
            disabled={selectedMode === 'section'}
          >
            {selectedMode === 'smart' && '🎯 STARTA SMART TRANING'}
            {selectedMode === 'section' && 'VALJ DELPROV OVAN ↑'}
            {selectedMode === 'simulate' && '⏱️ STARTA SIMULERAT PROV'}
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
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  modeIcon: {
    fontSize: 28,
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
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  proText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.bold,
    letterSpacing: 0.5,
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
  checkmark: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
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
  sectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  sectionTile: {
    width: '47%',
    padding: Spacing.md,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 2,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  sectionCode: {
    fontSize: FontSize.h3,
    fontFamily: FontFamily.bold,
  },
  sectionProgress: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
  },
  sectionProgressBar: {
    marginVertical: Spacing.sm,
  },
  smartModeInfo: {
    marginBottom: Spacing.xl,
  },
  smartInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smartInfoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  smartInfoEmoji: {
    fontSize: 24,
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
  simulateIcon: {
    fontSize: 36,
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
  tipEmoji: {
    fontSize: 16,
    marginRight: Spacing.sm,
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
