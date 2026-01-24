import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { getAllContentSlugs, getContentBySlug } from '@/lib/content';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

// Generate static params for all content pages
export async function generateStaticParams() {
  const slugs = getAllContentSlugs();
  return slugs.map((slug) => ({
    slug: slug.length === 0 ? undefined : slug,
  }));
}

// Generate metadata from frontmatter
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getContentBySlug(slug || []);

  if (!content) {
    return { title: 'Page Not Found' };
  }

  return {
    title: `${content.title} | Maxa HP`,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
      type: 'website',
    },
  };
}

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params;
  const content = getContentBySlug(slug || []);

  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 py-12 px-6">
        <article className="max-w-3xl mx-auto">
          <MarkdownRenderer content={content.content} />
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
