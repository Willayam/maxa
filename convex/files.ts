import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all files for a test
export const getByTest = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("testFiles")
      .withIndex("by_test", (q) => q.eq("testId", args.testId))
      .collect();
  },
});

// Get download URL for a file
export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Generate upload URL (used by upload script)
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Create file record after upload
export const createFile = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    // Check if file already exists (by testId + originalFilename)
    const existing = await ctx.db
      .query("testFiles")
      .withIndex("by_test", (q) => q.eq("testId", args.testId))
      .filter((q) => q.eq(q.field("originalFilename"), args.originalFilename))
      .unique();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("testFiles", args);
  },
});
