import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export const triggerImpact = (style: Haptics.ImpactFeedbackStyle) => {
  if (Platform.OS === 'web') {
    return;
  }

  void Haptics.impactAsync(style).catch(() => {});
};
