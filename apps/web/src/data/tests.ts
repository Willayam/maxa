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
  // Example structure (uncomment and modify when adding real data):
  // {
  //   id: "hosten-2024",
  //   year: 2024,
  //   season: "höst",
  //   date: "2024-10-20",
  //   slug: "hosten-2024",
  //   files: [
  //     {
  //       id: "hosten-2024-provpass-1",
  //       fileType: "provpass",
  //       section: "verbal",
  //       passNumber: 1,
  //       filename: "provpass-1-verbal.pdf",
  //       sizeBytes: 2500000,
  //     },
  //     {
  //       id: "hosten-2024-facit",
  //       fileType: "facit",
  //       filename: "facit.pdf",
  //       sizeBytes: 150000,
  //     },
  //   ],
  // },
];
