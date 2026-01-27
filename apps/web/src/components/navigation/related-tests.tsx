import Link from "next/link";
import type { Test } from "@/data/tests";
import { getRelatedTests } from "@/lib/related-content";

interface RelatedTestsProps {
  currentTest: Test;
  limit?: number;
}

export function RelatedTests({ currentTest, limit = 4 }: RelatedTestsProps) {
  const related = getRelatedTests(currentTest, limit);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-border">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Fler högskoleprov
      </h2>
      <div className="grid gap-3">
        {related.map((t) => {
          const seasonLabel = t.season === "vår" ? "Våren" : "Hösten";
          return (
            <Link
              key={t.id}
              href={`/hogskoleprovet/${t.slug}`}
              className="flex items-center justify-between p-4 bg-card-background rounded-xl border-2 border-border hover:border-primary transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {seasonLabel} {t.year}
              </span>
              <span className="text-foreground-muted group-hover:text-primary">
                →
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
