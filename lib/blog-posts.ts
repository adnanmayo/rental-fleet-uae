import type { BlogArticle } from "@/lib/database/blog-repository";
import { getAllPublishedBlogArticles, getBlogArticleBySlug } from "@/lib/database/blog-repository";
import { blogArticles as fallbackBlogArticles } from "@/data/blog-articles";
import { calculateReadingTime, generateExcerpt } from "@/lib/seo-utils";

export interface BlogPost extends BlogArticle {
  excerpt: string;
  readTime: string;
}

function stripLeadingH1(html: string): string {
  return html.replace(/^\s*<h1\b[^>]*>[\s\S]*?<\/h1>\s*/i, "");
}

function stripEmbeddedToc(html: string): string {
  // Remove a common embedded TOC block that starts with <h2 id="toc">... and a following <ul>...</ul>
  return html.replace(
    /<h2\b[^>]*id=["']toc["'][^>]*>[\s\S]*?<\/h2>\s*<ul>[\s\S]*?<\/ul>\s*/i,
    ""
  );
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePost(post: BlogArticle): BlogPost {
  const cleanedHtml = stripEmbeddedToc(stripLeadingH1(post.contentHtml));
  const plainText = stripHtml(cleanedHtml);
  const excerpt = post.excerpt?.trim() ? post.excerpt : generateExcerpt(plainText, 170);
  const minutes = calculateReadingTime(plainText);
  return {
    ...post,
    contentHtml: cleanedHtml,
    excerpt,
    readTime: `${minutes} min read`,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const articles = await getAllPublishedBlogArticles();
    return articles.map(normalizePost);
  } catch {
    // Fallback for build/dev when DB isn't available yet (or schema not applied).
    return fallbackBlogArticles.map(normalizePost);
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const found = await getBlogArticleBySlug(slug);
    return found ? normalizePost(found) : null;
  } catch {
    const found = fallbackBlogArticles.find((p) => p.slug === slug);
    return found ? normalizePost(found) : null;
  }
}
