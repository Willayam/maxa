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

  const seasonLabel = test.season === "vår" ? "våren" : "hösten";
  const title = `Högskoleprovet ${seasonLabel} ${test.year} - PDF, Facit & Normering | Maxa`;
  const description = `Ladda ner högskoleprovet från ${seasonLabel} ${test.year}. Provfrågor, facit och normeringstabell i PDF-format.`;

  return {
    title,
    description,
    keywords: [
      `högskoleprov ${seasonLabel} ${test.year}`,
      `hp ${test.year}`,
      `högskoleprov ${test.year} facit`,
      `högskoleprov ${test.year} normering`,
      `högskoleprov ${test.year} pdf`,
    ],
    alternates: {
      canonical: `/hogskoleprovet/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/hogskoleprovet/${slug}`,
    },
  };
}

export default async function TestPage({ params }: PageProps) {
  const { slug } = await params;
  const test = getTestBySlug(slug);

  if (!test) {
    notFound();
  }

  const seasonLabel = test.season === "vår" ? "Våren" : "Hösten";
  const title = `Högskoleprovet ${seasonLabel.toLowerCase()} ${test.year}`;

  const grouped = groupFiles(test.files);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/hogskoleprovet"
            className="text-foreground-muted hover:text-primary transition-colors mb-6 inline-flex items-center gap-2"
          >
            <span>←</span> Alla högskoleprov
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
                Filerna för detta prov är inte tillgängliga ännu.
              </p>
              <p className="text-sm text-foreground-muted">
                Kom tillbaka efter provdagen för att ladda ner provfrågor, facit
                och normering.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {grouped.provpass.length > 0 && (
                <FileSection
                  title="Provpass"
                  description="Ladda ner provfrågorna"
                  files={grouped.provpass}
                  test={test}
                />
              )}

              {grouped.facit.length > 0 && (
                <FileSection
                  title="Facit"
                  description="Rätta svar"
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
                  title="Källhänvisningar"
                  description="Referenser och källor"
                  files={grouped.kallhanvisning}
                  test={test}
                />
              )}
            </div>
          )}

          <section className="mt-16 pt-8 border-t border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Fler högskoleprov
            </h2>
            <div className="grid gap-3">
              {tests
                .filter((t) => t.id !== test.id)
                .slice(0, 4)
                .map((t) => (
                  <Link
                    key={t.id}
                    href={`/hogskoleprovet/${t.slug}`}
                    className="flex items-center justify-between p-4 bg-card-background rounded-xl border-2 border-border hover:border-primary transition-colors group"
                  >
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {t.season === "vår" ? "Våren" : "Hösten"} {t.year}
                    </span>
                    <span className="text-foreground-muted group-hover:text-primary">
                      →
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
        <span className="text-2xl">📄</span>
        <div>
          <p className="font-semibold text-foreground">{label}</p>
          <p className="text-sm text-foreground-muted">{sizeLabel}</p>
        </div>
      </div>
      <span className="text-primary font-bold">Ladda ner ↓</span>
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
    parts.push("Källhänvisning");
  }

  return parts.length === 0 ? file.filename : parts.join(" ");
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

  grouped.provpass.sort((a, b) => (a.passNumber || 0) - (b.passNumber || 0));

  return grouped;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
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
