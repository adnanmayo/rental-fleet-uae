import { Metadata } from 'next';
import Link from 'next/link';
import { generateMetadata } from '@/lib/seo-utils';
import { siteConfig } from '@/lib/site-config';
import BacklinkBadge from '@/components/BacklinkBadge';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = generateMetadata({
  title: 'About Us - UAE Rental Business Experts',
  description: 'Learn about Rental Fleet UAE\'s mission to empower rental businesses. Access our media kit, team expertise, and industry research for UAE car rental professionals.',
  keywords: ['UAE rental experts', 'rental business resources', 'media kit', 'industry authority', 'UAE expertise'],
  canonical: '/about'
});

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }]} />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-amber-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Empowering UAE Rental Businesses Through Knowledge
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              We are dedicated to providing comprehensive resources, expert insights, and innovative tools to help UAE rental businesses thrive in a competitive market.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Rental Fleet UAE was founded with a clear vision: to bridge the knowledge gap in the UAE rental business industry by creating a comprehensive resource hub that empowers operators at every level.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We believe that access to quality information, industry insights, and practical tools should not be a luxury. Through our platform, we provide free resources, data-driven research, and expert guidance to help rental businesses succeed.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our commitment to white-hat practices and valuable content creation has made us a trusted resource in the UAE rental community, partnering with leading solutions like{' '}
                <a href={siteConfig.promotedSites.autycloud.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                  AutyCloud
                </a>
                {' '}for fleet management technology.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">What We Offer</h3>
              <ul className="space-y-4">
                {[
                  'Original market research and industry data',
                  'Free downloadable templates and tools',
                  'Comprehensive guides for UAE compliance',
                  'Expert insights from industry veterans',
                  'Interactive calculators and optimizers',
                  'Curated resources and partnerships'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-6 h-6 mr-3 flex-shrink-0 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* UAE Expertise */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Deep UAE Market Expertise
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our understanding of the UAE rental market goes beyond surface-level insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Regulatory Knowledge</h3>
              <p className="text-gray-600 leading-relaxed">
                In-depth understanding of RTA Dubai, Abu Dhabi Municipality, and emirate-specific regulations affecting rental operations.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Climate Adaptation</h3>
              <p className="text-gray-600 leading-relaxed">
                Specialized knowledge of desert climate impacts on vehicles, peak summer challenges, and UAE-specific maintenance requirements.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Market Trends</h3>
              <p className="text-gray-600 leading-relaxed">
                Data-driven insights on seasonal demand (peak Dec-Mar), Ramadan considerations, tourism patterns, and corporate rental trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Media Kit Section */}
      <section id="media-kit" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Media Kit
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Resources for publishers, bloggers, and media professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Brand Assets */}
            <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Brand Assets</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                  <div>
                    <h4 className="font-semibold text-gray-900">Logo Package</h4>
                    <p className="text-sm text-gray-600">PNG, SVG formats - Light & Dark versions</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                    Download
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                  <div>
                    <h4 className="font-semibold text-gray-900">Brand Guidelines</h4>
                    <p className="text-sm text-gray-600">Colors, typography, usage rules</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                    Download
                  </button>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Brand Colors</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="w-full h-12 bg-blue-600 rounded mb-1"></div>
                      <p className="text-xs text-gray-600">#2563eb</p>
                    </div>
                    <div>
                      <div className="w-full h-12 bg-amber-500 rounded mb-1"></div>
                      <p className="text-xs text-gray-600">#f59e0b</p>
                    </div>
                    <div>
                      <div className="w-full h-12 bg-gray-900 rounded mb-1"></div>
                      <p className="text-xs text-gray-600">#1f2937</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Citation & Attribution */}
            <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Citation Guidelines</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Link Format</h4>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                    &lt;a href=&quot;https://rentalfleetuae.com&quot;&gt;Rental Fleet UAE&lt;/a&gt;
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Citation Examples</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700 italic">
                        &quot;According to research by <span className="text-blue-600 underline">Rental Fleet UAE</span>...&quot;
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700 italic">
                        &quot;Data from the <span className="text-blue-600 underline">2026 UAE Rental Market Report</span>...&quot;
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Usage Rights</h4>
                  <p className="text-sm text-gray-600">
                    All resources are free to use with proper attribution. Commercial use permitted with link back to source.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Embeddable Badge */}
          <div className="max-w-4xl mx-auto">
            <BacklinkBadge />
          </div>
        </div>
      </section>

      {/* Statistics Worth Citing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cite-Worthy Statistics
            </h2>
            <p className="text-xl text-gray-600">
              Original research data from our 2026 UAE Rental Market Report
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { stat: '15.2B AED', label: 'UAE Rental Market Size', sublabel: '2026 Projection' },
              { stat: '12.5%', label: 'Annual Growth Rate', sublabel: 'CAGR 2026-2030' },
              { stat: '62%', label: 'Technology Adoption', sublabel: 'Using Fleet Software' },
              { stat: '89%', label: 'Tourist Demand', sublabel: 'International Visitors' }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold text-blue-600 mb-2">{item.stat}</div>
                <div className="text-gray-900 font-semibold mb-1">{item.label}</div>
                <div className="text-sm text-gray-600">{item.sublabel}</div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Source: <Link href="/" className="text-blue-600 hover:underline">Rental Fleet UAE</Link>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/resources"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Download Full Report
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Partners */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Strategic Partners
            </h2>
            <p className="text-xl text-gray-600">
              Collaborating with industry leaders to serve the UAE rental community
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl mr-4">
                  AC
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">AutyCloud</h3>
                  <p className="text-blue-600">Fleet Management Software</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Leading cloud-based fleet management solution designed specifically for UAE rental businesses. Provides real-time inventory tracking, automated booking workflows, and data-driven analytics.
              </p>
              <a
                href={siteConfig.promotedSites.autycloud.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group"
              >
                Explore AutyCloud
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact for Press */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Press & Media Inquiries
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            For interviews, data requests, or collaboration opportunities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              Contact Us
            </Link>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all"
            >
              {siteConfig.contact.email}
            </a>
          </div>
        </div>
      </section>

      {/* Explore Next (Internal Links) */}
      <section className="py-12 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/resources" className="bg-gray-50 border rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-bold text-gray-900 mb-1">Free resources</div>
              <div className="text-sm text-gray-600">Reports, templates, and checklists →</div>
            </Link>
            <Link href="/blog" className="bg-gray-50 border rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-bold text-gray-900 mb-1">Blog</div>
              <div className="text-sm text-gray-600">Guides and insights for UAE rental businesses →</div>
            </Link>
            <Link href="/compare" className="bg-gray-50 border rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-bold text-gray-900 mb-1">Compare vehicles</div>
              <div className="text-sm text-gray-600">Side-by-side comparisons to shortlist faster →</div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
