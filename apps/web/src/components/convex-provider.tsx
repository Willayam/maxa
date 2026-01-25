"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useState, useEffect } from "react";

// Create client lazily to avoid SSG/SSR issues
let convexClient: ConvexReactClient | null = null;

function getConvexClient(): ConvexReactClient | null {
  if (!convexClient) {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      // Allow pages that don't need Convex to work without the URL
      console.warn("NEXT_PUBLIC_CONVEX_URL not set - Convex features disabled");
      return null;
    }
    convexClient = new ConvexReactClient(convexUrl);
  }
  return convexClient;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<ConvexReactClient | null>(null);

  useEffect(() => {
    setClient(getConvexClient());
  }, []);

  // During SSR/SSG, render children without Convex provider
  if (!client) {
    return <>{children}</>;
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
