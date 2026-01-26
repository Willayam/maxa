import Link from "next/link";
import { Metadata } from "next";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { JsonLd, generateBreadcrumbJsonLd } from "@/lib/structured-data";
import { tests, type Test } from "@/data/tests";

export const metadata: Metadata = {
  title: "Gamla Högskoleprov - Ladda ner PDF med Facit | Maxa",
  description:
    "Ladda ner gamla högskoleprov gratis. Provfrågor, facit och normeringstabeller från 2013 till idag. Öva på riktiga HP-frågor.",
  keywords: [
    "gamla högskoleprov",
    "högskoleprov pdf",
    "hp frågor",
    "högskoleprov facit",
    "högskoleprov normering",
    "öva högskoleprov",
  ],
  alternates: {
    canonical: '/hogskoleprovet',
  },
  openGraph: {
    title: "Gamla Högskoleprov - Ladda ner PDF med Facit",
    description: "Ladda ner gamla högskoleprov gratis med facit och normering.",
    type: "website",
    url: '/hogskoleprovet',
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
      <JsonLd data={generateBreadcrumbJsonLd()} />
      <SiteHeader />
      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">
            Gamla högskoleprov
          </h1>
          <p className="text-lg text-foreground-muted mb-8">
            Ladda ner tidigare högskoleprov med provfrågor, facit och
            normeringstabeller från 2013 till idag.
          </p>

          {tests.length === 0 ? (
            <div className="text-foreground-muted">
              Inga prov tillgängliga ännu.
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
                        a.season === "höst" ? -1 : b.season === "höst" ? 1 : 0
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
              Hur använder jag gamla högskoleprov?
            </h2>
            <div className="prose prose-invert max-w-none text-foreground-muted">
              <ol className="list-decimal list-inside space-y-3">
                <li>
                  <strong className="text-foreground">Skriv ut dem.</strong>{" "}
                  Provet görs på papper. Vänj dig vid att bläddra, stryka under
                  och kladda i marginalen.
                </li>
                <li>
                  <strong className="text-foreground">Tidtagning.</strong> Ställ
                  en timer på 55 minuter per pass. Är du inte klar? Gissa på
                  resten, markera var du var, och fortsätt sen utan tidtagning.
                </li>
                <li>
                  <strong className="text-foreground">
                    Simulera provdagen.
                  </strong>{" "}
                  En lördag morgon, kör igenom ett helt prov (5 pass) med
                  raster. Det är ett maraton för hjärnan.
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
  const seasonLabel = test.season === "vår" ? "Våren" : "Hösten";
  const hasFiles = test.files.length > 0;

  return (
    <Link
      href={`/hogskoleprovet/${test.slug}`}
      className="block p-6 bg-card-background rounded-2xl border-2 border-border hover:border-primary transition-colors group"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            Högskoleprovet {seasonLabel.toLowerCase()} {test.year}
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
          →
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
