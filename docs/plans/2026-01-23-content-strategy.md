# Content Strategy Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a markdown-based CMS with SEO-optimized content pages for Maxa HP website.

**Architecture:** Content files in `/content/` at monorepo root, parsed at build time with gray-matter, rendered with react-markdown. Single catch-all route handles all content pages with full static generation.

**Tech Stack:** Next.js 14, gray-matter, react-markdown, remark-gfm, Tailwind CSS

---

## Task 1: Install Dependencies

**Files:**
- Modify: `apps/web/package.json`

**Step 1: Add dependencies**

Run from `apps/web`:
```bash
cd apps/web && bun add gray-matter react-markdown remark-gfm
```

**Step 2: Verify installation**

Run: `bun install` from monorepo root
Expected: No errors, packages installed

**Step 3: Commit**

```bash
git add apps/web/package.json bun.lockb
git commit -m "feat(web): add markdown content dependencies"
```

---

## Task 2: Create Content Directory Structure

**Files:**
- Create: `content/` directory structure
- Move: `docs/content/*.md` to new locations

**Step 1: Create the content directory structure**

```bash
mkdir -p content/antagningsstatistik content/studieplan
```

**Step 2: Move and rename content files**

```bash
# Root pages
cp docs/content/index.md content/index.md
cp docs/content/gamla-prov.md content/gamla-prov.md
cp docs/content/normering.md content/normering.md
cp docs/content/lonestatistik.md content/lonestatistik.md

# Antagningsstatistik hub + program pages
cp docs/content/antagningsstatistik.md content/antagningsstatistik/index.md
cp docs/content/antagningsstatistik-lakarprogrammet.md content/antagningsstatistik/lakarprogrammet.md
cp docs/content/antagningsstatistik-juristprogrammet.md content/antagningsstatistik/juristprogrammet.md
cp docs/content/antagningsstatistik-psykologprogrammet.md content/antagningsstatistik/psykologprogrammet.md
cp docs/content/antagningsstatistik-industriell-ekonomi.md content/antagningsstatistik/industriell-ekonomi.md
cp docs/content/antagningsstatistik-arkitekt.md content/antagningsstatistik/arkitekt.md

# Studieplan hub + sub-pages
cp docs/content/studieplan.md content/studieplan/index.md
cp docs/content/studieplan-3-manader.md content/studieplan/3-manader.md
cp docs/content/studieplan-sista-veckan.md content/studieplan/sista-veckan.md
```

**Step 3: Verify structure**

Run: `find content -name "*.md" | sort`
Expected output:
```
content/antagningsstatistik/arkitekt.md
content/antagningsstatistik/index.md
content/antagningsstatistik/industriell-ekonomi.md
content/antagningsstatistik/juristprogrammet.md
content/antagningsstatistik/lakarprogrammet.md
content/antagningsstatistik/psykologprogrammet.md
content/gamla-prov.md
content/index.md
content/lonestatistik.md
content/normering.md
content/studieplan/3-manader.md
content/studieplan/index.md
content/studieplan/sista-veckan.md
```

**Step 4: Commit**

```bash
git add content/
git commit -m "feat(content): create content directory with markdown files"
```

---

## Task 3: Create Content Loading Utilities

**Files:**
- Create: `apps/web/src/lib/content.ts`

**Step 1: Create the content utilities file**

Create `apps/web/src/lib/content.ts`:

```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Content directory is at monorepo root
const contentDirectory = path.join(process.cwd(), '../../content');

export interface ContentPage {
  slug: string[];
  title: string;
  description: string;
  content: string;
}

/**
 * Get all content slugs for static generation
 */
export function getAllContentSlugs(): string[][] {
  const slugs: string[][] = [];

  function walkDir(dir: string, currentSlug: string[] = []) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath, [...currentSlug, file]);
      } else if (file.endsWith('.md')) {
        if (file === 'index.md') {
          // index.md -> parent slug (or empty for root)
          slugs.push(currentSlug.length === 0 ? [] : currentSlug);
        } else {
          // other.md -> parent slug + filename without extension
          slugs.push([...currentSlug, file.replace('.md', '')]);
        }
      }
    }
  }

  walkDir(contentDirectory);
  return slugs;
}

/**
 * Get content by slug array
 */
export function getContentBySlug(slug: string[]): ContentPage | null {
  // Try slug as file first, then as directory with index.md
  const possiblePaths = [
    path.join(contentDirectory, ...slug) + '.md',
    path.join(contentDirectory, ...slug, 'index.md'),
  ];

  // Special case: empty slug = root index.md
  if (slug.length === 0) {
    possiblePaths.unshift(path.join(contentDirectory, 'index.md'));
  }

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || 'Untitled',
        description: data.description || '',
        content,
      };
    }
  }

  return null;
}
```

**Step 2: Verify TypeScript compiles**

Run from `apps/web`:
```bash
cd apps/web && bun run typecheck
```
Expected: No type errors

**Step 3: Commit**

```bash
git add apps/web/src/lib/content.ts
git commit -m "feat(web): add content loading utilities"
```

---

## Task 4: Create Markdown Renderer Component

**Files:**
- Create: `apps/web/src/components/markdown-renderer.tsx`

**Step 1: Create the markdown renderer**

Create `apps/web/src/components/markdown-renderer.tsx`:

```tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="text-4xl font-extrabold text-text-primary mb-6 mt-8 first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold text-text-primary mb-4 mt-8">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-bold text-text-primary mb-3 mt-6">
            {children}
          </h3>
        ),
        // Paragraphs
        p: ({ children }) => (
          <p className="text-text-primary mb-4 leading-relaxed">{children}</p>
        ),
        // Links - use Next.js Link for internal, regular anchor for external
        a: ({ href, children }) => {
          const isInternal = href?.startsWith('/');
          if (isInternal && href) {
            return (
              <Link href={href} className="text-primary font-semibold hover:underline">
                {children}
              </Link>
            );
          }
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              {children}
            </a>
          );
        },
        // Lists
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-4 space-y-2 text-text-primary">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2 text-text-primary">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-text-muted">
            {children}
          </blockquote>
        ),
        // Code
        code: ({ className, children }) => {
          const isBlock = className?.includes('language-');
          if (isBlock) {
            return (
              <code className="block bg-gray-100 rounded-lg p-4 my-4 overflow-x-auto text-sm">
                {children}
              </code>
            );
          }
          return (
            <code className="bg-gray-100 rounded px-1.5 py-0.5 text-sm">
              {children}
            </code>
          );
        },
        pre: ({ children }) => <pre className="my-4">{children}</pre>,
        // Tables (GFM)
        table: ({ children }) => (
          <div className="overflow-x-auto my-6">
            <table className="min-w-full border-collapse border border-border rounded-lg">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-50">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="border border-border px-4 py-2 text-left font-bold text-text-primary">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-border px-4 py-2 text-text-primary">
            {children}
          </td>
        ),
        // Strong and emphasis
        strong: ({ children }) => (
          <strong className="font-bold">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        // Horizontal rule
        hr: () => <hr className="my-8 border-border" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `cd apps/web && bun run typecheck`
Expected: No type errors

**Step 3: Commit**

```bash
git add apps/web/src/components/markdown-renderer.tsx
git commit -m "feat(web): add styled markdown renderer component"
```

---

## Task 5: Create Catch-All Content Route

**Files:**
- Create: `apps/web/src/app/[[...slug]]/page.tsx`
- Delete: `apps/web/src/app/page.tsx`

**Step 1: Delete the old homepage**

```bash
rm apps/web/src/app/page.tsx
```

**Step 2: Create the catch-all route**

Create `apps/web/src/app/[[...slug]]/page.tsx`:

```tsx
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
```

**Step 3: Verify TypeScript compiles**

Run: `cd apps/web && bun run typecheck`
Expected: No type errors

**Step 4: Commit**

```bash
git add apps/web/src/app/
git commit -m "feat(web): add catch-all route for content pages"
```

---

## Task 6: Delete Old Hogskoleprovet Pages

**Files:**
- Delete: `apps/web/src/app/hogskoleprovet/` directory

**Step 1: Remove the old pages**

```bash
rm -rf apps/web/src/app/hogskoleprovet
```

**Step 2: Commit**

```bash
git add -A
git commit -m "chore(web): remove old hogskoleprovet pages"
```

---

## Task 7: Update Site Header Navigation

**Files:**
- Modify: `apps/web/src/components/site/site-header.tsx`

**Step 1: Update navigation links to match new URL structure**

Replace contents of `apps/web/src/components/site/site-header.tsx`:

```tsx
import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold text-primary">
          Maxa
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/antagningsstatistik"
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            Antagning
          </Link>
          <Link
            href="/studieplan"
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            Studieplan
          </Link>
          <Link
            href="/gamla-prov"
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            Gamla prov
          </Link>
          <Link
            href="/normering"
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            Normering
          </Link>
        </nav>
        <a
          href="#"
          className="bg-primary text-text-primary font-bold uppercase text-sm px-4 py-2 rounded-xl border-b-[4px] border-primary-dark hover:translate-y-[2px] hover:border-b-[2px] transition-all"
        >
          Ladda ner
        </a>
      </div>
    </header>
  );
}
```

**Step 2: Commit**

```bash
git add apps/web/src/components/site/site-header.tsx
git commit -m "feat(web): update header navigation for new content structure"
```

---

## Task 8: Test the Build and Dev Server

**Step 1: Run the build**

```bash
cd apps/web && bun run build
```

Expected: Build succeeds with static pages generated for all content routes.

**Step 2: Start dev server and verify pages**

```bash
cd apps/web && bun run dev
```

Test these URLs manually:
- `http://localhost:3000/` - Homepage
- `http://localhost:3000/antagningsstatistik` - Stats hub
- `http://localhost:3000/antagningsstatistik/lakarprogrammet` - Program page
- `http://localhost:3000/studieplan` - Study plan hub
- `http://localhost:3000/studieplan/3-manader` - Sub-page
- `http://localhost:3000/gamla-prov` - Old exams
- `http://localhost:3000/normering` - Normering
- `http://localhost:3000/lonestatistik` - ROI/Salary

**Step 3: Verify internal links work**

Click internal links in the markdown content to ensure they navigate correctly.

**Step 4: Commit any fixes if needed**

---

## Task 9: Final Cleanup

**Step 1: Remove url field from frontmatter (optional)**

The `url` field in frontmatter is now redundant since file path = URL. Can be left for documentation purposes or removed for cleanliness.

**Step 2: Run lint**

```bash
bun run lint
```

Fix any lint errors if present.

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup for content strategy implementation"
```

---

## Verification Checklist

- [ ] All 13 content pages render correctly
- [ ] Tables display properly with GFM styling
- [ ] Internal links navigate within the app
- [ ] External links open in new tab
- [ ] SEO metadata (title, description) appears in page source
- [ ] Build generates static HTML for all content pages
- [ ] Header navigation works for all main sections
- [ ] Mobile responsive layout works
