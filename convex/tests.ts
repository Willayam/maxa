import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// List all tests, sorted by year desc then season
export const list = query({
  args: {},
  handler: async (ctx) => {
    const tests = await ctx.db.query("tests").collect();
    return tests.sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      // höst comes after vår in the same year
      return a.season === "höst" ? -1 : 1;
    });
  },
});

// Get a single test by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

// Create a new test (used by upload script)
export const create = mutation({
  args: {
    adminSecret: v.string(),
    year: v.number(),
    season: v.union(v.literal("vår"), v.literal("höst")),
    date: v.string(),
    slug: v.string(),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.adminSecret !== process.env.ADMIN_SECRET) {
      throw new Error("Unauthorized");
    }
    // Check if test already exists
    const existing = await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("tests", args);
  },
});
