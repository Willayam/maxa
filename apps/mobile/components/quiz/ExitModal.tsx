import React from 'react';
import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ExitModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ExitModal({ visible, onCancel, onConfirm }: ExitModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { width } = useWindowDimensions();

  // Modal card: 85% width, max 340px
  const modalWidth = Math.min(width * 0.85, 340);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <AnimatedPressable
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={[styles.backdrop, { backgroundColor: colors.overlay }]}
          onPress={onCancel}
        />

        {/* Modal Card */}
        <Animated.View
          entering={SlideInDown.springify().damping(20).stiffness(200)}
          exiting={SlideOutDown.springify().damping(20).stiffness(200)}
          style={[
            styles.modalCard,
            {
              width: modalWidth,
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          {/* Title */}
          <Text variant="h3" align="center" style={styles.title}>
            Vill du avsluta?
          </Text>

          {/* Message */}
          <Text variant="body" color="secondary" align="center" style={styles.message}>
            Din progress sparas inte om du avslutar nu.
          </Text>

          {/* Buttons */}
          <View style={styles.buttons}>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onPress={onCancel}
              style={styles.continueButton}
            >
              Fortsätt öva
            </Button>

            <Button
              variant="ghost"
              size="lg"
              fullWidth
              onPress={onConfirm}
            >
              Avsluta
            </Button>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    borderWidth: 2,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  message: {
    marginBottom: Spacing.xl,
  },
  buttons: {
    gap: Spacing.sm,
  },
  continueButton: {},
});
