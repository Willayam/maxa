#!/usr/bin/env bun
/**
 * Upload all PDFs from content/hogskoleprovet-tests/ to Convex file storage.
 *
 * Run with: bun scripts/upload-to-convex.ts
 * Dry run:  bun scripts/upload-to-convex.ts --dry-run
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { readdir, stat, readFile } from "fs/promises";
import { join } from "path";

const CONTENT_DIR = join(import.meta.dir, "../content/hogskoleprovet-tests");

const CONVEX_URL = process.env.CONVEX_URL;
if (!CONVEX_URL) {
  console.error("Error: CONVEX_URL environment variable is required");
  process.exit(1);
}

const ADMIN_SECRET = process.env.ADMIN_SECRET;
if (!ADMIN_SECRET) {
  console.error("Error: ADMIN_SECRET environment variable is required");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

// Parse folder name to extract test metadata
function parseFolderName(folderName: string): {
  year: number;
  season: "vår" | "höst";
  date: string;
  slug: string;
} | null {
  // Extract year (20XX pattern)
  const yearMatch = folderName.match(/20(\d{2})/);
  if (!yearMatch) return null;
  const year = 2000 + parseInt(yearMatch[1]);

  // Extract season
  let season: "vår" | "höst";
  if (folderName.includes("hosten") || folderName.includes("hösten")) {
    season = "höst";
  } else if (folderName.includes("varen") || folderName.includes("våren")) {
    season = "vår";
  } else {
    // Try to infer from date (october = höst, march/april/may = vår)
    if (folderName.includes("oktober") || folderName.includes("-10-")) {
      season = "höst";
    } else if (
      folderName.includes("mars") ||
      folderName.includes("april") ||
      folderName.includes("maj") ||
      folderName.includes("-03-") ||
      folderName.includes("-04-") ||
      folderName.includes("-05-")
    ) {
      season = "vår";
    } else {
      // Default based on typical test dates
      season = "höst";
    }
  }

  // Create a normalized slug
  const slug = `${season === "höst" ? "hosten" : "varen"}-${year}`;

  // Try to extract date
  let date = "";
  // Format: 2014-10-25
  const isoDateMatch = folderName.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoDateMatch) {
    date = isoDateMatch[0];
  } else {
    // Format: 20-oktober, 13-mars, etc.
    const dayMonthMatch = folderName.match(/(\d{1,2})-(oktober|mars|april|maj)/i);
    if (dayMonthMatch) {
      const day = dayMonthMatch[1].padStart(2, "0");
      const monthMap: Record<string, string> = {
        mars: "03",
        april: "04",
        maj: "05",
        oktober: "10",
      };
      const month = monthMap[dayMonthMatch[2].toLowerCase()] || "01";
      date = `${year}-${month}-${day}`;
    }
  }

  return { year, season, date, slug };
}

// Parse filename to extract file metadata
function parseFilename(filename: string): {
  fileType: "provpass" | "facit" | "kallhanvisning" | "normering";
  section?: "verbal" | "kvantitativ";
  passNumber?: number;
} {
  const lower = filename.toLowerCase();

  // Detect file type
  if (lower.includes("kallhanv")) {
    return { fileType: "kallhanvisning" };
  }

  if (lower.includes("norm")) {
    let section: "verbal" | "kvantitativ" | undefined;
    if (lower.includes("verb")) section = "verbal";
    else if (lower.includes("kvant")) section = "kvantitativ";
    return { fileType: "normering", section };
  }

  if (
    lower.includes("facit") ||
    lower.match(/hp-\d{2}[ab]\.pdf/) || // hp-24b.pdf pattern
    lower.match(/facit\d{2}[ab]\.pdf/) // facit13b.pdf pattern
  ) {
    return { fileType: "facit" };
  }

  if (lower.includes("provpass")) {
    // Extract pass number
    const passMatch = lower.match(/provpass[- ]?(\d)/);
    const passNumber = passMatch ? parseInt(passMatch[1]) : undefined;

    // Extract section
    let section: "verbal" | "kvantitativ" | undefined;
    if (lower.includes("verb")) section = "verbal";
    else if (lower.includes("kvant")) section = "kvantitativ";

    return { fileType: "provpass", section, passNumber };
  }

  // Default: treat as provpass if contains section indicators
  if (lower.includes("verb")) {
    return { fileType: "provpass", section: "verbal" };
  }
  if (lower.includes("kvant")) {
    return { fileType: "provpass", section: "kvantitativ" };
  }

  // Default to facit for unknown patterns with typical facit naming
  if (lower.match(/^\w+-\d{2}[ab]\.pdf$/)) {
    return { fileType: "facit" };
  }

  // Truly unknown - default to provpass
  return { fileType: "provpass" };
}

async function uploadFile(filePath: string): Promise<string> {
  const fileData = await readFile(filePath);
  const uploadUrl = await client.mutation(api.files.generateUploadUrl, {
    adminSecret: ADMIN_SECRET,
  });

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": "application/pdf" },
    body: fileData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const { storageId } = await response.json();
  return storageId;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  console.log(`Starting upload${dryRun ? " (DRY RUN)" : ""}...`);
  console.log(`Content directory: ${CONTENT_DIR}`);
  console.log(`Convex URL: ${CONVEX_URL}\n`);

  const folders = await readdir(CONTENT_DIR);
  let totalFiles = 0;
  let uploadedFiles = 0;
  let skippedFiles = 0;

  for (const folderName of folders) {
    const folderPath = join(CONTENT_DIR, folderName);
    const folderStat = await stat(folderPath);

    if (!folderStat.isDirectory()) continue;

    // Parse test metadata from folder name
    const testMeta = parseFolderName(folderName);
    if (!testMeta) {
      console.log(`⚠️  Skipping folder (couldn't parse): ${folderName}`);
      continue;
    }

    console.log(`\n📁 ${folderName}`);
    console.log(`   → ${testMeta.season} ${testMeta.year} (${testMeta.slug})`);

    // Create or get test record
    let testId: string;
    if (!dryRun) {
      testId = await client.mutation(api.tests.create, {
        adminSecret: ADMIN_SECRET,
        year: testMeta.year,
        season: testMeta.season,
        date: testMeta.date || "",
        slug: testMeta.slug,
        sourceUrl: `https://www.studera.nu/hogskoleprov/`,
      });
    } else {
      testId = "dry-run-test-id";
    }

    // Process PDFs in folder
    const files = await readdir(folderPath);
    const pdfFiles = files.filter((f) => f.toLowerCase().endsWith(".pdf"));

    for (const pdfFile of pdfFiles) {
      totalFiles++;
      const filePath = join(folderPath, pdfFile);
      const fileStat = await stat(filePath);
      const fileMeta = parseFilename(pdfFile);

      const fileInfo = [
        fileMeta.fileType,
        fileMeta.section,
        fileMeta.passNumber ? `#${fileMeta.passNumber}` : null,
      ]
        .filter(Boolean)
        .join(" ");

      if (dryRun) {
        console.log(`   [dry-run] ${pdfFile} → ${fileInfo}`);
        continue;
      }

      try {
        // Upload file to Convex storage
        const storageId = await uploadFile(filePath);

        // Create file record
        await client.mutation(api.files.createFile, {
          adminSecret: ADMIN_SECRET,
          testId: testId,
          storageId: storageId,
          fileType: fileMeta.fileType,
          section: fileMeta.section,
          passNumber: fileMeta.passNumber,
          originalFilename: pdfFile,
          sizeBytes: fileStat.size,
        });

        console.log(`   ✅ ${pdfFile} → ${fileInfo}`);
        uploadedFiles++;
      } catch (error) {
        console.log(`   ❌ ${pdfFile} → ${error}`);
        skippedFiles++;
      }
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Total files: ${totalFiles}`);
  if (!dryRun) {
    console.log(`Uploaded: ${uploadedFiles}`);
    console.log(`Skipped/Failed: ${skippedFiles}`);
  }
}

main().catch(console.error);
