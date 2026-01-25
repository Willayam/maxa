"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Id } from "../../../../../../convex/_generated/dataModel";

export function TestPageClient() {
  const params = useParams();
  const slug = params.slug as string;

  const test = useQuery(api.tests.getBySlug, { slug });
  const files = useQuery(
    api.files.getByTest,
    test ? { testId: test._id } : "skip"
  );

  if (test === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-text-muted">Laddar prov...</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (test === null) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-text-primary mb-4">
              Prov hittades inte
            </h1>
            <Link href="/gamla-prov" className="text-primary hover:underline">
              ← Tillbaka till alla prov
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const seasonLabel = test.season === "vår" ? "våren" : "hösten";
  const title = `Högskoleprovet ${seasonLabel} ${test.year}`;

  // Group files by type
  const grouped = groupFiles(files || []);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/gamla-prov"
            className="text-text-muted hover:text-primary transition-colors mb-6 inline-block"
          >
            ← Alla prov
          </Link>

          <h1 className="text-4xl font-extrabold text-text-primary mb-2">
            {title}
          </h1>
          {test.date && (
            <p className="text-lg text-text-muted mb-8">
              {formatDate(test.date)}
            </p>
          )}

          {files === undefined ? (
            <p className="text-text-muted">Laddar filer...</p>
          ) : files.length === 0 ? (
            <p className="text-text-muted">Inga filer hittades för detta prov.</p>
          ) : (
            <div className="space-y-8">
              {grouped.provpass.length > 0 && (
                <FileSection
                  title="Provpass"
                  description="Ladda ner provfrågorna"
                  files={grouped.provpass}
                />
              )}

              {grouped.facit.length > 0 && (
                <FileSection
                  title="Facit"
                  description="Rätta svar"
                  files={grouped.facit}
                />
              )}

              {grouped.normering.length > 0 && (
                <FileSection
                  title="Normering"
                  description="Normeringstabeller"
                  files={grouped.normering}
                />
              )}

              {grouped.kallhanvisning.length > 0 && (
                <FileSection
                  title="Källhänvisningar"
                  description="Referenser och källor"
                  files={grouped.kallhanvisning}
                />
              )}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

interface TestFile {
  _id: Id<"testFiles">;
  storageId: Id<"_storage">;
  fileType: "provpass" | "facit" | "kallhanvisning" | "normering";
  section?: "verbal" | "kvantitativ";
  passNumber?: number;
  originalFilename: string;
  sizeBytes: number;
}

function FileSection({
  title,
  description,
  files,
}: {
  title: string;
  description: string;
  files: TestFile[];
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-1">{title}</h2>
      <p className="text-text-muted mb-4">{description}</p>
      <div className="grid gap-3">
        {files.map((file) => (
          <FileCard key={file._id} file={file} />
        ))}
      </div>
    </div>
  );
}

function FileCard({ file }: { file: TestFile }) {
  const url = useQuery(api.files.getUrl, { storageId: file.storageId });

  const label = getFileLabel(file);
  const sizeLabel = formatFileSize(file.sizeBytes);

  return (
    <a
      href={url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-between p-4 bg-white rounded-xl border-2 border-border hover:border-primary transition-colors ${
        !url ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">📄</span>
        <div>
          <p className="font-semibold text-text-primary">{label}</p>
          <p className="text-sm text-text-muted">{sizeLabel}</p>
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

  // If no meaningful label, use filename
  if (parts.length === 0 || (parts.length === 1 && parts[0] === "Provpass")) {
    return file.originalFilename;
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
