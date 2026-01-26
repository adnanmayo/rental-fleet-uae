import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import DownloadButton from "@/components/DownloadButton";
import BacklinkBadge from "@/components/BacklinkBadge";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-amber-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                UAE&apos;s Premier Rental Business Resource Hub
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Empowering UAE Rental Businesses
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Expert insights, fleet management tools, and comprehensive resources to help your rental business thrive in the United Arab Emirates
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={siteConfig.promotedSites.autycloud.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl group"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Explore Fleet Software
                </a>
                <a
                  href={siteConfig.promotedSites.adnanRentals.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all group"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  View Rental Services
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center p-8">
                    <svg className="w-32 h-32 mx-auto mb-4 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h3 className="text-2xl font-bold mb-2">Trusted by UAE Rental Businesses</h3>
                    <p className="text-blue-100">Data-Driven Insights & Best Practices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Download Section - Backlink Magnet */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-50 to-blue-50 rounded-2xl shadow-xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-sm font-semibold mb-4">
                  FREE DOWNLOAD
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  2024 UAE Rental Market Report
                </h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Comprehensive 50-page guide covering market trends, regulatory compliance, best practices, and growth strategies for UAE rental businesses. Includes exclusive data and case studies.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Market size and growth projections",
                    "Customer behavior analysis",
                    "Technology adoption trends",
                    "Regulatory compliance checklist",
                    "Revenue optimization strategies"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <DownloadButton
                  title="Download Free Report"
                  file="uae-rental-market-report-2024.pdf"
                  description="50-page comprehensive guide"
                />
              </div>
              <div className="relative h-96 bg-white rounded-lg shadow-lg p-6">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <svg className="w-32 h-32 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm font-medium">Report Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Overview - Link Magnet Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              UAE Rental Industry at a Glance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Data-driven insights and statistics that showcase the growth and potential of the UAE rental market
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {[
              { number: "15.2B", label: "Market Size (AED)", desc: "2024 Projection" },
              { number: "12.5%", label: "Annual Growth", desc: "CAGR 2024-2028" },
              { number: "2.5M+", label: "Active Rentals", desc: "Per Year" },
              { number: "89%", label: "Tourist Demand", desc: "International Visitors" }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-900 font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.desc}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Key Market Drivers
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Tourism Boom",
                  description: "Dubai welcomed 16.7M tourists in 2023, driving massive demand for rental vehicles"
                },
                {
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  ),
                  title: "Corporate Growth",
                  description: "Expanding businesses require flexible fleet solutions for employees and operations"
                },
                {
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  ),
                  title: "Tech Innovation",
                  description: "Digital transformation with platforms like AutyCloud revolutionizing fleet management"
                }
              ].map((driver, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center text-blue-600 mb-4">
                    {driver.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{driver.title}</h4>
                  <p className="text-gray-600">{driver.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content - Blog Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Latest Insights
              </h2>
              <p className="text-gray-600">Expert articles to grow your rental business</p>
            </div>
            <Link
              href="/blog"
              className="hidden md:inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group"
            >
              View All Articles
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                category: "Fleet Tech",
                title: "How to Scale Your UAE Car Rental Business in 2024",
                excerpt: "Proven strategies for sustainable growth in the competitive UAE rental market",
                readTime: "8 min read"
              },
              {
                category: "Rental Tips",
                title: "Top Mistakes in Fleet Management and How to Avoid Them",
                excerpt: "Learn from common pitfalls and optimize your fleet operations",
                readTime: "6 min read"
              },
              {
                category: "UAE Business",
                title: "UAE Driving Laws for Rental Vehicles: Complete Guide",
                excerpt: "Stay compliant with the latest regulations and protect your business",
                readTime: "10 min read"
              }
            ].map((article, index) => (
              <article key={index} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="h-48 bg-gradient-to-br from-blue-600 to-blue-800"></div>
                <div className="p-6">
                  <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                    {article.category}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{article.readTime}</span>
                    <span className="text-blue-600 group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All Articles
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Resource Hub - Link Building Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Free Resources & Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Downloadable templates, calculators, and guides to optimize your rental business operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Fleet Management Checklist",
                description: "Daily, weekly, and monthly operational checklist to ensure nothing falls through the cracks",
                cta: "Download PDF"
              },
              {
                icon: "💰",
                title: "Rental Pricing Calculator",
                description: "Excel template for dynamic pricing strategy based on demand, season, and vehicle type",
                cta: "Download Template"
              },
              {
                icon: "📈",
                title: "ROI Calculator",
                description: "Calculate the return on investment for fleet management software implementation",
                cta: "Try Calculator"
              },
              {
                icon: "📋",
                title: "Compliance Guide",
                description: "UAE rental business regulatory compliance checklist and best practices",
                cta: "View Guide"
              },
              {
                icon: "🎯",
                title: "Fleet Size Optimizer",
                description: "Determine the optimal fleet size for your market and business goals",
                cta: "Use Tool"
              },
              {
                icon: "📚",
                title: "Customer Service Scripts",
                description: "Pre-written scripts for handling common rental scenarios and inquiries",
                cta: "Download Scripts"
              }
            ].map((resource, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{resource.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <Link
                  href="/tools"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group"
                >
                  {resource.cta}
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Case Studies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              See how UAE rental businesses are achieving growth with the right tools and strategies
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  A
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Adnan Rentals</h3>
                  <p className="text-sm text-gray-600">Dubai-based Car Rental</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                &quot;Implementing {' '}
                <a href={siteConfig.promotedSites.autycloud.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                  fleet management software
                </a>
                {' '} transformed our operations. We reduced operational costs by 30% and increased customer satisfaction significantly.&quot;
              </p>
              <a
                href={siteConfig.promotedSites.adnanRentals.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group"
              >
                Visit Adnan Rentals
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  M
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Mid-Size Fleet Operator</h3>
                  <p className="text-sm text-gray-600">Abu Dhabi</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                &quot;The resources and guides from Rental Fleet UAE helped us navigate UAE regulations smoothly. The free templates alone saved us countless hours.&quot;
              </p>
              <Link
                href="/resources"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group"
              >
                Explore Resources
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Backlink Badge Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Support the Community
            </h2>
            <p className="text-gray-600">
              Help us build the UAE rental business community by linking back to this resource hub
            </p>
          </div>
          <BacklinkBadge />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Rental Business?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join hundreds of successful UAE rental businesses using modern fleet management solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={siteConfig.promotedSites.autycloud.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg group"
            >
              <span>Try AutyCloud Free</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all"
            >
              Get Expert Consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
