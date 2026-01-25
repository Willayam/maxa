import { TestPageClient } from "./test-page-client";

// Disable static generation - this page uses real-time Convex data
export const dynamic = "force-dynamic";

export default function TestPage() {
  return <TestPageClient />;
}
