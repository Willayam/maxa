import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // A test administration (e.g., "Hösten 2024")
  tests: defineTable({
    year: v.number(),
    season: v.union(v.literal("vår"), v.literal("höst")),
    date: v.string(), // "2024-10-20"
    slug: v.string(), // "hosten-2024" for URLs
    sourceUrl: v.optional(v.string()), // studera.nu page
  })
    .index("by_slug", ["slug"])
    .index("by_year_season", ["year", "season"]),

  // Individual PDF files linked to a test
  testFiles: defineTable({
    testId: v.id("tests"),
    storageId: v.id("_storage"),
    fileType: v.union(
      v.literal("provpass"),
      v.literal("facit"),
      v.literal("kallhanvisning"),
      v.literal("normering")
    ),
    section: v.optional(
      v.union(v.literal("verbal"), v.literal("kvantitativ"))
    ),
    passNumber: v.optional(v.number()),
    originalFilename: v.string(),
    sizeBytes: v.number(),
  }).index("by_test", ["testId"]),

  // Waitlist signups with double opt-in
  waitlist: defineTable({
    email: v.string(),
    createdAt: v.number(),
    source: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("confirmed")),
    confirmationToken: v.string(),
    confirmationSentAt: v.optional(v.number()),
    confirmedAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_token", ["confirmationToken"]),
});
