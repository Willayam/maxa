import Link from "next/link";
import { tests } from "@/data/tests";

interface RecentTestsProps {
  count?: number;
}

export function RecentTests({ count = 4 }: RecentTestsProps) {
  const recentTests = tests.slice(0, count);

  return (
    <section className="pt-8 border-t border-border">
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Öva med gamla prov
      </h2>
      <p className="text-foreground-muted mb-6">
        Nu när du känner till strategierna – testa dem på riktiga högskoleprov.
      </p>
      <div className="grid gap-3">
        {recentTests.map((test) => {
          const seasonLabel = test.season === "vår" ? "Våren" : "Hösten";
          return (
            <Link
              key={test.id}
              href={`/hogskoleprovet/${test.slug}`}
              className="flex items-center justify-between p-4 bg-card-background rounded-xl border-2 border-border hover:border-primary transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {seasonLabel} {test.year}
              </span>
              <span className="text-foreground-muted group-hover:text-primary">
                &rarr;
              </span>
            </Link>
          );
        })}
      </div>
      <Link
        href="/hogskoleprovet"
        className="block mt-4 text-primary hover:underline text-center"
      >
        Se alla prov &rarr;
      </Link>
    </section>
  );
}
