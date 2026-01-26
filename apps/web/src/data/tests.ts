// Static test data - no Convex dependency
// PDFs are stored in /public/pdfs/{slug}/

export type FileType = "provpass" | "facit" | "kallhanvisning" | "normering";
export type Section = "verbal" | "kvantitativ";
export type Season = "vår" | "höst";

export interface TestFile {
  id: string;
  fileType: FileType;
  section?: Section;
  passNumber?: number;
  filename: string; // e.g., "provpass-1-verbal.pdf"
  sizeBytes: number;
}

export interface Test {
  id: string;
  year: number;
  season: Season;
  date: string; // ISO date, e.g., "2024-10-20"
  slug: string; // URL-friendly, e.g., "hosten-2024"
  files: TestFile[];
}

// Helper to get full PDF path
export function getPdfUrl(test: Test, file: TestFile): string {
  return `/pdfs/${test.slug}/${file.filename}`;
}

// Helper to find test by slug
export function getTestBySlug(slug: string): Test | undefined {
  return tests.find((t) => t.slug === slug);
}

// Static test data
// Add your tests here. PDFs should be placed in /public/pdfs/{slug}/
export const tests: Test[] = [
  // 2025
  {
    id: "hosten-2025",
    year: 2025,
    season: "höst",
    date: "2025-10-19",
    slug: "hosten-2025",
    files: [],
  },
  {
    id: "varen-2025",
    year: 2025,
    season: "vår",
    date: "2025-04-05",
    slug: "varen-2025",
    files: [],
  },
  // 2024
  {
    id: "hosten-2024",
    year: 2024,
    season: "höst",
    date: "2024-10-20",
    slug: "hosten-2024",
    files: [],
  },
  {
    id: "varen-2024",
    year: 2024,
    season: "vår",
    date: "2024-04-13",
    slug: "varen-2024",
    files: [],
  },
  // 2023
  {
    id: "hosten-2023",
    year: 2023,
    season: "höst",
    date: "2023-10-22",
    slug: "hosten-2023",
    files: [],
  },
  {
    id: "varen-2023",
    year: 2023,
    season: "vår",
    date: "2023-04-01",
    slug: "varen-2023",
    files: [],
  },
  // 2022
  {
    id: "hosten-2022",
    year: 2022,
    season: "höst",
    date: "2022-10-23",
    slug: "hosten-2022",
    files: [],
  },
  {
    id: "varen-2022",
    year: 2022,
    season: "vår",
    date: "2022-04-02",
    slug: "varen-2022",
    files: [],
  },
];
