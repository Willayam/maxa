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
