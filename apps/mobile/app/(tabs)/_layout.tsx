import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { Colors, Spacing, BorderRadius, Shadows, ShadowsDark } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface TabIconProps {
  name: IconSymbolName;
  color: string;
  focused: boolean;
}

function TabIcon({ name, color, focused }: TabIconProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View
      style={[
        styles.iconContainer,
        focused && {
          backgroundColor: colors.primary,
        },
      ]}
    >
      <IconSymbol
        size={22}
        name={name}
        color={focused ? colors.textOnPrimary : color}
      />
    </View>
  );
}

function TabBarBackground() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: colors.cardBackground },
      ]}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const shadows = colorScheme === 'dark' ? ShadowsDark : Shadows;
  const insets = useSafeAreaInsets();
  const tabBarPaddingBottom = Math.max(Spacing.sm, insets.bottom);
  const tabBarHeight = 60 + tabBarPaddingBottom;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => <TabBarBackground />,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: tabBarHeight,
          paddingTop: Spacing.sm,
          paddingBottom: tabBarPaddingBottom,
          ...shadows.md,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Idag',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="calendar"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trana"
        options={{
          title: 'Träna',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="book.fill"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="jag"
        options={{
          title: 'Jag',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="person.fill"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      {/* Hide the old explore screen */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 48,
    height: 32,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
