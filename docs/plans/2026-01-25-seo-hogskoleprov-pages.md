# SEO Högskoleprovet Pages Restructure

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restructure test pages from `/gamla-prov` to `/hogskoleprov` with an evergreen URL strategy, populate with test data, add redirects, and update footer with links to tests.

**Architecture:** Move from static empty data array to Convex-powered test listings. URL structure changes from `/gamla-prov/hosten-2024` to `/hogskoleprov/hosten-2024`. Each test page can evolve from "upcoming" to "available" status. Static generation with `generateStaticParams()` for known tests, with fallback for new ones.

**Tech Stack:** Next.js 15 (App Router), Convex, Tailwind CSS, next/navigation for redirects

---

## Task 1: Create New `/hogskoleprov` Route Structure

**Files:**
- Create: `apps/web/src/app/hogskoleprov/page.tsx`
- Create: `apps/web/src/app/hogskoleprov/[slug]/page.tsx`

**Step 1: Create the main listing page**

Create `apps/web/src/app/hogskoleprov/page.tsx`:

```tsx
import Link from "next/link";
import { Metadata } from "next";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { tests, type Test } from "@/data/tests";

export const metadata: Metadata = {
  title: "Gamla Hogskoleprov - Ladda ner PDF med Facit | Maxa",
  description:
    "Ladda ner gamla hogskoleprov gratis. Provfragor, facit och normeringstabeller fran 2013 till idag. Ova pa riktiga HP-fragor.",
  keywords: [
    "gamla hogskoleprov",
    "hogskoleprov pdf",
    "hp fragor",
    "hogskoleprov facit",
    "hogskoleprov normering",
    "ova hogskoleprov",
  ],
  openGraph: {
    title: "Gamla Hogskoleprov - Ladda ner PDF med Facit",
    description: "Ladda ner gamla hogskoleprov gratis med facit och normering.",
    type: "website",
  },
};

export default function HogskoleprovPage() {
  // Group tests by year
  const testsByYear = tests.reduce(
    (acc, test) => {
      if (!acc[test.year]) acc[test.year] = [];
      acc[test.year].push(test);
      return acc;
    },
    {} as Record<number, Test[]>
  );

  // Sort years descending
  const years = Object.keys(testsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">
            Gamla hogskoleprov
          </h1>
          <p className="text-lg text-foreground-muted mb-8">
            Ladda ner tidigare hogskoleprov med provfragor, facit och
            normeringstabeller fran 2013 till idag.
          </p>

          {tests.length === 0 ? (
            <div className="text-foreground-muted">
              Inga prov tillgangliga annu.
            </div>
          ) : (
            <div className="space-y-10">
              {years.map((year) => (
                <section key={year}>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {year}
                  </h2>
                  <div className="grid gap-4">
                    {testsByYear[year]
                      .sort((a, b) =>
                        a.season === "host" ? -1 : b.season === "host" ? 1 : 0
                      )
                      .map((test) => (
                        <TestCard key={test.id} test={test} />
                      ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* SEO Content Section */}
          <section className="mt-16 pt-8 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Hur anvander jag gamla hogskoleprov?
            </h2>
            <div className="prose prose-invert max-w-none text-foreground-muted">
              <ol className="list-decimal list-inside space-y-3">
                <li>
                  <strong className="text-foreground">Skriv ut dem.</strong>{" "}
                  Provet gors pa papper. Vanj dig vid att bladdra, stryka under
                  och kladda i marginalen.
                </li>
                <li>
                  <strong className="text-foreground">Tidtagning.</strong> Stall
                  en timer pa 55 minuter per pass. Ar du inte klar? Gissa pa
                  resten, markera var du var, och fortsatt sen utan tidtagning.
                </li>
                <li>
                  <strong className="text-foreground">
                    Simulera provdagen.
                  </strong>{" "}
                  En lordag morgon, kor igenom ett helt prov (5 pass) med
                  raster. Det ar ett maraton for hjarnan.
                </li>
              </ol>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function TestCard({ test }: { test: Test }) {
  const seasonLabel = test.season === "var" ? "Varen" : "Hosten";
  const hasFiles = test.files.length > 0;

  return (
    <Link
      href={`/hogskoleprov/${test.slug}`}
      className="block p-6 bg-card-background rounded-2xl border-2 border-border hover:border-primary transition-colors group"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            Hogskoleprovet {seasonLabel.toLowerCase()} {test.year}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            {test.date && (
              <p className="text-foreground-muted text-sm">
                {formatDate(test.date)}
              </p>
            )}
            {hasFiles && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                {test.files.length} filer
              </span>
            )}
          </div>
        </div>
        <span className="text-2xl text-foreground-muted group-hover:text-primary transition-colors">
          &rarr;
        </span>
      </div>
    </Link>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}
```

**Step 2: Verify the file was created**

```bash
ls -la /Users/williamlarsten/conductor/workspaces/maxa/luxembourg-v2/apps/web/src/app/hogskoleprov/
```

Expected: `page.tsx` exists

---

## Task 2: Create Individual Test Page

**Files:**
- Create: `apps/web/src/app/hogskoleprov/[slug]/page.tsx`

**Step 1: Create the dynamic test page**

Create `apps/web/src/app/hogskoleprov/[slug]/page.tsx`:

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import {
  tests,
  getTestBySlug,
  getPdfUrl,
  type Test,
  type TestFile,
} from "@/data/tests";

// Generate static pages for all tests at build time
export function generateStaticParams() {
  return tests.map((test) => ({
    slug: test.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const test = getTestBySlug(slug);

  if (!test) {
    return {
      title: "Prov hittades inte | Maxa",
    };
  }

  const seasonLabel = test.season === "var" ? "varen" : "hosten";
  const title = `Hogskoleprovet ${seasonLabel} ${test.year} - PDF, Facit & Normering | Maxa`;
  const description = `Ladda ner hogskoleprovet fran ${seasonLabel} ${test.year}. Provfragor, facit och normeringstabell i PDF-format.`;

  return {
    title,
    description,
    keywords: [
      `hogskoleprov ${seasonLabel} ${test.year}`,
      `hp ${test.year}`,
      `hogskoleprov ${test.year} facit`,
      `hogskoleprov ${test.year} normering`,
      `hogskoleprov ${test.year} pdf`,
    ],
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export default async function TestPage({ params }: PageProps) {
  const { slug } = await params;
  const test = getTestBySlug(slug);

  if (!test) {
    notFound();
  }

  const seasonLabel = test.season === "var" ? "varen" : "hosten";
  const title = `Hogskoleprovet ${seasonLabel} ${test.year}`;

  // Group files by type
  const grouped = groupFiles(test.files);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/hogskoleprov"
            className="text-foreground-muted hover:text-primary transition-colors mb-6 inline-flex items-center gap-2"
          >
            <span>&larr;</span> Alla hogskoleprov
          </Link>

          <h1 className="text-4xl font-extrabold text-foreground mb-2">
            {title}
          </h1>
          {test.date && (
            <p className="text-lg text-foreground-muted mb-8">
              {formatDate(test.date)}
            </p>
          )}

          {test.files.length === 0 ? (
            <div className="bg-card-background rounded-2xl border-2 border-border p-8 text-center">
              <p className="text-foreground-muted mb-4">
                Filerna for detta prov ar inte tillgangliga annu.
              </p>
              <p className="text-sm text-foreground-muted">
                Kom tillbaka efter provdagen for att ladda ner provfragor, facit
                och normering.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {grouped.provpass.length > 0 && (
                <FileSection
                  title="Provpass"
                  description="Ladda ner provfragorna"
                  files={grouped.provpass}
                  test={test}
                />
              )}

              {grouped.facit.length > 0 && (
                <FileSection
                  title="Facit"
                  description="Ratta svar"
                  files={grouped.facit}
                  test={test}
                />
              )}

              {grouped.normering.length > 0 && (
                <FileSection
                  title="Normering"
                  description="Normeringstabeller"
                  files={grouped.normering}
                  test={test}
                />
              )}

              {grouped.kallhanvisning.length > 0 && (
                <FileSection
                  title="Kallhanvisningar"
                  description="Referenser och kallor"
                  files={grouped.kallhanvisning}
                  test={test}
                />
              )}
            </div>
          )}

          {/* Related tests section */}
          <section className="mt-16 pt-8 border-t border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Fler hogskoleprov
            </h2>
            <div className="grid gap-3">
              {tests
                .filter((t) => t.id !== test.id)
                .slice(0, 4)
                .map((t) => (
                  <Link
                    key={t.id}
                    href={`/hogskoleprov/${t.slug}`}
                    className="flex items-center justify-between p-4 bg-card-background rounded-xl border-2 border-border hover:border-primary transition-colors group"
                  >
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {t.season === "var" ? "Varen" : "Hosten"} {t.year}
                    </span>
                    <span className="text-foreground-muted group-hover:text-primary">
                      &rarr;
                    </span>
                  </Link>
                ))}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function FileSection({
  title,
  description,
  files,
  test,
}: {
  title: string;
  description: string;
  files: TestFile[];
  test: Test;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-1">{title}</h2>
      <p className="text-foreground-muted mb-4">{description}</p>
      <div className="grid gap-3">
        {files.map((file) => (
          <FileCard key={file.id} file={file} test={test} />
        ))}
      </div>
    </div>
  );
}

function FileCard({ file, test }: { file: TestFile; test: Test }) {
  const url = getPdfUrl(test, file);
  const label = getFileLabel(file);
  const sizeLabel = formatFileSize(file.sizeBytes);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      download
      className="flex items-center justify-between p-4 bg-card-background rounded-xl border-2 border-border hover:border-primary transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">&#128196;</span>
        <div>
          <p className="font-semibold text-foreground">{label}</p>
          <p className="text-sm text-foreground-muted">{sizeLabel}</p>
        </div>
      </div>
      <span className="text-primary font-bold">Ladda ner &darr;</span>
    </a>
  );
}

function getFileLabel(file: TestFile): string {
  const parts: string[] = [];

  if (file.fileType === "provpass") {
    parts.push("Provpass");
    if (file.passNumber) parts.push(`${file.passNumber}`);
    if (file.section) {
      parts.push(`(${file.section === "verbal" ? "Verbal" : "Kvantitativ"})`);
    }
  } else if (file.fileType === "facit") {
    parts.push("Facit");
  } else if (file.fileType === "normering") {
    parts.push("Normering");
    if (file.section) {
      parts.push(`(${file.section === "verbal" ? "Verbal" : "Kvantitativ"})`);
    }
  } else if (file.fileType === "kallhanvisning") {
    parts.push("Kallhanvisning");
  }

  if (parts.length === 0) {
    return file.filename;
  }

  return parts.join(" ");
}

function groupFiles(files: TestFile[]) {
  const grouped = {
    provpass: [] as TestFile[],
    facit: [] as TestFile[],
    normering: [] as TestFile[],
    kallhanvisning: [] as TestFile[],
  };

  for (const file of files) {
    grouped[file.fileType].push(file);
  }

  // Sort provpass by pass number
  grouped.provpass.sort((a, b) => (a.passNumber || 0) - (b.passNumber || 0));

  return grouped;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return dateStr;
  }
  return date.toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
```

**Step 2: Commit the new route structure**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/luxembourg-v2 && git add apps/web/src/app/hogskoleprov/ && git commit -m "feat(web): add /hogskoleprov route structure with SEO metadata"
```

---

## Task 3: Add Redirects from Old URLs

**Files:**
- Modify: `apps/web/next.config.ts` (or `next.config.js`)

**Step 1: Read current next.config**

```bash
cat /Users/williamlarsten/conductor/workspaces/maxa/luxembourg-v2/apps/web/next.config.ts 2>/dev/null || cat /Users/williamlarsten/conductor/workspaces/maxa/luxembourg-v2/apps/web/next.config.js 2>/dev/null || cat /Users/williamlarsten/conductor/workspaces/maxa/luxembourg-v2/apps/web/next.config.mjs 2>/dev/null
```

**Step 2: Add redirects configuration**

Add to `next.config.ts` (or appropriate config file):

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ... existing config
  async redirects() {
    return [
      // Redirect old /gamla-prov to new /hogskoleprov
      {
        source: "/gamla-prov",
        destination: "/hogskoleprov",
        permanent: true, // 301 redirect for SEO
      },
      // Redirect individual test pages
      {
        source: "/gamla-prov/:slug",
        destination: "/hogskoleprov/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

**Step 3: Commit**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/luxembourg-v2 && git add apps/web/next.config.* && git commit -m "feat(web): add 301 redirects from /gamla-prov to /hogskoleprov"
```

---

## Task 4: Populate Test Data

**Files:**
- Modify: `apps/web/src/data/tests.ts`

**Step 1: Update tests.ts with sample data**

Replace the empty `tests` array with actual test data:

```typescript
// Static test data - no Convex dependency
// PDFs are stored in /public/pdfs/{slug}/

export type FileType = "provpass" | "facit" | "kallhanvisning" | "normering";
export type Section = "verbal" | "kvantitativ";
export type Season = "var" | "host";

export interface TestFile {
  id: string;
  fileType: FileType;
  section?: Section;
  passNumber?: number;
  filename: string;
  sizeBytes: number;
}

export interface Test {
  id: string;
  year: number;
  season: Season;
  date: string;
  slug: string;
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
// PDFs should be placed in /public/pdfs/{slug}/
export const tests: Test[] = [
  {
    id: "hosten-2025",
    year: 2025,
    season: "host",
    date: "2025-10-19",
    slug: "hosten-2025",
    files: [], // Files will be added after test is administered
  },
  {
    id: "varen-2025",
    year: 2025,
    season: "var",
    date: "2025-04-05",
    slug: "varen-2025",
    files: [], // Placeholder - update when PDFs are available
  },
  {
    id: "hosten-2024",
    year: 2024,
    season: "host",
    date: "2024-10-20",
    slug: "hosten-2024",
    files: [], // Placeholder - add actual files
  },
  {
    id: "varen-2024",
    year: 2024,
    season: "var",
    date: "2024-04-13",
    slug: "varen-2024",
    files: [], // Placeholder - add actual files
  },
  {
    id: "hosten-2023",
    year: 2023,
    season: "host",
    date: "2023-10-22",
    slug: "hosten-2023",
    files: [], // Placeholder - add actual files
  },
  {
    id: "varen-2023",
    year: 2023,
    season: "var",
    date: "2023-04-01",
    slug: "varen-2023",
    files: [], // Placeholder - add actual files
  },
  {
    id: "hosten-2022",
    year: 2022,
    season: "host",
    date: "2022-10-23",
    slug: "hosten-2022",
    files: [], // Placeholder - add actual files
  },
  {
    id: "varen-2022",
    year: 2022,
    season: "var",
    date: "2022-04-02",
    slug: "varen-2022",
    files: [], // Placeholder - add actual files
  },
];
```

**Step 2: Commit**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/luxembourg-v2 && git add apps/web/src/data/tests.ts && git commit -m "feat(web): populate tests data with historical HP administrations"
```

---

## Task 5: Update Footer with Test Links

**Files:**
- Modify: `apps/web/src/components/site/site-footer.tsx`

**Step 1: Update footer with test links**

Replace the entire file:

```tsx
import Link from "next/link";
import { tests } from "@/data/tests";

export function SiteFooter() {
  // Get the 4 most recent tests
  const recentTests = tests
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return a.season === "host" ? -1 : 1;
    })
    .slice(0, 4);

  return (
    <footer className="bg-card-background border-t border-border py-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-extrabold text-primary mb-4">Maxa</h3>
          <p className="text-foreground-muted text-sm">
            Plugga smart for Hogskoleprovet.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-4">Resurser</h4>
          <ul className="space-y-2 text-sm text-foreground-muted">
            <li>
              <Link
                href="/hogskoleprov"
                className="hover:text-primary transition-colors"
              >
                Gamla hogskoleprov
              </Link>
            </li>
            <li>
              <Link
                href="/normering"
                className="hover:text-primary transition-colors"
              >
                Normering
              </Link>
            </li>
            <li>
              <Link
                href="/studieplan"
                className="hover:text-primary transition-colors"
              >
                Studieplan
              </Link>
            </li>
            <li>
              <Link
                href="/antagningsstatistik"
                className="hover:text-primary transition-colors"
              >
                Antagningsstatistik
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-4">Senaste proven</h4>
          <ul className="space-y-2 text-sm text-foreground-muted">
            {recentTests.map((test) => (
              <li key={test.id}>
                <Link
                  href={`/hogskoleprov/${test.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {test.season === "var" ? "Varen" : "Hosten"} {test.year}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-4">Foretaget</h4>
          <ul className="space-y-2 text-sm text-foreground-muted">
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Om oss
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Kontakt
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Integritetspolicy
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-border text-center text-sm text-foreground-muted">
        &copy; 2026 Maxa. Alla rattigheter forbehallna.
      </div>
    </footer>
  );
}
```

**Step 2: Commit**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/luxembourg-v2 && git add apps/web/src/components/site/site-footer.tsx && git commit -m "feat(web): update footer with test links and recent tests section"
```

---

## Task 6: Delete Old `/gamla-prov` Directory

**Files:**
- Delete: `apps/web/src/app/gamla-prov/` (entire directory)

**Step 1: Remove old directory**

```bash
rm -rf /Users/williamlarsten/conductor/workspaces/maxa/luxembourg-v2/apps/web/src/app/gamla-prov
```

**Step 2: Verify deletion**

```bash
ls /Users/williamlarsten/conductor/workspaces/maxa/luxembourg-v2/apps/web/src/app/gamla-prov 2>&1 | grep -q "No such file" && echo "Directory deleted successfully"
```

**Step 3: Commit**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/luxembourg-v2 && git add -A && git commit -m "refactor(web): remove old /gamla-prov route (replaced by /hogskoleprov)"
```

---

## Task 7: Create Public PDFs Directory

**Files:**
- Create: `apps/web/public/pdfs/.gitkeep`

**Step 1: Create directory structure**

```bash
mkdir -p /Users/williamlarsten/conductor/workspaces/maxa/luxembourg-v2/apps/web/public/pdfs
touch /Users/williamlarsten/conductor/workspaces/maxa/luxembourg-v2/apps/web/public/pdfs/.gitkeep
```

**Step 2: Add README for PDF structure**

Create `apps/web/public/pdfs/README.md`:

```markdown
# PDF Storage

This directory contains PDFs for historical Hogskoleprovet tests.

## Directory Structure

```
pdfs/
  hosten-2024/
    provpass-1-verbal.pdf
    provpass-2-kvantitativ.pdf
    provpass-3-verbal.pdf
    provpass-4-kvantitativ.pdf
    facit.pdf
    normering.pdf
  varen-2024/
    ...
```

## Adding New Tests

1. Create a folder with the test slug (e.g., `hosten-2024`)
2. Add PDF files following the naming convention
3. Update `src/data/tests.ts` with file metadata
```

**Step 3: Commit**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/luxembourg-v2 && git add apps/web/public/pdfs/ && git commit -m "chore(web): add PDFs directory structure"
```

---

## Task 8: Test the Application

**Step 1: Start dev server**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/luxembourg-v2 && bun run dev:web
```

**Step 2: Verify in browser**

Open http://localhost:3000 and check:
- [ ] `/hogskoleprov` shows test listing grouped by year
- [ ] `/hogskoleprov/hosten-2024` shows individual test page
- [ ] Redirect from `/gamla-prov` works (301 to `/hogskoleprov`)
- [ ] Redirect from `/gamla-prov/hosten-2024` works
- [ ] Footer shows "Senaste proven" with links
- [ ] SEO metadata is correct (view page source)

**Step 3: Fix any issues found**

Address any runtime errors or visual issues.

---

## Task 9: Final Verification and Cleanup

**Step 1: Run type check**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/luxembourg-v2/apps/web && bun run typecheck
```

Expected: No TypeScript errors

**Step 2: Run lint**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/luxembourg-v2 && bun run lint
```

Expected: No lint errors (or fix any that appear)

**Step 3: Final commit if needed**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/luxembourg-v2 && git add -A && git status
```

If there are uncommitted changes:
```bash
git commit -m "chore: final cleanup for hogskoleprov pages"
```

---

## Summary

This plan restructures the test pages for optimal SEO:

**URL Changes:**
- `/gamla-prov` -> `/hogskoleprov` (301 redirect)
- `/gamla-prov/hosten-2024` -> `/hogskoleprov/hosten-2024` (301 redirect)

**New Features:**
- Tests grouped by year on listing page
- SEO-optimized metadata for each page
- Footer with direct links to recent tests
- Placeholder structure for upcoming tests
- "Related tests" section on individual pages

**Files Created:**
- `apps/web/src/app/hogskoleprov/page.tsx`
- `apps/web/src/app/hogskoleprov/[slug]/page.tsx`
- `apps/web/public/pdfs/.gitkeep`
- `apps/web/public/pdfs/README.md`

**Files Modified:**
- `apps/web/next.config.ts` (redirects)
- `apps/web/src/data/tests.ts` (test data)
- `apps/web/src/components/site/site-footer.tsx` (test links)

**Files Deleted:**
- `apps/web/src/app/gamla-prov/` (entire directory)

**Next Steps After Implementation:**
1. Download actual PDFs from studera.nu
2. Upload to `/public/pdfs/` or Convex storage
3. Update `tests.ts` with file metadata
4. Add Schema.org structured data for better search results
5. Submit updated sitemap to Google Search Console
