'use client';

import posthogClient from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { ReactNode, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const POSTHOG_API_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
// Default to EU for GDPR compliance
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';

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
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && POSTHOG_API_KEY) {
      posthogClient.init(POSTHOG_API_KEY, {
        api_host: POSTHOG_HOST,
        capture_pageview: false,
        capture_pageleave: true,
        respect_dnt: true,
        disable_session_recording: true,
      });
      initialized.current = true;
    }
  }, []);

  if (!POSTHOG_API_KEY) {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthogClient}>
      <PageViewTracker />
      {children}
    </PHProvider>
  );
}
