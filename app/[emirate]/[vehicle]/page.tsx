import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEntityBySlug, getEntitiesByType, getRelatedEntities } from '@/lib/programmatic/entities';
import { generateContent } from '@/lib/programmatic/content-generator';
import { siteConfig } from '@/lib/site-config';
import Breadcrumbs from '@/components/Breadcrumbs';

function stripSiteSuffix(title: string): string {
  // Avoid "X | Rental Fleet UAE | Rental Fleet UAE" when the global layout title template is applied.
  return title.replace(/\s*\|\s*Rental Fleet UAE\s*$/i, '').trim();
}

interface VehiclePageProps {
  params: Promise<{
    emirate: string;
    vehicle: string;
  }>;
}

/**
 * Generate static params for build-time generation
 * Only generates high-priority combinations
 */
export async function generateStaticParams() {
  const emirates = await getEntitiesByType('emirate', {
    minPriority: 8,
    useCache: false
  });

  const vehicles = await getEntitiesByType('vehicle', {
    minPriority: 8,
    useCache: false
  });

  const params = [];

  for (const emirate of emirates) {
    for (const vehicle of vehicles) {
      params.push({
        emirate: emirate.slug,
        vehicle: vehicle.slug,
      });
    }
  }

  return params;
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: VehiclePageProps): Promise<Metadata> {
  const { emirate: emirateSlug, vehicle: vehicleSlug } = await params;
  const [emirate, vehicle] = await Promise.all([
    getEntityBySlug(emirateSlug, 'emirate'),
    getEntityBySlug(vehicleSlug, 'vehicle'),
  ]);

  if (!emirate || !vehicle) {
    return {
      title: 'Page Not Found',
    };
  }

  // Interpolate SEO templates
  const title = stripSiteSuffix(
    vehicle.seo.titleTemplate
      .replace('{name}', vehicle.name)
      .replace('{emirate}', emirate.name)
  );

  const description = vehicle.seo.descriptionTemplate
    .replace('{name}', vehicle.name)
    .replace('{emirate}', emirate.name)
    .replace('{vehicleType}', vehicle.name);

  return {
    title,
    description,
    keywords: [...vehicle.seo.keywords, ...emirate.seo.keywords.slice(0, 3)],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_AE',
      url: `${siteConfig.url}/${emirate.slug}/${vehicle.slug}`,
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/${emirate.slug}/${vehicle.slug}`,
    },
  };
}

/**
 * Configure ISR revalidation
 */
export const revalidate = 3600; // 1 hour for spoke pages

/**
 * Emirate + Vehicle Spoke Page Component
 */
export default async function EmirateVehiclePage({ params }: VehiclePageProps) {
  const { emirate: emirateSlug, vehicle: vehicleSlug } = await params;
  const [emirate, vehicle] = await Promise.all([
    getEntityBySlug(emirateSlug, 'emirate'),
    getEntityBySlug(vehicleSlug, 'vehicle'),
  ]);

  if (!emirate || !vehicle) {
    notFound();
  }

  // Generate content using both entities (used for future narrative sections)
  await generateContent({
    primary: emirate,
    secondary: [vehicle],
    intent: { type: 'tourism' },
    targetWordCount: 1200,
  });

  // Get related vehicles for comparison
  const relatedVehicles = await getRelatedEntities(vehicle, {
    maxResults: 3,
    minWeight: 7,
    types: ['vehicle']
  });

  // Pick a safe compare target (must be different from current vehicle)
  const fallbackCompareCandidates = await getEntitiesByType('vehicle', { limit: 6 });
  const compareTargetSlug =
    relatedVehicles.find((v) => v.slug !== vehicle.slug)?.slug ||
    fallbackCompareCandidates.find((v) => v.slug !== vehicle.slug)?.slug ||
    null;

  // Get available services
  const services = await getEntitiesByType('service', {
    minPriority: 7,
    limit: 3
  });

  const priceFrom = vehicle.metadata.priceRange?.min || 'N/A';
  const priceTo = vehicle.metadata.priceRange?.max || 'N/A';

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: emirate.name, href: `/${emirate.slug}` },
          { label: vehicle.name, href: `/${emirate.slug}/${vehicle.slug}` },
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-blue-500 px-4 py-1 rounded-full text-sm font-medium mb-4">
                {emirate.name}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {vehicle.name} Rental in {emirate.name}
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                {vehicle.content.description}
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                  <div className="text-2xl font-bold">{priceFrom} AED</div>
                  <div className="text-sm text-blue-200">Per Day</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                  <div className="text-2xl font-bold">{vehicle.metadata.seats || 'N/A'}</div>
                  <div className="text-sm text-blue-200">Passengers</div>
                </div>
                {vehicle.metadata.rating && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                    <div className="text-2xl font-bold">{vehicle.metadata.rating}/5</div>
                    <div className="text-sm text-blue-200">Rating</div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`${siteConfig.promotedSites.adnanRentals.url}?utm_source=rentalfleetuae&utm_campaign=${emirate.slug}-${vehicle.slug}`}
                  className="bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
                >
                  Book Now
                </a>
                <Link
                  href="#details"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              {/* Placeholder for vehicle image */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚗</div>
                  <div className="text-lg font-medium">{vehicle.name}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      {vehicle.metadata.features && vehicle.metadata.features.length > 0 && (
        <section className="py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-4 justify-center">
              {vehicle.metadata.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium text-gray-700"
                >
                  ✓ {feature}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section id="details" className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* About Section */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">
                  About {vehicle.name} in {emirate.name}
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p>{vehicle.content.longDescription || vehicle.content.description}</p>
                  <p className="mt-4">
                    Renting a {vehicle.name} in {emirate.name} is perfect for travelers seeking
                    {vehicle.metadata.tags && vehicle.metadata.tags.length > 0
                      ? ` ${vehicle.metadata.tags.slice(0, 3).join(', ')} `
                      : ' comfortable '}
                    transportation. {emirate.name} offers excellent roads and modern infrastructure,
                    making it ideal for exploring in a {vehicle.name}.
                  </p>
                </div>
              </div>

              {/* Benefits */}
              {vehicle.content.benefits && vehicle.content.benefits.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Why Choose a {vehicle.name}?</h2>
                  <div className="space-y-4">
                    {vehicle.content.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-4 bg-blue-50 p-4 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                          {idx + 1}
                        </div>
                        <p className="text-gray-700">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features Detail */}
              {vehicle.content.features && vehicle.content.features.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Vehicle Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicle.content.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Models */}
              {vehicle.metadata.popularModels && vehicle.metadata.popularModels.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Popular Models</h2>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                    <div className="flex flex-wrap gap-3">
                      {vehicle.metadata.popularModels.map((model, idx) => (
                        <div key={idx} className="bg-white px-4 py-2 rounded-lg font-medium text-gray-700">
                          {model}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* FAQs */}
              {vehicle.content.faqs && vehicle.content.faqs.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {vehicle.content.faqs.map((faq, idx) => (
                      <div key={idx} className="bg-white border rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              {/* Booking Card */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 mb-8 sticky top-4">
                <h3 className="text-xl font-bold mb-4">Ready to Book?</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-amber-600 mb-1">
                      {priceFrom} - {priceTo} AED
                    </div>
                    <div className="text-sm text-gray-600">Per Day</div>
                  </div>
                  <a
                    href={`${siteConfig.promotedSites.adnanRentals.url}?utm_source=rentalfleetuae&utm_campaign=${emirate.slug}-${vehicle.slug}`}
                    className="block w-full bg-amber-500 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
                  >
                    Book with Adnan Rentals
                  </a>
                  <a
                    href={`${siteConfig.promotedSites.autycloud.url}?utm_source=rentalfleetuae&utm_campaign=${emirate.slug}-${vehicle.slug}`}
                    className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Manage Fleet with AutyCloud
                  </a>
                </div>
              </div>

              {/* Related Vehicles */}
              {relatedVehicles.length > 0 && (
                <div className="bg-white border rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-bold mb-4">Similar Vehicles</h3>
                  <div className="space-y-4">
                    {relatedVehicles.map((relVehicle) => (
                      <Link
                        key={relVehicle.id}
                        href={`/${emirate.slug}/${relVehicle.slug}`}
                        className="block group"
                      >
                        <div className="font-semibold text-blue-600 group-hover:text-blue-800 mb-1">
                          {relVehicle.name}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {relVehicle.content.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Services */}
              {services.length > 0 && (
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4">Available Services</h3>
                  <div className="space-y-3">
                    {services.map((service) => (
                      <div key={service.id} className="border-l-4 border-blue-500 pl-3">
                        <div className="font-semibold">{service.name}</div>
                        <div className="text-sm text-gray-600">{service.content.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Other Locations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">{vehicle.name} in Other Emirates</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(await getEntitiesByType('emirate', { limit: 7 }))
              .filter(e => e.id !== emirate.id)
              .map((otherEmirate) => (
                <Link
                  key={otherEmirate.id}
                  href={`/${otherEmirate.slug}/${vehicle.slug}`}
                  className="bg-white rounded-lg p-4 text-center hover:shadow-md transition group"
                >
                  <div className="text-2xl mb-2">📍</div>
                  <div className="font-semibold group-hover:text-blue-600">
                    {otherEmirate.name}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Explore More (Internal Links) */}
      <section className="py-12 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-blue-50 to-amber-50 border border-gray-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Explore more</h2>
            <p className="text-gray-700 mb-6">
              Keep researching before you book — compare options, read guides, and use free tools.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {compareTargetSlug ? (
                <Link
                  href={`/compare/${vehicle.slug}/${compareTargetSlug}`}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition"
                >
                  <div className="font-semibold text-gray-900 mb-1">Compare vehicles</div>
                  <div className="text-sm text-gray-600">See a side-by-side breakdown →</div>
                </Link>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="font-semibold text-gray-900 mb-1">Compare vehicles</div>
                  <div className="text-sm text-gray-600">More comparisons coming soon.</div>
                </div>
              )}
              <Link
                href="/blog"
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition"
              >
                <div className="font-semibold text-gray-900 mb-1">Read UAE rental guides</div>
                <div className="text-sm text-gray-600">Pricing, ops, tech, and compliance →</div>
              </Link>
              <Link
                href="/tools"
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition"
              >
                <div className="font-semibold text-gray-900 mb-1">Use free tools</div>
                <div className="text-sm text-gray-600">Calculators, templates, checklists →</div>
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
            '@type': 'Product',
            name: `${vehicle.name} Rental in ${emirate.name}`,
            description: vehicle.content.description,
            offers: {
              '@type': 'Offer',
              price: priceFrom,
              priceCurrency: 'AED',
              availability: 'https://schema.org/InStock',
              // Keep deterministic to satisfy react-hooks/purity lint rule
              priceValidUntil: '2027-12-31',
            },
            aggregateRating: vehicle.metadata.rating ? {
              '@type': 'AggregateRating',
              ratingValue: vehicle.metadata.rating,
              ratingCount: 100,
            } : undefined,
          }),
        }}
      />
    </div>
  );
}
