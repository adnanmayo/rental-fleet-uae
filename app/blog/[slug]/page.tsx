import { notFound } from "next/navigation";
import Link from "next/link";
import {
  generateMetadata as genMeta,
  generateArticleSchema,
  generateFAQSchema,
} from "@/lib/seo-utils";
import { siteConfig } from "@/lib/site-config";
import { getPostBySlug, getAllPosts } from "@/lib/blog-posts";
import SocialShare from "@/components/SocialShare";
import Breadcrumbs from "@/components/Breadcrumbs";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

type TocItem = { id: string; text: string; level: 2 | 3 };

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripHtmlTags(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim());
}

function extractToc(html: string): TocItem[] {
  const items: TocItem[] = [];
  const re = /<h([23])\b[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    const level = Number(match[1]) as 2 | 3;
    const id = match[2];
    const raw = match[3];
    if (!id || id.toLowerCase() === "toc") continue;
    const text = stripHtmlTags(raw);
    if (!text) continue;
    items.push({ id, text, level });
  }
  return items;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return genMeta({
    title: post.title,
    description: post.excerpt,
    keywords: [
      post.primaryKeyword,
      ...post.secondaryKeywords,
      post.category,
      "UAE rental",
      "fleet management",
      "rental business",
      "Dubai",
      "Abu Dhabi",
      "Sharjah",
    ],
    canonical: `${siteConfig.url}/blog/${post.slug}`,
    article: true,
    publishedTime: post.publishedTime,
    modifiedTime: post.modifiedTime,
  });
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getAllPosts();
  const relatedPosts = allPosts.filter(p => p.slug !== post.slug).slice(0, 3);
  const postUrl = `${siteConfig.url}/blog/${post.slug}`;
  const tocItems = extractToc(post.contentHtml);
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt,
    url: postUrl,
    imageUrl: `${siteConfig.url}${siteConfig.seo.ogImage.url}`,
    publishedTime: post.publishedTime,
    modifiedTime: post.modifiedTime,
    author: "Adnan Mumtaz",
    keywords: [post.primaryKeyword, ...post.secondaryKeywords],
  });

  const faqSchema = post.faqs?.length
    ? generateFAQSchema(post.faqs.map((f) => ({ question: f.question, answer: f.answer })))
    : null;

  return (
    <>
      {/* Article Header */}
      <article className="bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        {faqSchema ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        ) : null}
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title, href: `/blog/${post.slug}` },
          ]}
        />
        <header className="bg-gradient-to-br from-blue-50 via-white to-amber-50 py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                {post.category}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-center space-x-6 text-gray-600">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time dateTime={post.publishedTime}>
                    {new Date(post.publishedTime).toLocaleDateString("en-AE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-10">
            {/* Main Column */}
            <div>
              {/* Mobile TOC */}
              {tocItems.length > 0 ? (
                <div className="lg:hidden mb-8">
                  <details className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <summary className="cursor-pointer font-semibold text-gray-900">
                      On this page
                    </summary>
                    <div className="mt-4 space-y-2">
                      {tocItems.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`block text-sm text-blue-700 hover:text-blue-900 ${
                            item.level === 3 ? "pl-4" : ""
                          }`}
                        >
                          {item.text}
                        </a>
                      ))}
                    </div>
                  </details>
                </div>
              ) : null}

              {/* Social Share (inline) */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <SocialShare url={postUrl} title={post.title} />
              </div>

              {/* Main Content */}
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-6 space-y-6">
                {tocItems.length > 0 ? (
                  <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <div className="text-sm font-semibold text-gray-900 mb-3">On this page</div>
                    <nav className="space-y-2">
                      {tocItems.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`block text-sm text-gray-700 hover:text-blue-700 ${
                            item.level === 3 ? "pl-4" : ""
                          }`}
                        >
                          {item.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                ) : null}

                <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-amber-50 p-5">
                  <div className="text-sm font-semibold text-gray-900 mb-2">Quick actions</div>
                  <div className="space-y-3">
                    <SocialShare url={postUrl} title={post.title} className="flex-wrap" />
                    <a
                      href="https://autycloud.com/features"
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-lg border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition"
                    >
                      Cloud-based car rental CRM features
                    </a>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="text-sm font-semibold text-gray-900 mb-2">More reading</div>
                  <Link href="/blog" className="text-sm text-blue-700 hover:text-blue-900">
                    Browse all articles →
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {/* Share Again */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-4">Found this article helpful? Share it with your network:</p>
            <SocialShare url={postUrl} title={post.title} />
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`}>
                  <article className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all group h-full">
                    <div className="h-40 bg-gradient-to-br from-blue-600 to-blue-800 relative">
                      <div className="absolute bottom-4 left-4">
                        <span className="text-xs font-semibold text-white bg-blue-600/80 px-3 py-1 rounded-full backdrop-blur-sm">
                          {relatedPost.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{relatedPost.excerpt}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore More Insights
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Browse our complete library of articles for UAE rental businesses
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-lg"
          >
            View All Articles
          </Link>
        </div>
      </section>
    </>
  );
}
