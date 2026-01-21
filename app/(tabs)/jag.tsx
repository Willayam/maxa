import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeInUp,
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

// Mock user data
const MOCK_USER = {
  name: 'Emma Andersson',
  email: 'emma@example.com',
  avatar: null,
  joinedDate: new Date('2024-11-15'),
  isPro: false,

  // Progress
  currentScore: 1.2,
  goalScore: 1.8,
  streak: 12,
  longestStreak: 18,
  totalQuestions: 847,
  correctRate: 68,

  // Weaknesses
  sections: [
    { code: 'NOG', name: 'Kvantitativa resonemang', level: 'weak', progress: 19 },
    { code: 'KVA', name: 'Kvantitativa jämförelser', level: 'weak', progress: 28 },
    { code: 'MEK', name: 'Meningskomplettering', level: 'medium', progress: 38 },
    { code: 'ORD', name: 'Ordförståelse', level: 'medium', progress: 45 },
    { code: 'XYZ', name: 'Matematisk problemlösning', level: 'medium', progress: 55 },
    { code: 'LÄS', name: 'Läsförståelse', level: 'strong', progress: 62 },
    { code: 'DTK', name: 'Diagram, tabeller, kartor', level: 'strong', progress: 67 },
    { code: 'ELF', name: 'Engelsk läsförståelse', level: 'strong', progress: 71 },
  ],

  // Coach
  coachStyle: 'hype' as 'hype' | 'calm' | 'strict',
  aiAsksToday: 3,
  aiAsksLimit: 10,
};

type CoachStyle = 'hype' | 'calm' | 'strict';

const COACH_STYLES: { id: CoachStyle; label: string; emoji: string; description: string }[] = [
  { id: 'hype', label: 'Hype', emoji: '🔥', description: 'Energisk' },
  { id: 'calm', label: 'Lugn', emoji: '🧘', description: 'Stöttande' },
  { id: 'strict', label: 'Strikt', emoji: '💪', description: 'Krävande' },
];

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  bgColor: string;
  delay?: number;
}

function StatCard({ label, value, icon, color, bgColor, delay = 0 }: StatCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(delay)}
      style={styles.statCard}
    >
      <View style={[styles.statCardInner, { backgroundColor: bgColor, borderColor: colors.cardBorder }]}>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text variant="caption" color="secondary" style={styles.statLabel}>
          {label}
        </Text>
      </View>
    </Animated.View>
  );
}

interface WeaknessTileProps {
  section: typeof MOCK_USER.sections[0];
  delay?: number;
}

function WeaknessTile({ section, delay = 0 }: WeaknessTileProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const getStatusColor = () => {
    switch (section.level) {
      case 'weak':
        return colors.progressWeak;
      case 'medium':
        return colors.progressMedium;
      case 'strong':
        return colors.progressStrong;
    }
  };

  const sectionColor = SectionColors[section.code as keyof typeof SectionColors];
  const statusColor = getStatusColor();

  return (
    <Animated.View entering={FadeInDown.duration(300).delay(delay)}>
      <View style={[styles.weaknessTile, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
        <View style={styles.weaknessLeft}>
          <View
            style={[
              styles.weaknessCodeBadge,
              {
                backgroundColor:
                  colorScheme === 'dark'
                    ? sectionColor?.dark
                    : sectionColor?.light,
              },
            ]}
          >
            <Text
              style={[
                styles.weaknessCode,
                { color: sectionColor?.text || colors.text },
              ]}
            >
              {section.code}
            </Text>
          </View>
          <View style={styles.weaknessInfo}>
            <Text variant="bodySm" numberOfLines={1} style={styles.weaknessName}>
              {section.name}
            </Text>
            <View style={styles.weaknessProgressBar}>
              <ProgressBar
                progress={section.progress}
                size="sm"
                color={statusColor}
              />
            </View>
          </View>
        </View>
        <View style={[styles.weaknessPercentBadge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.weaknessPercent, { color: statusColor }]}>
            {section.progress}%
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function JagScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [coachStyle, setCoachStyle] = useState<CoachStyle>(MOCK_USER.coachStyle);

  // Calculate progress percentage toward goal
  const progressToGoal = MOCK_USER.goalScore > 0
    ? Math.min(
        100,
        Math.max(0, Math.round((MOCK_USER.currentScore / MOCK_USER.goalScore) * 100))
      )
    : 0;

  const handleCoachStyleChange = (style: CoachStyle) => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Light);
    setCoachStyle(style);
  };

  const handleUpgradePress = () => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
    console.log('Open upgrade');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with avatar and profile */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(100)}
          style={styles.header}
        >
          <Card style={styles.profileCard}>
            <View style={styles.profileSection}>
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.avatarText, { color: colors.primary }]}>
                    {MOCK_USER.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
              </View>

              <View style={styles.profileInfo}>
                <Text variant="h3">{MOCK_USER.name.split(' ')[0]}</Text>
                <Text variant="bodySm" color="secondary">
                  {MOCK_USER.streak} dagars streak 🔥
                </Text>
                <Text variant="caption" color="tertiary">
                  Medlem sedan {MOCK_USER.joinedDate.toLocaleDateString('sv-SE', { month: 'short', year: 'numeric' })}
                </Text>
              </View>
            </View>

            {!MOCK_USER.isPro && (
              <Button
                fullWidth
                size="lg"
                onPress={handleUpgradePress}
                leftIcon={<Text style={styles.upgradeIcon}>⭐</Text>}
              >
                Uppgradera till Pro
              </Button>
            )}
          </Card>
        </Animated.View>

        {/* Progress Card */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <Card style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text variant="h4">Din utveckling</Text>
              <View style={[styles.progressBadge, { backgroundColor: colors.primaryLight }]}>
                <Text variant="caption" color="primary">
                  {Math.round(progressToGoal)}% av målet
                </Text>
              </View>
            </View>

            <View style={styles.progressContent}>
              <View style={styles.progressCircleContainer}>
                <View style={[styles.progressCircle, { borderColor: colors.progressTrack }]}>
                  <Text style={[styles.currentScore, { color: colors.primary }]}>
                    {MOCK_USER.currentScore.toFixed(1)}
                  </Text>
                  <Text variant="caption" color="tertiary">
                    nu
                  </Text>
                </View>
              </View>

              <View style={styles.progressDetails}>
                <View style={styles.progressRow}>
                  <View style={styles.progressLabelRow}>
                    <View style={[styles.progressDot, { backgroundColor: colors.primary }]} />
                    <Text variant="bodySm" color="secondary">Nuvarande</Text>
                  </View>
                  <Text variant="h4" color="primary">{MOCK_USER.currentScore.toFixed(1)}</Text>
                </View>

                <View style={[styles.progressDivider, { backgroundColor: colors.divider }]} />

                <View style={styles.progressRow}>
                  <View style={styles.progressLabelRow}>
                    <View style={[styles.progressDot, { backgroundColor: colors.textTertiary }]} />
                    <Text variant="bodySm" color="secondary">Mål</Text>
                  </View>
                  <Text variant="h4">{MOCK_USER.goalScore.toFixed(1)}</Text>
                </View>

                <View style={[styles.progressDivider, { backgroundColor: colors.divider }]} />

                <View style={styles.progressRow}>
                  <View style={styles.progressLabelRow}>
                    <View style={[styles.progressDot, { backgroundColor: colors.streak }]} />
                    <Text variant="bodySm" color="secondary">Kvar</Text>
                  </View>
                  <Text variant="h4" color="streak">
                    +{(MOCK_USER.goalScore - MOCK_USER.currentScore).toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Frågor"
            value={MOCK_USER.totalQuestions.toLocaleString()}
            icon="📝"
            color={colors.primary}
            bgColor={colors.primaryLight}
            delay={250}
          />
          <StatCard
            label="Streak"
            value={`${MOCK_USER.streak}d`}
            icon="🔥"
            color={colors.streak}
            bgColor={colorScheme === 'dark' ? '#3D2800' : '#FFF3E0'}
            delay={300}
          />
          <StatCard
            label="Bästa"
            value={`${MOCK_USER.longestStreak}d`}
            icon="🏆"
            color={colors.star}
            bgColor={colors.primaryLight}
            delay={350}
          />
          <StatCard
            label="Rätt"
            value={`${MOCK_USER.correctRate}%`}
            icon="✓"
            color={colors.success}
            bgColor={colors.successLight}
            delay={400}
          />
        </View>

        {/* Weaknesses Section */}
        <Animated.View entering={FadeInDown.duration(500).delay(450)}>
          <View style={styles.sectionHeader}>
            <Text variant="h4">Dina områden</Text>
            <View style={[styles.sortBadge, { backgroundColor: colors.backgroundTertiary }]}>
              <Text variant="caption" color="tertiary">Svagaste först</Text>
            </View>
          </View>
          <View style={styles.weaknessList}>
            {MOCK_USER.sections.slice(0, 4).map((section, index) => (
              <WeaknessTile
                key={section.code}
                section={section}
                delay={index * 50}
              />
            ))}
          </View>
          <Pressable style={[styles.showMoreButton, { borderColor: colors.border }]}>
            <Text variant="bodySm" color="primary">
              Visa alla 8 områden →
            </Text>
          </Pressable>
        </Animated.View>

        {/* AI Coach Section */}
        <Animated.View entering={FadeInUp.duration(500).delay(500)}>
          <Card style={styles.coachCard}>
            <View style={styles.coachHeader}>
              <View style={[styles.coachAvatar, { backgroundColor: colors.backgroundTertiary }]}>
                <Text style={styles.coachEmoji}>🤖</Text>
              </View>
              <View style={styles.coachInfo}>
                <View style={styles.coachNameRow}>
                  <Text variant="h4">Max</Text>
                  <View style={[styles.aiBadge, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.aiBadgeText, { color: colors.textOnPrimary }]}>AI COACH</Text>
                  </View>
                </View>
                <View style={styles.coachUsage}>
                  <ProgressBar
                    progress={(MOCK_USER.aiAsksToday / MOCK_USER.aiAsksLimit) * 100}
                    size="sm"
                    style={styles.coachProgressBar}
                  />
                  <Text variant="caption" color="tertiary">
                    {MOCK_USER.aiAsksToday}/{MOCK_USER.aiAsksLimit} frågor idag
                  </Text>
                </View>
              </View>
            </View>

            <Text variant="label" color="secondary" style={styles.coachStyleLabel}>
              Välj coachstil
            </Text>
            <View style={styles.coachStyles}>
              {COACH_STYLES.map((style) => {
                const isSelected = coachStyle === style.id;
                return (
                  <Pressable
                    key={style.id}
                    style={[
                      styles.coachStyleOption,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => handleCoachStyleChange(style.id)}
                  >
                    <Text style={styles.coachStyleEmoji}>{style.emoji}</Text>
                    <Text
                      variant="label"
                      style={{ color: isSelected ? colors.textOnPrimary : colors.text }}
                    >
                      {style.label}
                    </Text>
                    <Text
                      variant="caption"
                      style={[
                        styles.coachStyleDesc,
                        { color: isSelected ? colors.textOnPrimary + '99' : colors.textTertiary },
                      ]}
                    >
                      {style.description}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>
        </Animated.View>

        {/* Settings Links */}
        <Animated.View
          entering={FadeInUp.duration(500).delay(550)}
          style={styles.settingsSection}
        >
          <Card padding="none">
            {[
              { label: 'Ändra mål', icon: '🎯', color: colors.primary },
              { label: 'Notifikationer', icon: '🔔', color: colors.warning },
              { label: 'Hjälp & Support', icon: '❓', color: colors.success },
              { label: 'Logga ut', icon: '👋', color: colors.error },
            ].map((item, index, arr) => (
              <Pressable
                key={item.label}
                style={[
                  styles.settingsItem,
                  index < arr.length - 1 && { borderBottomColor: colors.divider, borderBottomWidth: 1 },
                ]}
              >
                <View style={[styles.settingsIconContainer, { backgroundColor: item.color + '20' }]}>
                  <Text style={styles.settingsIcon}>{item.icon}</Text>
                </View>
                <Text variant="body" style={styles.settingsLabel}>
                  {item.label}
                </Text>
                <Text style={[styles.settingsArrow, { color: colors.textTertiary }]}>
                  →
                </Text>
              </Pressable>
            ))}
          </Card>
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
    marginBottom: Spacing.lg,
  },
  profileCard: {
    // Card styles applied automatically
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.base,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.h2,
    fontFamily: FontFamily.bold,
  },
  profileInfo: {
    flex: 1,
  },
  upgradeIcon: {
    fontSize: 18,
  },
  progressCard: {
    marginBottom: Spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  progressBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircleContainer: {
    marginRight: Spacing.xl,
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentScore: {
    fontSize: FontSize.h2,
    fontFamily: FontFamily.bold,
    lineHeight: 32,
  },
  progressDetails: {
    flex: 1,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  progressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressDivider: {
    height: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    width: '47%',
  },
  statCardInner: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 2,
  },
  statIcon: {
    fontSize: 24,
    lineHeight: 32,
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: FontSize.h2,
    fontFamily: FontFamily.bold,
    lineHeight: FontSize.h2 * 1.2,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sortBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  weaknessList: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  weaknessTile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 2,
    overflow: 'hidden',
  },
  weaknessLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  weaknessCodeBadge: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  weaknessCode: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
  },
  weaknessInfo: {
    flex: 1,
  },
  weaknessName: {
    marginBottom: Spacing.xs,
  },
  weaknessProgressBar: {
    width: '85%',
  },
  weaknessPercentBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
  },
  weaknessPercent: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
  },
  showMoreButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    marginBottom: Spacing.xl,
  },
  coachCard: {
    marginBottom: Spacing.xl,
  },
  coachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  coachAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  coachEmoji: {
    fontSize: 32,
  },
  coachInfo: {
    flex: 1,
  },
  coachNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  aiBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  aiBadgeText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    letterSpacing: 0.5,
  },
  coachUsage: {
    gap: Spacing.xs,
  },
  coachProgressBar: {
    width: '100%',
  },
  coachStyleLabel: {
    marginBottom: Spacing.md,
  },
  coachStyles: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  coachStyleOption: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
  },
  coachStyleEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  coachStyleDesc: {
    textAlign: 'center',
    marginTop: Spacing.xxs,
  },
  settingsSection: {
    marginBottom: Spacing.lg,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.base,
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingsIcon: {
    fontSize: 18,
  },
  settingsLabel: {
    flex: 1,
  },
  settingsArrow: {
    fontSize: 18,
  },
  bottomPadding: {
    height: Spacing['4xl'],
  },
});
