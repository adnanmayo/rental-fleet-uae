import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEntityBySlug, getEntitiesByType } from '@/lib/programmatic/entities';
import { generateContent } from '@/lib/programmatic/content-generator';
import { siteConfig } from '@/lib/site-config';
import Breadcrumbs from '@/components/Breadcrumbs';

function stripSiteSuffix(title: string): string {
  // Avoid "X | Rental Fleet UAE | Rental Fleet UAE" when the global layout title template is applied.
  return title.replace(/\s*\|\s*Rental Fleet UAE\s*$/i, '').trim();
}

interface EmiratePageProps {
  params: Promise<{
    emirate: string;
  }>;
}

/**
 * Generate static params for build-time generation
 * Only generates high-priority emirates at build time
 */
export async function generateStaticParams() {
  const emirates = await getEntitiesByType('emirate', {
    minPriority: 8, // Only Tier 1 pages
    useCache: false
  });

  return emirates.map((emirate) => ({
    emirate: emirate.slug,
  }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: EmiratePageProps): Promise<Metadata> {
  const { emirate: emirateSlug } = await params;
  const emirate = await getEntityBySlug(emirateSlug, 'emirate');

  if (!emirate) {
    return {
      title: 'Emirate Not Found',
    };
  }

  // Interpolate SEO template
  const title = stripSiteSuffix(
    emirate.seo.titleTemplate.replace('{name}', emirate.name)
  );
  const description = emirate.seo.descriptionTemplate.replace('{name}', emirate.name);

  return {
    title,
    description,
    keywords: emirate.seo.keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_AE',
      url: `${siteConfig.url}/${emirate.slug}`,
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/${emirate.slug}`,
    },
  };
}

/**
 * Configure ISR revalidation
 */
export const revalidate = 1800; // 30 minutes for hub pages

/**
 * Emirate Hub Page Component
 */
export default async function EmiratePage({ params }: EmiratePageProps) {
  const { emirate: emirateSlug } = await params;
  const emirate = await getEntityBySlug(emirateSlug, 'emirate');

  if (!emirate) {
    notFound();
  }

  // Generate content using the programmatic content generator
  const generatedContent = await generateContent({
    primary: emirate,
    intent: { type: 'tourism' },
    targetWordCount: 1000,
  });

  // Get related vehicles for this emirate
  const vehicles = await getEntitiesByType('vehicle', {
    minPriority: 6,
    limit: 10
  });

  // Get related services
  const services = await getEntitiesByType('service', {
    minPriority: 6,
    limit: 5
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: emirate.name, href: `/${emirate.slug}` },
        ]}
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {generatedContent.sections[0]?.heading || `Car Rental in ${emirate.name}`}
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              {emirate.content.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#vehicles"
                className="bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
              >
                Browse Vehicles
              </Link>
              <Link
                href="#services"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      {emirate.metadata.stats && (
        <section className="py-12 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {Object.entries(emirate.metadata.stats).map(([key, value]) => (
                <div key={key}>
                  <div className="text-3xl font-bold text-blue-600">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {formatStatKey(key)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Description Section */}
              <div className="prose prose-lg max-w-none mb-12">
                <h2>About {emirate.name}</h2>
                <p>{emirate.content.longDescription || emirate.content.description}</p>
              </div>

              {/* Benefits Section */}
              {emirate.content.benefits && emirate.content.benefits.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Why Rent a Car in {emirate.name}?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {emirate.content.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                          {idx + 1}
                        </div>
                        <p className="text-gray-700">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features Section */}
              {emirate.content.features && emirate.content.features.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Features & Highlights</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {emirate.content.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Quick Links */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-8 sticky top-4">
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <Link href={`${siteConfig.promotedSites.autycloud.url}?utm_source=rentalfleetuae&utm_campaign=${emirate.slug}`}
                    className="block text-blue-600 hover:text-blue-800 font-medium"
                    data-ga-event="cta_click"
                    data-ga-label={`autycloud_emirate_${emirate.slug}`}
                    data-ga-category="outbound">
                    → Fleet Management Software
                  </Link>
                  <Link href="/blog" className="block text-blue-600 hover:text-blue-800 font-medium">
                    → Rental Tips & Guides
                  </Link>
                  <Link href="/compare" className="block text-blue-600 hover:text-blue-800 font-medium">
                    → Compare options
                  </Link>
                </div>
              </div>

              {/* Promoted Sites */}
              <div className="bg-white border rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Recommended Tools</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <a href={siteConfig.promotedSites.autycloud.url}
                      className="font-semibold text-blue-600 hover:text-blue-800"
                      data-ga-event="cta_click"
                      data-ga-label={`autycloud_emirate_card_${emirate.slug}`}
                      data-ga-category="outbound">
                      {siteConfig.promotedSites.autycloud.name}
                    </a>
                    <p className="text-sm text-gray-600 mt-1">
                      {siteConfig.promotedSites.autycloud.description}
                    </p>
                  </div>
                  <div className="border-l-4 border-gray-300 pl-4">
                    <Link
                      href="/resources"
                      className="font-semibold text-gray-800 hover:text-gray-900"
                    >
                      Free templates & resources
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      Checklists, market report, and compliance guides.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Options */}
      <section id="vehicles" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Available Vehicles in {emirate.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/${emirate.slug}/${vehicle.slug}`}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition group"
              >
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600">
                  {vehicle.displayName || vehicle.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {vehicle.content.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    From {vehicle.metadata.priceRange?.min} AED/day
                  </span>
                  <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                    View Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Rental Services in {emirate.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white border rounded-xl p-6 hover:border-blue-300 transition"
              >
                <h3 className="text-xl font-bold mb-2">{service.displayName || service.name}</h3>
                <p className="text-gray-600 mb-4">{service.content.description}</p>
                {service.metadata.features && (
                  <ul className="space-y-2">
                    {service.metadata.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      {emirate.content.faqs && emirate.content.faqs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="max-w-3xl space-y-6">
              {emirate.content.faqs.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Rent in {emirate.name}?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Choose from our wide selection of vehicles and enjoy competitive rates with excellent service.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/blog"
              className="bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
            >
              Read UAE rental guides
            </Link>
            <a
              href={`${siteConfig.promotedSites.autycloud.url}?utm_source=rentalfleetuae&utm_campaign=${emirate.slug}`}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              data-ga-event="cta_click"
              data-ga-label={`autycloud_emirate_cta_${emirate.slug}`}
              data-ga-category="outbound"
            >
              Manage Your Fleet with AutyCloud
            </a>
          </div>
        </div>
      </section>

      {/* Explore More (Internal Links) */}
      <section className="py-12 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-blue-50 to-amber-50 border border-gray-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Explore more in the UAE</h2>
            <p className="text-gray-700 mb-6">
              Jump to practical guides, free resources, and comparisons to plan your trip or optimize your rental choices.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/blog" className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
                <div className="font-semibold text-gray-900 mb-1">Read UAE rental guides</div>
                <div className="text-sm text-gray-600">Best practices and local tips →</div>
              </Link>
              <Link href="/resources" className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
                <div className="font-semibold text-gray-900 mb-1">Free resources</div>
                <div className="text-sm text-gray-600">Checklists, reports, and templates →</div>
              </Link>
              <Link href="/tools" className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
                <div className="font-semibold text-gray-900 mb-1">Tools</div>
                <div className="text-sm text-gray-600">Calculators and planners →</div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Place',
            name: emirate.name,
            description: emirate.content.description,
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'AE',
              addressRegion: emirate.name,
            },
            geo: emirate.metadata.location ? {
              '@type': 'GeoCoordinates',
              latitude: emirate.metadata.location.lat,
              longitude: emirate.metadata.location.lng,
            } : undefined,
          }),
        }}
      />
    </div>
  );
}

/**
 * Helper function to format stat keys
 */
function formatStatKey(key: string): string {
  return key
    .split(/(?=[A-Z])/)
    .join(' ')
    .replace(/^./, (str) => str.toUpperCase());
}
