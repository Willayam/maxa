// Fallback for native - site pages are web-only
import { Redirect } from 'expo-router';

export default function GuidePage() {
  return <Redirect href="/(tabs)" />;
}
