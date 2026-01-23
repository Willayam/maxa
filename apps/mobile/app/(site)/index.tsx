// Fallback for native - site pages are web-only
import { Redirect } from 'expo-router';

export default function SiteIndex() {
  return <Redirect href="/(tabs)" />;
}
