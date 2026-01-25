import { GamlaProvClient } from "./gamla-prov-client";

// Disable static generation - this page uses real-time Convex data
export const dynamic = "force-dynamic";

export default function GamlaProvPage() {
  return <GamlaProvClient />;
}
