import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { tests } from "@/data/tests";

export default function GamlaProvPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-text-primary mb-4">
            Gamla högskoleprov
          </h1>
          <p className="text-lg text-text-muted mb-8">
            Ladda ner tidigare högskoleprov med provfrågor, facit och
            normeringstabeller från 2013 till idag.
          </p>

          {tests.length === 0 ? (
            <div className="text-text-muted">Inga prov tillgängliga ännu.</div>
          ) : (
            <div className="grid gap-4">
              {tests.map((test) => (
                <Link
                  key={test.id}
                  href={`/gamla-prov/${test.slug}`}
                  className="block p-6 bg-white rounded-2xl border-2 border-border hover:border-primary transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                        Högskoleprovet{" "}
                        {test.season === "vår" ? "våren" : "hösten"} {test.year}
                      </h2>
                      {test.date && (
                        <p className="text-text-muted text-sm mt-1">
                          {formatDate(test.date)}
                        </p>
                      )}
                    </div>
                    <span className="text-2xl">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
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
