import type { Article, BreadcrumbList, Thing, WithContext } from 'schema-dts';
import type { Test } from '@/data/tests';

const BASE_URL = 'https://maxa.se';

interface JsonLdProps {
  data: WithContext<Thing>;
}

/**
 * Renders JSON-LD structured data as a script tag.
 * Uses dangerouslySetInnerHTML with proper escaping to prevent XSS.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}

/**
 * Formats season for display in Swedish.
 * "vår" -> "Varen", "höst" -> "Hosten"
 */
function formatSeasonLabel(season: 'vår' | 'höst'): string {
  return season === 'vår' ? 'Varen' : 'Hosten';
}

/**
 * Generates Article JSON-LD for a test detail page.
 * Used for Google rich snippet eligibility.
 */
export function generateArticleJsonLd(test: Test): WithContext<Article> {
  const seasonLabel = test.season === 'vår' ? 'varen' : 'hosten';
  const headline = `Hogskoleprovet ${seasonLabel} ${test.year} - PDF, Facit & Normering`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    datePublished: test.date,
    publisher: {
      '@type': 'Organization',
      name: 'Maxa',
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/hogskoleprovet/${test.slug}`,
    },
  };
}

/**
 * Generates BreadcrumbList JSON-LD for navigation hierarchy.
 *
 * For list page (no test): Hem > Gamla prov
 * For detail page (with test): Hem > Gamla prov > {Season} {Year}
 *
 * Per Google docs, the final item omits the 'item' property.
 */
export function generateBreadcrumbJsonLd(test?: Test): WithContext<BreadcrumbList> {
  const breadcrumbs: {
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Hem',
      item: BASE_URL,
    },
  ];

  if (test) {
    // Detail page: Hem > Gamla prov > {Season} {Year}
    breadcrumbs.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Gamla prov',
      item: `${BASE_URL}/hogskoleprovet`,
    });
    breadcrumbs.push({
      '@type': 'ListItem',
      position: 3,
      name: `${formatSeasonLabel(test.season)} ${test.year}`,
      // Final item omits 'item' property per Google docs
    });
  } else {
    // List page: Hem > Gamla prov
    breadcrumbs.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Gamla prov',
      // Final item omits 'item' property per Google docs
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs,
  };
}
