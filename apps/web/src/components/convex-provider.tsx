"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { createContext, ReactNode, useContext, useState } from "react";

// Context to let child components know if Convex is available
const ConvexAvailableContext = createContext(false);

/**
 * Returns true if ConvexProvider is active (NEXT_PUBLIC_CONVEX_URL is set).
 * Use this to conditionally render components that depend on Convex hooks.
 */
export function useConvexAvailable(): boolean {
  return useContext(ConvexAvailableContext);
}

// Module-level singleton so the client is reused across remounts
let convexClient: ConvexReactClient | null = null;

function getConvexClient(): ConvexReactClient | null {
  if (typeof window === "undefined") return null;
  if (!convexClient) {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      console.warn("NEXT_PUBLIC_CONVEX_URL not set - Convex features disabled");
      return null;
    }
    convexClient = new ConvexReactClient(convexUrl);
  }
  return convexClient;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [client] = useState(getConvexClient);

  if (!client) {
    return (
      <ConvexAvailableContext.Provider value={false}>
        {children}
      </ConvexAvailableContext.Provider>
    );
  }

  return (
    <ConvexAvailableContext.Provider value={true}>
      <ConvexProvider client={client}>{children}</ConvexProvider>
    </ConvexAvailableContext.Provider>
  );
}
