import { notFound } from "next/navigation";
import Link from "next/link";
import { generateMetadata as genMeta } from "@/lib/seo-utils";
import { siteConfig } from "@/lib/site-config";
import { getPostBySlug, getAllPosts } from "@/lib/blog-posts";
import SocialShare from "@/components/SocialShare";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {};
  }

  return genMeta({
    title: post.title,
    description: post.excerpt,
    keywords: [post.category, "UAE rental", "fleet management", "rental business"],
    canonical: `${siteConfig.url}/blog/${post.slug}`,
    article: true,
    publishedTime: "2024-01-15T00:00:00Z",
    modifiedTime: "2024-01-15T00:00:00Z"
  });
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts();
  const relatedPosts = allPosts.filter(p => p.slug !== post.slug).slice(0, 3);
  const postUrl = `${siteConfig.url}/blog/${post.slug}`;

  return (
    <>
      {/* Article Header */}
      <article className="bg-white">
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
                  <time dateTime="2024-01-15">January 15, 2024</time>
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
          {/* Social Share */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <SocialShare url={postUrl} title={post.title} />
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
              <p className="text-gray-700 font-medium">
                This comprehensive guide provides actionable insights for UAE rental business owners looking to optimize their operations and drive growth.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12">Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The UAE rental market is experiencing unprecedented growth, driven by tourism, corporate demand, and digital transformation. Whether you are running a small fleet or managing hundreds of vehicles, understanding the latest trends and best practices is crucial for success.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12">Key Strategies for Success</h2>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">1. Embrace Digital Transformation</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Modern fleet management requires sophisticated software solutions. {" "}
              <a
                href={siteConfig.promotedSites.autycloud.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline font-semibold"
              >
                Fleet management software
              </a>
              {" "} like AutyCloud enables real-time tracking, automated scheduling, and data-driven decision making. By implementing cloud-based solutions, rental businesses can reduce operational costs by up to 30% while improving customer satisfaction.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Optimize Fleet Utilization</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Maximizing vehicle utilization is essential for profitability. Track key metrics such as:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Average rental duration</li>
              <li>Vehicle downtime between bookings</li>
              <li>Seasonal demand patterns</li>
              <li>Maintenance scheduling efficiency</li>
              <li>Customer booking preferences</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3. Ensure Regulatory Compliance</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              UAE rental businesses must comply with strict regulations set by the Roads and Transport Authority (RTA). Stay updated on:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Vehicle registration and insurance requirements</li>
              <li>Driver eligibility and verification processes</li>
              <li>Data protection and privacy laws</li>
              <li>Contract documentation standards</li>
              <li>Safety and maintenance protocols</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Enhance Customer Experience</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              In the competitive UAE market, exceptional customer service is a key differentiator. Successful {" "}
              <a
                href={siteConfig.promotedSites.adnanRentals.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline font-semibold"
              >
                car rental services
              </a>
              {" "} focus on seamless booking experiences, transparent pricing, and responsive support. Consider implementing:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Mobile-friendly booking platforms</li>
              <li>24/7 customer support channels</li>
              <li>Contactless pickup and return options</li>
              <li>Loyalty programs and referral incentives</li>
              <li>Real-time vehicle availability updates</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12">Technology Implementation</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Investing in the right technology stack can transform your rental business operations. Modern solutions offer:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Automated scheduling</strong> to reduce booking conflicts</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>GPS tracking</strong> for vehicle location and security</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Dynamic pricing</strong> based on demand and seasonality</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Analytics dashboards</strong> for business intelligence</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Payment processing</strong> with multiple payment methods</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12">Conclusion</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Success in the UAE rental market requires a combination of operational excellence, technology adoption, and customer-centric strategies. By implementing modern fleet management solutions, staying compliant with regulations, and focusing on customer experience, your rental business can achieve sustainable growth in this dynamic market.
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-lg p-8 mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Transform Your Rental Business?</h3>
              <p className="text-gray-700 mb-6">
                Explore our comprehensive tools and resources designed specifically for UAE rental businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/tools"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                >
                  Explore Free Tools
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all"
                >
                  Get Consultation
                </Link>
              </div>
            </div>
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
