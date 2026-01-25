'use client';

import posthogClient from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { ReactNode, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const POSTHOG_API_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
// Default to EU for GDPR compliance
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';

// Initialize PostHog on client side
if (typeof window !== 'undefined' && POSTHOG_API_KEY) {
  posthogClient.init(POSTHOG_API_KEY, {
    api_host: POSTHOG_HOST,
    // Capture pageviews manually for Next.js App Router
    capture_pageview: false,
    capture_pageleave: true,
    // Respect Do Not Track browser setting
    respect_dnt: true,
    // Disable session recording initially (enable later if needed)
    disable_session_recording: true,
  });
}

/**
 * Tracks pageviews automatically when navigation changes
 * Required for Next.js App Router since automatic capture doesn't work
 */
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && POSTHOG_API_KEY) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + '?' + searchParams.toString();
      }
      posthogClient.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * PostHog analytics provider for Next.js
 * Automatically tracks pageviews on route changes
 */
export function PostHogProvider({ children }: { children: ReactNode }) {
  if (!POSTHOG_API_KEY) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('PostHog: No API key found, analytics disabled');
    }
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthogClient}>
      <PageViewTracker />
      {children}
    </PHProvider>
  );
}
