import Link from "next/link";
import { Metadata } from "next";
import { JsonLd } from "@/lib/structured-data";
import type { Article, BreadcrumbList, WithContext } from "schema-dts";

const BASE_URL = "https://maxa.se";

export const metadata: Metadata = {
  title: "HP Strategier - Knäck Högskoleprovet | Maxa",
  description:
    "Lär dig HP strategier som funkar. Undvik kvantitativa och verbala fallor, vanliga misstag och optimera din tidsplanering. Förbättra ditt resultat på högskoleprovet.",
  keywords: [
    "högskoleprovet strategier",
    "hp fallor",
    "hp tips",
    "högskoleprovet misstag",
    "högskoleprovet tidsplanering",
    "kvantitativa fallor",
    "verbala fallor",
    "hp teknik",
  ],
  alternates: {
    canonical: "/hogskoleprovet/strategier",
  },
  openGraph: {
    title: "HP Strategier - Knäck Högskoleprovet",
    description:
      "Lär dig HP strategier som funkar. Undvik fallor och misstag, optimera din tidsplanering.",
    type: "website",
    url: "/hogskoleprovet/strategier",
  },
};

// Breadcrumb JSON-LD for Hem > Högskoleprovet > Strategier
const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Hem",
      item: BASE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Högskoleprovet",
      item: `${BASE_URL}/hogskoleprovet`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Strategier",
      // Final item omits 'item' property per Google docs
    },
  ],
};

// Article JSON-LD for strategy content
const articleJsonLd: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "HP Strategier - Knäck Högskoleprovet",
  datePublished: "2026-01-27",
  publisher: {
    "@type": "Organization",
    name: "Maxa",
    url: BASE_URL,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${BASE_URL}/hogskoleprovet/strategier`,
  },
};

export default function StrategierPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={articleJsonLd} />

      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            href="/hogskoleprovet"
            className="text-foreground-muted hover:text-primary transition-colors mb-6 inline-flex items-center gap-2 text-sm"
          >
            <span>←</span> Högskoleprovet
          </Link>

          {/* Page header */}
          <h1 className="text-4xl font-extrabold text-foreground mb-2">
            HP Strategier
          </h1>
          <p className="text-lg text-foreground-muted mb-8">
            Knäck högskoleprovet med rätt teknik
          </p>

          {/* TL;DR Section */}
          <div className="bg-primary/10 border-2 border-primary rounded-2xl p-6 mb-12">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Snabbguide
            </h2>
            <ul className="space-y-2 text-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  Högskoleprovet är designat med fallor – lär dig känna igen
                  dem
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  Kvantitativa delen: Akta dig för mellanräkningsfällan och
                  enhetsförbistring
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  Verbala delen: Falska vänner och sekundära betydelser är
                  vanligast
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Gissa alltid – det finns ingen minuspoäng</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  Tidsplanering är lika viktigt som kunskap
                </span>
              </li>
            </ul>
          </div>

          {/* Section 1: Fallor att Undvika */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Lär dig känna igen fallorna
            </h2>
            <p className="text-foreground-muted mb-6">
              HP är inte bara ett kunskapstest – det är designat för att lura
              dig. De vanligaste fällorna dyker upp år efter år. När du känner
              igen dem, blir provet mycket enklare.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <ClusterCard
                title="Kvantitativa fallor"
                description="Undvik misstagen i XYZ, KVA, NOG och DTK. Lär dig känna igen de vanligaste räknefällorna."
                href="/hogskoleprovet/strategier/kvantitativa-fallor"
              />
              <ClusterCard
                title="Verbala fallor"
                description="Klara ORD, LAS, MEK och ELF utan att falla i fallorna. Falska vänner och betydelseförskjutningar."
                href="/hogskoleprovet/strategier/verbala-fallor"
              />
            </div>
          </section>

          {/* Section 2: Strategier för Framgång */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Optimera din prestation
            </h2>
            <p className="text-foreground-muted mb-6">
              Kunskap räcker inte. Du behöver rätt strategier för att maximera
              ditt resultat på provdagen.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <ClusterCard
                title="Vanliga misstag"
                description="De 12 vanligaste misstagen som sänker ditt resultat – och hur du undviker dem."
                href="/hogskoleprovet/strategier/vanliga-misstag"
              />
              <ClusterCard
                title="Tidsstrategi"
                description="Planera ditt prov och maximera poängen per minut. Lär dig när du ska gissa och när du ska satsa."
                href="/hogskoleprovet/strategier/tidsstrategi"
              />
            </div>
          </section>

          {/* Section 3: CTA to practice */}
          <section className="pt-8 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Öva med gamla prov
            </h2>
            <p className="text-foreground-muted mb-6">
              Nu när du känner till strategierna – testa dem på riktiga
              högskoleprov. Ladda ner gamla prov med facit och
              normeringstabeller.
            </p>
            <Link
              href="/hogskoleprovet"
              className="block p-6 bg-card-background rounded-2xl border-2 border-border hover:border-primary transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    Gamla högskoleprov
                  </h3>
                  <p className="text-foreground-muted mt-1">
                    Provfrågor, facit och normering från 2013 till idag
                  </p>
                </div>
                <span className="text-2xl text-foreground-muted group-hover:text-primary transition-colors">
                  →
                </span>
              </div>
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}

// ClusterCard component for linking to cluster pages
function ClusterCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block p-6 bg-card-background rounded-2xl border-2 border-border hover:border-primary transition-colors group"
    >
      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
        {title}
      </h3>
      <p className="text-foreground-muted mb-4">{description}</p>
      <span className="text-primary font-bold">Läs mer →</span>
    </Link>
  );
}
