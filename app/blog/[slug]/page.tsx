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
import {
  getKeywordLandingPageBySlug,
  getRelatedKeywordLandingPages,
  keywordLandingPages,
  type KeywordLandingSection,
} from "@/lib/keyword-landing-pages";
import {
  getAllKeywordGuideSlugs,
  getKeywordGuideBySlug,
  getRelatedKeywordGuides,
  hasDbEnv,
} from "@/lib/database/keyword-guides-repository";

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

  if (post) {
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

  const keywordPage = hasDbEnv() ? await getKeywordGuideBySlug(slug) : getKeywordLandingPageBySlug(slug);
  if (!keywordPage) {
    return {};
  }

  return genMeta({
    title: keywordPage.title,
    description: keywordPage.description,
    keywords: [
      keywordPage.keyword,
      "car rental software UAE",
      "fleet management UAE",
      "rental business software Dubai",
      "car rental CRM",
      "car rental booking system",
    ],
    canonical: `${siteConfig.url}/blog/${keywordPage.slug}`,
    article: false,
  });
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const postSlugs = new Set(posts.map((p) => p.slug));
  const keywordSlugs = (hasDbEnv() ? await getAllKeywordGuideSlugs() : keywordLandingPages.map((p) => p.slug)).filter(
    (s) => !postSlugs.has(s)
  );

  return [...posts.map((post) => ({ slug: post.slug })), ...keywordSlugs.map((slug) => ({ slug }))];
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // If it's a normal blog post, render the existing blog template.
  if (post) {
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

  // Otherwise: keyword landing page as a "blog article"
  const page = hasDbEnv() ? await getKeywordGuideBySlug(slug) : getKeywordLandingPageBySlug(slug);
  if (!page) notFound();

  function toPlainText(s: string): string {
    return s.replace(/\*\*(.*?)\*\*/g, "$1");
  }

  function linkifyBullet(bullet: string) {
    const urlMatch = bullet.match(/https?:\/\/[^\s]+/);
    if (!urlMatch) return <span>{bullet}</span>;
    const url = urlMatch[0];
    const before = bullet.slice(0, urlMatch.index || 0).trim();
    const after = bullet.slice((urlMatch.index || 0) + url.length).trim();
    return (
      <span>
        {before ? `${before} ` : null}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {url}
        </a>
        {after ? ` ${after}` : null}
      </span>
    );
  }

  function renderSection(section: KeywordLandingSection) {
    if (section.type === "text") {
      return (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{section.heading}</h2>
          <div className="prose prose-lg max-w-none">
            {section.paragraphs.map((p, idx) => (
              <p key={idx}>{toPlainText(p)}</p>
            ))}
          </div>
        </section>
      );
    }

    if (section.type === "bullets") {
      return (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{section.heading}</h2>
          {section.intro ? <p className="text-gray-700 mb-4">{section.intro}</p> : null}
          <ul className="space-y-3">
            {section.bullets.map((b, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-1 text-green-600">✓</span>
                <span className="text-gray-800">{linkifyBullet(toPlainText(b))}</span>
              </li>
            ))}
          </ul>
          {section.outro ? <p className="text-gray-700 mt-5">{section.outro}</p> : null}
        </section>
      );
    }

    return (
      <section key={section.id} id={section.id} className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{section.heading}</h2>
        {section.intro ? <p className="text-gray-700 mb-4">{section.intro}</p> : null}
        <div className="overflow-x-auto border rounded-xl bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {section.columns.map((c) => (
                  <th key={c} className="text-left font-semibold text-gray-700 px-4 py-3 border-b">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {section.columns.map((c) => (
                    <td key={c} className="px-4 py-3 text-gray-800 align-top">
                      {row[c] || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {section.outro ? <p className="text-gray-700 mt-5">{section.outro}</p> : null}
      </section>
    );
  }

  const related = hasDbEnv()
    ? await getRelatedKeywordGuides(page.slug, 8)
    : getRelatedKeywordLandingPages(page.slug, { limit: 8 });
  const faqSchema = generateFAQSchema(page.faqs);
  const dateModified = "modifiedTime" in page ? page.modifiedTime : (page as any).updatedAtISO;
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url: `${siteConfig.url}/blog/${page.slug}`,
    inLanguage: "en-AE",
    dateModified,
  };

  return (
    <>
      <article className="bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: page.keyword, href: `/blog/${page.slug}` },
          ]}
        />
        <header className="bg-gradient-to-br from-blue-50 via-white to-amber-50 py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {page.h1}
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                {page.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/compare"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg"
                >
                  Compare options
                </Link>
                <a
                  href={`${siteConfig.promotedSites.autycloud.url}/demo`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 border-2 border-blue-200 font-semibold rounded-lg hover:bg-blue-50 transition-all"
                >
                  Book a software demo
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Keyword Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-10">
            <div>
              {/* TOC */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-8">
                <div className="font-semibold text-gray-900 mb-3">On this page</div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {page.toc.map((t) => (
                    <a key={t.id} href={`#${t.id}`} className="text-sm text-blue-700 hover:text-blue-900">
                      {t.label}
                    </a>
                  ))}
                  <a href="#faqs" className="text-sm text-blue-700 hover:text-blue-900">
                    FAQs
                  </a>
                  <a href="#related" className="text-sm text-blue-700 hover:text-blue-900">
                    Related
                  </a>
                </div>
              </div>

              {/* Social Share */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <SocialShare url={`${siteConfig.url}/blog/${page.slug}`} title={page.title} />
              </div>

              <div className="space-y-12">
                {page.sections.map(renderSection)}

                <section id="faqs" className="scroll-mt-24">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">FAQs</h2>
                  <div className="space-y-4">
                    {page.faqs.map((faq, idx) => (
                      <details key={idx} className="bg-gray-50 border rounded-xl p-5">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                          {faq.question}
                        </summary>
                        <div className="mt-3 text-gray-700">{faq.answer}</div>
                      </details>
                    ))}
                  </div>
                </section>

                <section id="related" className="scroll-mt-24">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Related</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {related.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/blog/${p.slug}`}
                        className="bg-white border rounded-xl p-5 hover:shadow-md transition"
                      >
                        <div className="font-semibold text-gray-900 mb-1">{p.keyword}</div>
                        <div className="text-sm text-gray-600 line-clamp-2">{p.description}</div>
                      </Link>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-6 space-y-6">
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="text-sm font-semibold text-gray-900 mb-2">Quick actions</div>
                  <div className="space-y-3">
                    <a
                      href={`${siteConfig.promotedSites.autycloud.url}/features`}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-lg border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition"
                    >
                      Cloud-based car rental CRM features
                    </a>
                    <a
                      href={`${siteConfig.promotedSites.autycloud.url}/pricing`}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-lg border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition"
                    >
                      Pricing transparency check
                    </a>
                    <a
                      href={`${siteConfig.promotedSites.autycloud.url}/demo`}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition"
                    >
                      Book demo
                    </a>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="text-sm font-semibold text-gray-900 mb-2">More reading</div>
                  <Link href="/blog" className="text-sm text-blue-700 hover:text-blue-900">
                    Browse all posts →
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
