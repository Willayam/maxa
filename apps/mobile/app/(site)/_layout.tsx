// Site layout - web only routes, redirect to tabs on native
import { Redirect, Slot } from 'expo-router';
import { Platform } from 'react-native';

export default function SiteLayout() {
  // Site routes are web-only, redirect native to tabs
  if (Platform.OS !== 'web') {
    return <Redirect href="/(tabs)" />;
  }
  return <Slot />;
}
