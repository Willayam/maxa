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
    files: [
      { id: "hosten-2025-pp1-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 1, filename: "provpass-1-kvant.pdf", sizeBytes: 3575062 },
      { id: "hosten-2025-pp3-verb", fileType: "provpass", section: "verbal", passNumber: 3, filename: "provpass-3-verb-utan-elf.pdf", sizeBytes: 396561 },
      { id: "hosten-2025-pp4-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 4, filename: "provpass-4-kvant.pdf", sizeBytes: 804279 },
      { id: "hosten-2025-pp5-verb", fileType: "provpass", section: "verbal", passNumber: 5, filename: "provpass-5-verb-utan-elf.pdf", sizeBytes: 363302 },
      { id: "hosten-2025-facit", fileType: "facit", filename: "hp-25b.pdf", sizeBytes: 27664 },
      { id: "hosten-2025-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 127885 },
      { id: "hosten-2025-norm-hela", fileType: "normering", filename: "norm25b-helaprovet.pdf", sizeBytes: 117686 },
      { id: "hosten-2025-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm25b-kvant.pdf", sizeBytes: 106564 },
      { id: "hosten-2025-norm-verb", fileType: "normering", section: "verbal", filename: "norm25b-verb.pdf", sizeBytes: 106457 },
    ],
  },
  {
    id: "varen-2025",
    year: 2025,
    season: "vår",
    date: "2025-04-05",
    slug: "varen-2025",
    files: [
      { id: "varen-2025-pp2-verb", fileType: "provpass", section: "verbal", passNumber: 2, filename: "provpass-2-verb-utan-elf.pdf", sizeBytes: 351630 },
      { id: "varen-2025-pp3-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 3, filename: "provpass-3-kvant.pdf", sizeBytes: 12326188 },
      { id: "varen-2025-pp4-verb", fileType: "provpass", section: "verbal", passNumber: 4, filename: "provpass-4-verb-utan-elf.pdf", sizeBytes: 362702 },
      { id: "varen-2025-pp5-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 5, filename: "provpass-5-kvant.pdf", sizeBytes: 2247200 },
      { id: "varen-2025-facit", fileType: "facit", filename: "hogskoleprovet-facit-25a.pdf", sizeBytes: 27734 },
      { id: "varen-2025-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 725043 },
    ],
  },
  // 2024
  {
    id: "hosten-2024",
    year: 2024,
    season: "höst",
    date: "2024-10-20",
    slug: "hosten-2024",
    files: [
      { id: "hosten-2024-pp1-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 1, filename: "provpass-1-kvant.pdf", sizeBytes: 1122295 },
      { id: "hosten-2024-pp3-verb", fileType: "provpass", section: "verbal", passNumber: 3, filename: "provpass-3-verb-utan-elf.pdf", sizeBytes: 337968 },
      { id: "hosten-2024-pp4-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 4, filename: "provpass-4-kvant.pdf", sizeBytes: 1052761 },
      { id: "hosten-2024-pp5-verb", fileType: "provpass", section: "verbal", passNumber: 5, filename: "provpass-5-verb-utan-elf.pdf", sizeBytes: 357283 },
      { id: "hosten-2024-facit", fileType: "facit", filename: "hogskoleprovet-facit-24b.pdf", sizeBytes: 27721 },
      { id: "hosten-2024-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 619641 },
    ],
  },
  {
    id: "varen-2024",
    year: 2024,
    season: "vår",
    date: "2024-04-13",
    slug: "varen-2024",
    files: [
      { id: "varen-2024-pp1-verb", fileType: "provpass", section: "verbal", passNumber: 1, filename: "provpass-1-verb-utan-elf.pdf", sizeBytes: 523598 },
      { id: "varen-2024-pp2-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 2, filename: "provpass-2-kvant.pdf", sizeBytes: 1198343 },
      { id: "varen-2024-pp4-verb", fileType: "provpass", section: "verbal", passNumber: 4, filename: "provpass-4-verb-utan-elf.pdf", sizeBytes: 591573 },
      { id: "varen-2024-pp5-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 5, filename: "provpass-5-kvant.pdf", sizeBytes: 3037441 },
      { id: "varen-2024-facit", fileType: "facit", filename: "hogskoleprovet-facit-24a.pdf", sizeBytes: 27719 },
      { id: "varen-2024-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 621618 },
    ],
  },
  // 2023
  {
    id: "hosten-2023",
    year: 2023,
    season: "höst",
    date: "2023-10-22",
    slug: "hosten-2023",
    files: [
      { id: "hosten-2023-pp2-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 2, filename: "provpass-2-kvant.pdf", sizeBytes: 2466698 },
      { id: "hosten-2023-pp3-verb", fileType: "provpass", section: "verbal", passNumber: 3, filename: "provpass-3-verb-utan-elf.pdf", sizeBytes: 406355 },
      { id: "hosten-2023-pp4-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 4, filename: "provpass-4-kvant.pdf", sizeBytes: 857284 },
      { id: "hosten-2023-pp5-verb", fileType: "provpass", section: "verbal", passNumber: 5, filename: "provpass-5-verb-utan-elf.pdf", sizeBytes: 435831 },
      { id: "hosten-2023-facit", fileType: "facit", filename: "hogskoleprovet-facit-23b.pdf", sizeBytes: 539848 },
      { id: "hosten-2023-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 726837 },
      { id: "hosten-2023-norm-hela", fileType: "normering", filename: "norm23b-helaprovet.pdf", sizeBytes: 103286 },
      { id: "hosten-2023-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm23b-kvant.pdf", sizeBytes: 103286 },
      { id: "hosten-2023-norm-verb", fileType: "normering", section: "verbal", filename: "norm23b-verb.pdf", sizeBytes: 103286 },
    ],
  },
  {
    id: "varen-2023",
    year: 2023,
    season: "vår",
    date: "2023-03-25",
    slug: "varen-2023",
    files: [
      { id: "varen-2023-pp2-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 2, filename: "provpass-2-kvant.pdf", sizeBytes: 4155968 },
      { id: "varen-2023-pp3-verb", fileType: "provpass", section: "verbal", passNumber: 3, filename: "provpass-3-verb-utan-elf.pdf", sizeBytes: 1788362 },
      { id: "varen-2023-pp4-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 4, filename: "provpass-4-kvant.pdf", sizeBytes: 2006026 },
      { id: "varen-2023-pp5-verb", fileType: "provpass", section: "verbal", passNumber: 5, filename: "provpass-5-verb-utan-elf.pdf", sizeBytes: 990155 },
      { id: "varen-2023-facit", fileType: "facit", filename: "hogskoleprovet-facit-23a.pdf", sizeBytes: 236141 },
      { id: "varen-2023-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 646145 },
      { id: "varen-2023-norm-hela", fileType: "normering", filename: "norm23a-helaprovet.pdf", sizeBytes: 97151 },
      { id: "varen-2023-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm23a-kvant.pdf", sizeBytes: 94024 },
      { id: "varen-2023-norm-verb", fileType: "normering", section: "verbal", filename: "norm23a-verb.pdf", sizeBytes: 92387 },
    ],
  },
  // 2022
  {
    id: "hosten-2022",
    year: 2022,
    season: "höst",
    date: "2022-10-23",
    slug: "hosten-2022",
    files: [
      { id: "hosten-2022-pp1-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 1, filename: "provpass-1-kvant.pdf", sizeBytes: 1251196 },
      { id: "hosten-2022-pp2-verb", fileType: "provpass", section: "verbal", passNumber: 2, filename: "provpass-2-verb-utan-elf.pdf", sizeBytes: 438632 },
      { id: "hosten-2022-pp4-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 4, filename: "provpass-4-kvant.pdf", sizeBytes: 5936559 },
      { id: "hosten-2022-pp5-verb", fileType: "provpass", section: "verbal", passNumber: 5, filename: "provpass-5-verb-utan-elf.pdf", sizeBytes: 1023516 },
      { id: "hosten-2022-facit", fileType: "facit", filename: "hogskoleprovet-facit-22b.pdf", sizeBytes: 385901 },
      { id: "hosten-2022-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 625133 },
      { id: "hosten-2022-norm-hela", fileType: "normering", filename: "norm22b-helaprovet.pdf", sizeBytes: 103286 },
      { id: "hosten-2022-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm22b-kvant.pdf", sizeBytes: 103286 },
      { id: "hosten-2022-norm-verb", fileType: "normering", section: "verbal", filename: "norm22b-verb.pdf", sizeBytes: 103286 },
    ],
  },
  {
    id: "varen-2022",
    year: 2022,
    season: "vår",
    date: "2022-05-07",
    slug: "varen-2022",
    files: [
      { id: "varen-2022-pp1-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 1, filename: "provpass-1-kvant.pdf", sizeBytes: 1607331 },
      { id: "varen-2022-pp3-verb", fileType: "provpass", section: "verbal", passNumber: 3, filename: "provpass-3-verb-utan-elf.pdf", sizeBytes: 399485 },
      { id: "varen-2022-pp4-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 4, filename: "provpass-4-kvant.pdf", sizeBytes: 1468870 },
      { id: "varen-2022-pp5-verb", fileType: "provpass", section: "verbal", passNumber: 5, filename: "provpass-5-verb-utan-elf.pdf", sizeBytes: 396757 },
      { id: "varen-2022-facit", fileType: "facit", filename: "hogskoleprovet-facit-22a2-7-maj.pdf", sizeBytes: 216877 },
      { id: "varen-2022-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 1134131 },
      { id: "varen-2022-norm-hela", fileType: "normering", filename: "norm22a2-helaprovet.pdf", sizeBytes: 103286 },
      { id: "varen-2022-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm22a2-kvant.pdf", sizeBytes: 103286 },
      { id: "varen-2022-norm-verb", fileType: "normering", section: "verbal", filename: "norm22a2-verb.pdf", sizeBytes: 103286 },
    ],
  },
  {
    id: "varen-2022-mars",
    year: 2022,
    season: "vår",
    date: "2022-03-12",
    slug: "varen-2022-mars",
    files: [
      { id: "varen-2022-mars-pp2-verb", fileType: "provpass", section: "verbal", passNumber: 2, filename: "provpass-2-verb-utan-elf.pdf", sizeBytes: 342515 },
      { id: "varen-2022-mars-pp3-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 3, filename: "provpass-3-kvant.pdf", sizeBytes: 13240653 },
      { id: "varen-2022-mars-pp4-verb", fileType: "provpass", section: "verbal", passNumber: 4, filename: "provpass-4-verb-utan-elf.pdf", sizeBytes: 343286 },
      { id: "varen-2022-mars-pp5-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 5, filename: "provpass-5-kvant.pdf", sizeBytes: 5638743 },
      { id: "varen-2022-mars-facit", fileType: "facit", filename: "hogskoleprovet-facit-22a1.pdf", sizeBytes: 98955 },
      { id: "varen-2022-mars-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 1145992 },
      { id: "varen-2022-mars-norm-hela", fileType: "normering", filename: "norm22a1-helaprovet.pdf", sizeBytes: 138560 },
      { id: "varen-2022-mars-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm22a1-kvant.pdf", sizeBytes: 127330 },
      { id: "varen-2022-mars-norm-verb", fileType: "normering", section: "verbal", filename: "norm22a1-verb.pdf", sizeBytes: 125536 },
    ],
  },
  // 2021
  {
    id: "hosten-2021",
    year: 2021,
    season: "höst",
    date: "2021-10-24",
    slug: "hosten-2021",
    files: [
      { id: "hosten-2021-pp1-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 1, filename: "211024-provpass-1-kvant.pdf", sizeBytes: 4300556 },
      { id: "hosten-2021-pp2-verb", fileType: "provpass", section: "verbal", passNumber: 2, filename: "211024-provpass-2-verb-utan-elf.pdf", sizeBytes: 687513 },
      { id: "hosten-2021-pp4-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 4, filename: "211024-provpass-4-kvant.pdf", sizeBytes: 4312998 },
      { id: "hosten-2021-pp5-verb", fileType: "provpass", section: "verbal", passNumber: 5, filename: "211024-provpass-5-verb-utan-elf.pdf", sizeBytes: 672497 },
      { id: "hosten-2021-facit", fileType: "facit", filename: "hogskoleprovet-facit-21-b.pdf", sizeBytes: 279298 },
      { id: "hosten-2021-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 1179865 },
      { id: "hosten-2021-norm-hela", fileType: "normering", filename: "norm21b-helaprovet.pdf", sizeBytes: 103286 },
      { id: "hosten-2021-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm21b-kvant.pdf", sizeBytes: 103286 },
      { id: "hosten-2021-norm-verb", fileType: "normering", section: "verbal", filename: "norm21b-verb.pdf", sizeBytes: 103286 },
    ],
  },
  {
    id: "varen-2021",
    year: 2021,
    season: "vår",
    date: "2021-05-08",
    slug: "varen-2021",
    files: [
      { id: "varen-2021-pp1-verb", fileType: "provpass", section: "verbal", passNumber: 1, filename: "provpass-1-verb-utan-elf.pdf", sizeBytes: 374659 },
      { id: "varen-2021-pp2-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 2, filename: "provpass-2-kvant.pdf", sizeBytes: 2236895 },
      { id: "varen-2021-pp4-verb", fileType: "provpass", section: "verbal", passNumber: 4, filename: "provpass-4-verb-utan-elf.pdf", sizeBytes: 346932 },
      { id: "varen-2021-pp5-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 5, filename: "provpass-5-kvant.pdf", sizeBytes: 1140367 },
      { id: "varen-2021-facit", fileType: "facit", filename: "hogskoleprovet-facit-21a2.pdf", sizeBytes: 210780 },
      { id: "varen-2021-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 1119830 },
      { id: "varen-2021-norm-hela", fileType: "normering", filename: "norm21a2-helaprovet.pdf", sizeBytes: 103286 },
      { id: "varen-2021-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm21a2-kvant.pdf", sizeBytes: 103286 },
      { id: "varen-2021-norm-verb", fileType: "normering", section: "verbal", filename: "norm21a2-verb.pdf", sizeBytes: 103286 },
    ],
  },
  {
    id: "varen-2021-mars",
    year: 2021,
    season: "vår",
    date: "2021-03-13",
    slug: "varen-2021-mars",
    files: [
      { id: "varen-2021-mars-pp1-verb", fileType: "provpass", section: "verbal", passNumber: 1, filename: "provpass-1-verb-utan-elf.pdf", sizeBytes: 437638 },
      { id: "varen-2021-mars-pp3-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 3, filename: "hogskoleprovet-2021-03-13-del-3-kvantitativ-del.pdf", sizeBytes: 805021 },
      { id: "varen-2021-mars-pp4-verb", fileType: "provpass", section: "verbal", passNumber: 4, filename: "provpass-4-verb-utan-elf.pdf", sizeBytes: 403824 },
      { id: "varen-2021-mars-pp5-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 5, filename: "hogskoleprovet-2021-03-13-del-5-kvantitativ-del.pdf", sizeBytes: 1295371 },
      { id: "varen-2021-mars-facit", fileType: "facit", filename: "hogskoleprovet-facit-21a1.pdf", sizeBytes: 224761 },
      { id: "varen-2021-mars-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 793075 },
      { id: "varen-2021-mars-norm-hela", fileType: "normering", filename: "norm21a1-helaprovet.pdf", sizeBytes: 103286 },
      { id: "varen-2021-mars-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm21a1-kvant.pdf", sizeBytes: 103286 },
      { id: "varen-2021-mars-norm-verb", fileType: "normering", section: "verbal", filename: "norm21a1-verb.pdf", sizeBytes: 103286 },
    ],
  },
  // 2020
  {
    id: "hosten-2020",
    year: 2020,
    season: "höst",
    date: "2020-10-25",
    slug: "hosten-2020",
    files: [
      { id: "hosten-2020-pp2-verb", fileType: "provpass", section: "verbal", passNumber: 2, filename: "hogskoleprovet-2020-10-25-del-2-verbal-del-utan-elf.pdf", sizeBytes: 491335 },
      { id: "hosten-2020-pp3-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 3, filename: "hogskoleprovet-2020-10-25-del-3-kvantitativ-del.pdf", sizeBytes: 833653 },
      { id: "hosten-2020-pp4-verb", fileType: "provpass", section: "verbal", passNumber: 4, filename: "hogskoleprovet-2020-10-25-del-4-verbal-del-utan-elf.pdf", sizeBytes: 547830 },
      { id: "hosten-2020-pp5-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 5, filename: "hogskoleprovet-2020-10-25-del-5-kvantitativ-del.pdf", sizeBytes: 3554974 },
      { id: "hosten-2020-facit", fileType: "facit", filename: "facit-hp-2020-10-25.pdf", sizeBytes: 221367 },
      { id: "hosten-2020-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 689162 },
      { id: "hosten-2020-norm-hela", fileType: "normering", filename: "norm20b-helaprovet.pdf", sizeBytes: 103286 },
      { id: "hosten-2020-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm20b-kvant.pdf", sizeBytes: 103286 },
      { id: "hosten-2020-norm-verb", fileType: "normering", section: "verbal", filename: "norm20b-verb.pdf", sizeBytes: 103286 },
    ],
  },
  // 2019
  {
    id: "hosten-2019",
    year: 2019,
    season: "höst",
    date: "2019-10-20",
    slug: "hosten-2019",
    files: [
      { id: "hosten-2019-pp1-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 1, filename: "hogskoleprovet-2019-10-20-del-1-kvantitativ-del-version-1.pdf", sizeBytes: 1697478 },
      { id: "hosten-2019-pp1-2-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 1, filename: "provpass-1-2-kvant.pdf", sizeBytes: 1691940 },
      { id: "hosten-2019-pp3-verb", fileType: "provpass", section: "verbal", passNumber: 3, filename: "hogskoleprovet-2019-10-20-del-3-verbal-del-utan-elf.pdf", sizeBytes: 411429 },
      { id: "hosten-2019-pp4-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 4, filename: "provpass-4-kvant.pdf", sizeBytes: 1351793 },
      { id: "hosten-2019-pp5-verb", fileType: "provpass", section: "verbal", passNumber: 5, filename: "provpass-5-verb-utan-elf.pdf", sizeBytes: 424261 },
      { id: "hosten-2019-facit-v1", fileType: "facit", filename: "hogskoleprovet-facit-19b-version-1.pdf", sizeBytes: 248607 },
      { id: "hosten-2019-facit-v2", fileType: "facit", filename: "hogskoleprovet-facit-19b-version-2.pdf", sizeBytes: 173741 },
      { id: "hosten-2019-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 152968 },
      { id: "hosten-2019-norm-hela", fileType: "normering", filename: "norm19b-helaprovet.pdf", sizeBytes: 103286 },
      { id: "hosten-2019-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm19b-kvant.pdf", sizeBytes: 103286 },
      { id: "hosten-2019-norm-verb", fileType: "normering", section: "verbal", filename: "norm19b-verb.pdf", sizeBytes: 103286 },
    ],
  },
  {
    id: "varen-2019",
    year: 2019,
    season: "vår",
    date: "2019-04-06",
    slug: "varen-2019",
    files: [
      { id: "varen-2019-pp1-verb", fileType: "provpass", section: "verbal", passNumber: 1, filename: "provpass-1-verb-utan-elf.pdf", sizeBytes: 499728 },
      { id: "varen-2019-pp2-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 2, filename: "hogskoleprovet-2019-04-06-del-2-kvantitativ-del2.pdf", sizeBytes: 899410 },
      { id: "varen-2019-pp4-verb", fileType: "provpass", section: "verbal", passNumber: 4, filename: "provpass-4-verb-utan-elf.pdf", sizeBytes: 949937 },
      { id: "varen-2019-pp5-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 5, filename: "hogskoleprovet-2019-04-06-del-5-kvantitativ-del.pdf", sizeBytes: 1163789 },
      { id: "varen-2019-facit", fileType: "facit", filename: "facit-hogskoleprovet-vt-2019.pdf", sizeBytes: 281313 },
      { id: "varen-2019-kallhanv", fileType: "kallhanvisning", filename: "kallforteckning-2019-a-dtk-las-mek-0022.pdf", sizeBytes: 238357 },
      { id: "varen-2019-norm-hela", fileType: "normering", filename: "norm19a-helaprovet.pdf", sizeBytes: 103286 },
      { id: "varen-2019-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm19a-kvant.pdf", sizeBytes: 103286 },
      { id: "varen-2019-norm-verb", fileType: "normering", section: "verbal", filename: "norm19a-verb.pdf", sizeBytes: 103286 },
    ],
  },
  // 2018
  {
    id: "hosten-2018",
    year: 2018,
    season: "höst",
    date: "2018-10-21",
    slug: "hosten-2018",
    files: [
      { id: "hosten-2018-pp2-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 2, filename: "hogskoleprovet-2018-10-21-del-2-kvantitativ-del.pdf", sizeBytes: 640554 },
      { id: "hosten-2018-pp3-verb", fileType: "provpass", section: "verbal", passNumber: 3, filename: "hogskoleprovet-2018-10-21-del-3-verbal-del-utan-elf.pdf", sizeBytes: 305619 },
      { id: "hosten-2018-pp4-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 4, filename: "hogskoleprovet-2018-10-21-del-4-kvantitativ-del.pdf", sizeBytes: 1073389 },
      { id: "hosten-2018-pp5-verb", fileType: "provpass", section: "verbal", passNumber: 5, filename: "hogskoleprovet-2018-10-21-del-5-verbal-del-utan-elf.pdf", sizeBytes: 346678 },
      { id: "hosten-2018-facit", fileType: "facit", filename: "facit-ht18.pdf", sizeBytes: 321674 },
      { id: "hosten-2018-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 674490 },
      { id: "hosten-2018-norm-hela", fileType: "normering", filename: "norm18b-helaprovet.pdf", sizeBytes: 103286 },
      { id: "hosten-2018-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm18b-kvant.pdf", sizeBytes: 103286 },
      { id: "hosten-2018-norm-verb", fileType: "normering", section: "verbal", filename: "norm18b-verb.pdf", sizeBytes: 103286 },
    ],
  },
  {
    id: "varen-2018",
    year: 2018,
    season: "vår",
    date: "2018-03-31",
    slug: "varen-2018",
    files: [
      { id: "varen-2018-pp1-kvant-v1", fileType: "provpass", section: "kvantitativ", passNumber: 1, filename: "provpass-1-kvant-version-1.pdf", sizeBytes: 2813149 },
      { id: "varen-2018-pp1-kvant-v2", fileType: "provpass", section: "kvantitativ", passNumber: 1, filename: "provpass-1-kvant-version-2.pdf", sizeBytes: 2874941 },
      { id: "varen-2018-pp2-verb", fileType: "provpass", section: "verbal", passNumber: 2, filename: "provpass-2-verbal-utan-elf.pdf", sizeBytes: 320767 },
      { id: "varen-2018-pp4-kvant-v1", fileType: "provpass", section: "kvantitativ", passNumber: 4, filename: "provpass-4-kvant-version-1.pdf", sizeBytes: 3644721 },
      { id: "varen-2018-pp4-kvant-v2", fileType: "provpass", section: "kvantitativ", passNumber: 4, filename: "provpass-4-kvant-version-2.pdf", sizeBytes: 3711539 },
      { id: "varen-2018-pp5-verb-v1", fileType: "provpass", section: "verbal", passNumber: 5, filename: "provpass-5-verbal-version-1-utan-elf.pdf", sizeBytes: 351912 },
      { id: "varen-2018-pp5-verb-v2", fileType: "provpass", section: "verbal", passNumber: 5, filename: "provpass-5-verbal-version-2-utan-elf.pdf", sizeBytes: 346207 },
      { id: "varen-2018-facit-v1", fileType: "facit", filename: "facit-version-1-18a-111.pdf", sizeBytes: 61021 },
      { id: "varen-2018-facit-v2", fileType: "facit", filename: "facit-version-2-18a-112.pdf", sizeBytes: 61054 },
      { id: "varen-2018-facit-v3", fileType: "facit", filename: "facit-version-3-18a-121.pdf", sizeBytes: 61244 },
      { id: "varen-2018-facit-v4", fileType: "facit", filename: "facit-version-4-18a-122.pdf", sizeBytes: 61253 },
      { id: "varen-2018-facit-v5", fileType: "facit", filename: "facit-version-5-18a-211.pdf", sizeBytes: 61354 },
      { id: "varen-2018-facit-v6", fileType: "facit", filename: "facit-version-6-18a-212.pdf", sizeBytes: 61603 },
      { id: "varen-2018-facit-v7", fileType: "facit", filename: "facit-version-7-18a-221.pdf", sizeBytes: 61702 },
      { id: "varen-2018-facit-v8", fileType: "facit", filename: "facit-version-8-18a-222.pdf", sizeBytes: 61567 },
      { id: "varen-2018-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 528717 },
      { id: "varen-2018-norm-hela", fileType: "normering", filename: "norm18a-helaprovet.pdf", sizeBytes: 103286 },
      { id: "varen-2018-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm18a-kvant.pdf", sizeBytes: 103286 },
      { id: "varen-2018-norm-verb", fileType: "normering", section: "verbal", filename: "norm18a-verb.pdf", sizeBytes: 103286 },
    ],
  },
  // 2017
  {
    id: "hosten-2017",
    year: 2017,
    season: "höst",
    date: "2017-10-28",
    slug: "hosten-2017",
    files: [
      { id: "hosten-2017-pp1-verb", fileType: "provpass", section: "verbal", passNumber: 1, filename: "provpass-1-verbal-utan-elf.pdf", sizeBytes: 181013 },
      { id: "hosten-2017-pp3-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 3, filename: "provpass-3-kvant.pdf", sizeBytes: 414999 },
      { id: "hosten-2017-pp4-verb", fileType: "provpass", section: "verbal", passNumber: 4, filename: "provpass-4-verbal-utan-elf.pdf", sizeBytes: 184922 },
      { id: "hosten-2017-pp5-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 5, filename: "provpass-5-kvant-version-1.pdf", sizeBytes: 1134759 },
      { id: "hosten-2017-facit", fileType: "facit", filename: "facit-version-1.pdf", sizeBytes: 60635 },
      { id: "hosten-2017-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 470506 },
      { id: "hosten-2017-norm-hela", fileType: "normering", filename: "norm17b-helaprovet.pdf", sizeBytes: 103286 },
      { id: "hosten-2017-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm17b-kvant.pdf", sizeBytes: 103286 },
      { id: "hosten-2017-norm-verb", fileType: "normering", section: "verbal", filename: "norm17b-verb.pdf", sizeBytes: 103286 },
    ],
  },
  {
    id: "varen-2017",
    year: 2017,
    season: "vår",
    date: "2017-04-01",
    slug: "varen-2017",
    files: [
      { id: "varen-2017-pp1-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 1, filename: "provpass-1-kvant-a.pdf", sizeBytes: 625886 },
      { id: "varen-2017-pp3-verb", fileType: "provpass", section: "verbal", passNumber: 3, filename: "provpass-3-verbal-a-utan-elf.pdf", sizeBytes: 209000 },
      { id: "varen-2017-pp4-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 4, filename: "provpass-4-kvant-a.pdf", sizeBytes: 828654 },
      { id: "varen-2017-pp5-verb", fileType: "provpass", section: "verbal", passNumber: 5, filename: "provpass-5-verbal-a-utan-elf.pdf", sizeBytes: 205196 },
      { id: "varen-2017-facit", fileType: "facit", filename: "facit-a.pdf", sizeBytes: 16048 },
      { id: "varen-2017-kallhanv", fileType: "kallhanvisning", filename: "kallhanv17a.pdf", sizeBytes: 527688 },
      { id: "varen-2017-norm-hela", fileType: "normering", filename: "norm17a-helaprovet.pdf", sizeBytes: 103286 },
      { id: "varen-2017-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm17a-kvant.pdf", sizeBytes: 103286 },
      { id: "varen-2017-norm-verb", fileType: "normering", section: "verbal", filename: "norm17a-verb.pdf", sizeBytes: 103286 },
    ],
  },
  // 2016
  {
    id: "hosten-2016",
    year: 2016,
    season: "höst",
    date: "2016-10-29",
    slug: "hosten-2016",
    files: [
      { id: "hosten-2016-pp2-verb", fileType: "provpass", section: "verbal", passNumber: 2, filename: "provpass-2-verbal-2016-11-05.pdf", sizeBytes: 215052 },
      { id: "hosten-2016-pp3-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 3, filename: "provpass-3-kvant.pdf", sizeBytes: 1529498 },
      { id: "hosten-2016-pp4-verb", fileType: "provpass", section: "verbal", passNumber: 4, filename: "provpass-4-verbal-2016-11-05.pdf", sizeBytes: 195447 },
      { id: "hosten-2016-pp5-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 5, filename: "provpass-5-kvant-p-version-1.pdf", sizeBytes: 1481786 },
      { id: "hosten-2016-facit", fileType: "facit", filename: "facit-version-1-16b.pdf", sizeBytes: 60963 },
      { id: "hosten-2016-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 31598 },
      { id: "hosten-2016-norm-hela", fileType: "normering", filename: "norm16b-helaprovet.pdf", sizeBytes: 103286 },
      { id: "hosten-2016-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm16b-kvant.pdf", sizeBytes: 103286 },
      { id: "hosten-2016-norm-verb", fileType: "normering", section: "verbal", filename: "norm16b-verb.pdf", sizeBytes: 103286 },
    ],
  },
  {
    id: "varen-2016",
    year: 2016,
    season: "vår",
    date: "2016-04-02",
    slug: "varen-2016",
    files: [
      { id: "varen-2016-pp2-verb", fileType: "provpass", section: "verbal", passNumber: 2, filename: "provpass-2-verbal.pdf", sizeBytes: 204704 },
      { id: "varen-2016-pp3-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 3, filename: "provpass-3-kvant.pdf", sizeBytes: 784916 },
      { id: "varen-2016-pp4-verb", fileType: "provpass", section: "verbal", passNumber: 4, filename: "provpass-4-verbal.pdf", sizeBytes: 210170 },
      { id: "varen-2016-pp5-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 5, filename: "provpass-5-kvant.pdf", sizeBytes: 754377 },
      { id: "varen-2016-facit", fileType: "facit", filename: "facit-vt2016.pdf", sizeBytes: 60971 },
      { id: "varen-2016-kallhanv", fileType: "kallhanvisning", filename: "kallor-vt-2016.pdf", sizeBytes: 33911 },
      { id: "varen-2016-norm-hela", fileType: "normering", filename: "norm16a-helaprovet.pdf", sizeBytes: 103286 },
      { id: "varen-2016-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm16a-kvant.pdf", sizeBytes: 103286 },
      { id: "varen-2016-norm-verb", fileType: "normering", section: "verbal", filename: "norm16a-verb.pdf", sizeBytes: 103286 },
    ],
  },
  // 2015
  {
    id: "hosten-2015",
    year: 2015,
    season: "höst",
    date: "2015-10-24",
    slug: "hosten-2015",
    files: [
      { id: "hosten-2015-pp1-verb", fileType: "provpass", section: "verbal", passNumber: 1, filename: "provpass1verb-ej-elf.pdf", sizeBytes: 159198 },
      { id: "hosten-2015-pp3-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 3, filename: "provpass3kvant.pdf", sizeBytes: 3689344 },
      { id: "hosten-2015-pp4-verb", fileType: "provpass", section: "verbal", passNumber: 4, filename: "provpass4verb-ej-elf.pdf", sizeBytes: 143998 },
      { id: "hosten-2015-pp5-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 5, filename: "provpass5kvant.pdf", sizeBytes: 1689357 },
      { id: "hosten-2015-facit", fileType: "facit", filename: "facit.pdf", sizeBytes: 7579 },
      { id: "hosten-2015-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 47757 },
      { id: "hosten-2015-norm-hela", fileType: "normering", filename: "norm15b-helaprovet.pdf", sizeBytes: 103286 },
      { id: "hosten-2015-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm15b-kvant.pdf", sizeBytes: 103286 },
      { id: "hosten-2015-norm-verb", fileType: "normering", section: "verbal", filename: "norm15b-verb.pdf", sizeBytes: 103286 },
    ],
  },
  {
    id: "varen-2015",
    year: 2015,
    season: "vår",
    date: "2015-03-28",
    slug: "varen-2015",
    files: [
      { id: "varen-2015-pp2-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 2, filename: "provpass2kvant.pdf", sizeBytes: 821684 },
      { id: "varen-2015-pp3-verb", fileType: "provpass", section: "verbal", passNumber: 3, filename: "provpass3verbuelf.pdf", sizeBytes: 137148 },
      { id: "varen-2015-pp4-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 4, filename: "provpass4kvant.pdf", sizeBytes: 593135 },
      { id: "varen-2015-pp5-verb", fileType: "provpass", section: "verbal", passNumber: 5, filename: "provpass5verbuelf.pdf", sizeBytes: 149752 },
      { id: "varen-2015-facit", fileType: "facit", filename: "facit.pdf", sizeBytes: 7571 },
      { id: "varen-2015-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 234684 },
      { id: "varen-2015-norm-hela", fileType: "normering", filename: "norm15a-helaprovet.pdf", sizeBytes: 103286 },
      { id: "varen-2015-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm15a-kvant.pdf", sizeBytes: 103286 },
      { id: "varen-2015-norm-verb", fileType: "normering", section: "verbal", filename: "norm15a-verb.pdf", sizeBytes: 103286 },
    ],
  },
  // 2014
  {
    id: "hosten-2014",
    year: 2014,
    season: "höst",
    date: "2014-10-25",
    slug: "hosten-2014",
    files: [
      { id: "hosten-2014-pp1-verb", fileType: "provpass", section: "verbal", passNumber: 1, filename: "provpass1verbej-elf.pdf", sizeBytes: 171191 },
      { id: "hosten-2014-pp2-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 2, filename: "provpass2kvant.pdf", sizeBytes: 3445564 },
      { id: "hosten-2014-pp4-verb", fileType: "provpass", section: "verbal", passNumber: 4, filename: "provpass4verbej-elf.pdf", sizeBytes: 165836 },
      { id: "hosten-2014-pp5-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 5, filename: "provpass5kvant.pdf", sizeBytes: 10556408 },
      { id: "hosten-2014-facit", fileType: "facit", filename: "facit14b.pdf", sizeBytes: 8098 },
      { id: "hosten-2014-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 216579 },
      { id: "hosten-2014-norm-hela", fileType: "normering", filename: "norm14b-helaprovet.pdf", sizeBytes: 103286 },
      { id: "hosten-2014-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm14b-kvant.pdf", sizeBytes: 103286 },
      { id: "hosten-2014-norm-verb", fileType: "normering", section: "verbal", filename: "norm14b-verb.pdf", sizeBytes: 103286 },
    ],
  },
  {
    id: "varen-2014",
    year: 2014,
    season: "vår",
    date: "2014-03-29",
    slug: "varen-2014",
    files: [
      { id: "varen-2014-pp1-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 1, filename: "provpass1kvant.pdf", sizeBytes: 684619 },
      { id: "varen-2014-pp3-verb", fileType: "provpass", section: "verbal", passNumber: 3, filename: "provpass3verb14auelf.pdf", sizeBytes: 161406 },
      { id: "varen-2014-pp4-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 4, filename: "provpass4kvant.pdf", sizeBytes: 1211096 },
      { id: "varen-2014-pp5-verb", fileType: "provpass", section: "verbal", passNumber: 5, filename: "provpass5verb14auelf.pdf", sizeBytes: 140818 },
      { id: "varen-2014-facit", fileType: "facit", filename: "facit.pdf", sizeBytes: 7647 },
      { id: "varen-2014-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 37783 },
      { id: "varen-2014-norm-hela", fileType: "normering", filename: "norm14a-helaprovet.pdf", sizeBytes: 103286 },
      { id: "varen-2014-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm14a-kvant.pdf", sizeBytes: 103286 },
      { id: "varen-2014-norm-verb", fileType: "normering", section: "verbal", filename: "norm14a-verb.pdf", sizeBytes: 103286 },
    ],
  },
  // 2013
  {
    id: "hosten-2013",
    year: 2013,
    season: "höst",
    date: "2013-10-26",
    slug: "hosten-2013",
    files: [
      { id: "hosten-2013-pp1-verb", fileType: "provpass", section: "verbal", passNumber: 1, filename: "provpass1verbutanelf.pdf", sizeBytes: 1999004 },
      { id: "hosten-2013-pp3-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 3, filename: "provpass3kvant.pdf", sizeBytes: 1477180 },
      { id: "hosten-2013-pp4-verb", fileType: "provpass", section: "verbal", passNumber: 4, filename: "provpass4verbutanelf.pdf", sizeBytes: 277585 },
      { id: "hosten-2013-pp5-kvant", fileType: "provpass", section: "kvantitativ", passNumber: 5, filename: "provpass5kvant.pdf", sizeBytes: 1378865 },
      { id: "hosten-2013-facit", fileType: "facit", filename: "facit13b.pdf", sizeBytes: 7550 },
      { id: "hosten-2013-kallhanv", fileType: "kallhanvisning", filename: "kallhanv.pdf", sizeBytes: 18783 },
      { id: "hosten-2013-norm-hela", fileType: "normering", filename: "norm13b-helaprovet.pdf", sizeBytes: 103286 },
      { id: "hosten-2013-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm13b-kvant.pdf", sizeBytes: 103286 },
      { id: "hosten-2013-norm-verb", fileType: "normering", section: "verbal", filename: "norm13b-verb.pdf", sizeBytes: 103286 },
    ],
  },
];
