import { Metadata } from 'next';
import Link from 'next/link';
import { generateMetadata } from '@/lib/seo-utils';
import { siteConfig, backlinkAssets } from '@/lib/site-config';
import DownloadButton from '@/components/DownloadButton';
import SocialShare from '@/components/SocialShare';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = generateMetadata({
  title: 'Free Resources for UAE Rental Businesses',
  description: 'Download free templates, guides, infographics, and tools for UAE car rental businesses. Market reports, compliance checklists, pricing calculators, and more.',
  keywords: ['rental business resources', 'free templates UAE', 'fleet management guide', 'rental checklist', 'UAE compliance'],
  canonical: '/resources'
});

export default function ResourcesPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Resources', href: '/resources' }]} />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-amber-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-amber-200 text-amber-900 rounded-full text-sm font-semibold mb-6">
            100% FREE RESOURCES
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            UAE Rental Business Resources
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Comprehensive collection of templates, guides, and tools to optimize your rental operations and grow your business
          </p>
          <SocialShare
            url={`${siteConfig.url}/resources`}
            title="Free Resources for UAE Rental Businesses"
            className="justify-center"
          />
        </div>
      </section>

      {/* Featured Resource - Market Report */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 md:p-12 text-white">
                <div className="inline-block px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-bold mb-4">
                  MOST POPULAR
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  2026 UAE Rental Market Report
                </h2>
                <p className="text-blue-100 mb-6 leading-relaxed">
                  Our flagship 50-page comprehensive analysis of the UAE rental industry. Packed with original research, market data, growth projections, and actionable insights.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Market size and growth projections (2026-2030)',
                    'Customer behavior and demand patterns',
                    'Technology adoption trends',
                    'Regulatory compliance checklist',
                    'Revenue optimization strategies',
                    'Competitive landscape analysis'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-amber-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-blue-50">{item}</span>
                    </li>
                  ))}
                </ul>
                <DownloadButton
                  title="Download Free Report"
                  file="uae-rental-market-report-2026.pdf"
                  description="50-page PDF • 12.5 MB"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                />
              </div>
              <div className="bg-white p-8 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-48 h-48 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 font-medium">Report Preview</p>
                  <p className="text-sm text-gray-500 mt-2">1,500+ downloads</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates & Checklists */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Templates & Checklists
            </h2>
            <p className="text-xl text-gray-600">
              Ready-to-use templates to streamline your rental operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {backlinkAssets.downloads.map((download, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{download.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{download.description}</p>
                <div className="flex items-center justify-between">
                  <DownloadButton
                    title="Download"
                    file={download.file}
                    className="text-sm px-4 py-2"
                  />
                  <button
                    className="text-gray-400 hover:text-gray-600 transition"
                    title="Share"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infographics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Infographics
            </h2>
            <p className="text-xl text-gray-600">
              Visual data insights - free to embed and share with attribution
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {backlinkAssets.infographics.map((infographic, index) => (
              <div key={index} className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                <div className="h-64 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <svg className="w-32 h-32 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{infographic.title}</h3>
                  <p className="text-gray-600 mb-4">{infographic.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {infographic.keywords.map((keyword, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                      View Full Size
                    </button>
                    <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition text-sm font-medium">
                      Embed Code
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UAE Rental Regulations Library */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              UAE Rental Regulations Library
            </h2>
            <p className="text-xl text-gray-600">
              Stay compliant with the latest UAE rental regulations by emirate
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                emirate: 'Dubai',
                authority: 'RTA Dubai',
                topics: ['Vehicle registration', 'Salik toll system', 'Fines & blacklisting', 'Insurance requirements']
              },
              {
                emirate: 'Abu Dhabi',
                authority: 'Abu Dhabi Municipality',
                topics: ['Darb toll system', 'Parking regulations', 'Safety standards', 'License requirements']
              },
              {
                emirate: 'Sharjah',
                authority: 'Sharjah Transport',
                topics: ['Traffic regulations', 'Business licensing', 'Vehicle standards', 'Rental permits']
              }
            ].map((reg, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{reg.emirate}</h3>
                    <p className="text-sm text-gray-600">{reg.authority}</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  {reg.topics.map((topic, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-700">
                      <svg className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {topic}
                    </li>
                  ))}
                </ul>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                  View Full Guide
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Tools Teaser */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-50 to-blue-50 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Interactive Tools & Calculators
                </h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Use our free online tools to optimize your rental business operations, calculate ROI, and make data-driven decisions.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    'ROI Calculator for fleet software',
                    'Fleet size optimizer',
                    'Dynamic pricing calculator',
                    'Maintenance cost estimator'
                  ].map((tool, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {tool}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/tools"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
                >
                  Explore All Tools
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center">
                  <svg className="w-32 h-32 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600 font-medium">Interactive Calculator Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Software */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recommended Solutions
            </h2>
            <p className="text-xl text-gray-600">
              Partner technologies that enhance rental business operations
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-3">AutyCloud</h3>
              <p className="text-blue-100 mb-6 leading-relaxed">
                Transform your rental operations with cloud-based fleet management. Real-time tracking, automated workflows, and powerful analytics designed for UAE businesses.
              </p>
              <ul className="space-y-2 mb-6">
                {['Real-time inventory management', 'Automated booking system', 'Maintenance scheduling', 'Financial reporting'].map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-amber-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={siteConfig.promotedSites.autycloud.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Explore AutyCloud
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Newsletter */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Get New Resources First
          </h2>
          <p className="text-gray-600 mb-8">
            Subscribe to receive new templates, guides, and industry insights directly to your inbox
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4">
            No spam. Unsubscribe anytime. See our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </section>

      {/* Explore Next (Internal Links) */}
      <section className="py-12 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/blog" className="bg-gray-50 border rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-bold text-gray-900 mb-1">Read guides</div>
              <div className="text-sm text-gray-600">Practical advice for UAE rental operators →</div>
            </Link>
            <Link href="/compare" className="bg-gray-50 border rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-bold text-gray-900 mb-1">Compare vehicles</div>
              <div className="text-sm text-gray-600">Shortlist faster with side-by-side comparisons →</div>
            </Link>
            <Link href="/tools" className="bg-gray-50 border rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-bold text-gray-900 mb-1">Use free tools</div>
              <div className="text-sm text-gray-600">Calculators, templates, and planning helpers →</div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
