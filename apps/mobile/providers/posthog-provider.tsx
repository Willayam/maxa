import { PostHogProvider as PHProvider, usePostHog } from 'posthog-react-native';
import { usePathname, useSegments } from 'expo-router';
import { ReactNode, useEffect } from 'react';

const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY;
// Default to EU for GDPR compliance
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';

/**
 * Tracks screen views automatically when navigation changes
 */
function ScreenTracker() {
  const pathname = usePathname();
  const segments = useSegments();
  const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      posthog.screen(pathname, {
        segments: segments.join('/'),
      });
    }
  }, [pathname, segments, posthog]);

  return null;
}

interface PostHogProviderProps {
  children: ReactNode;
}

/**
 * PostHog analytics provider for React Native/Expo
 * Automatically tracks screen views and app lifecycle events
 *
 * Note: posthog-react-native doesn't support respect_dnt like the web SDK.
 * For privacy opt-out, use posthog.optOut() / posthog.optIn() methods.
 */
export function PostHogProvider({ children }: PostHogProviderProps) {
  if (!POSTHOG_API_KEY) {
    if (__DEV__) {
      console.warn('PostHog: No API key found, analytics disabled');
    }
    return <>{children}</>;
  }

  return (
    <PHProvider
      apiKey={POSTHOG_API_KEY}
      options={{
        host: POSTHOG_HOST,
        captureNativeAppLifecycleEvents: true,
        captureDeepLinks: true,
        enableSessionRecording: false,
      }}
    >
      <ScreenTracker />
      {children}
    </PHProvider>
  );
}
