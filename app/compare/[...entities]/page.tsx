import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEntityBySlug, getEntitiesByType } from '@/lib/programmatic/entities';
import { siteConfig } from '@/lib/site-config';
import Breadcrumbs from '@/components/Breadcrumbs';

function stripSiteSuffix(title: string): string {
  // Avoid "X | Rental Fleet UAE | Rental Fleet UAE" when the global layout title template is applied.
  return title.replace(/\s*\|\s*Rental Fleet UAE\s*$/i, '').trim();
}

interface ComparePageProps {
  params: Promise<{
    entities: string[];
  }>;
}

/**
 * Generate static params for build-time generation
 * Only generates popular vehicle comparisons
 */
export async function generateStaticParams() {
  const vehicles = await getEntitiesByType('vehicle', {
    minPriority: 8,
    useCache: false
  });

  const params = [];

  // Generate two-way comparisons for high-priority vehicles
  for (let i = 0; i < vehicles.length; i++) {
    for (let j = i + 1; j < vehicles.length; j++) {
      if (params.length < 50) { // Limit to 50 most important comparisons
        params.push({
          entities: [vehicles[i].slug, vehicles[j].slug],
        });
      }
    }
  }

  return params;
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { entities: entitySlugs } = await params;

  if (!entitySlugs || entitySlugs.length < 2) {
    return {
      title: 'Compare Vehicles',
    };
  }

  const entities = await Promise.all(
    entitySlugs.map(slug => getEntityBySlug(slug, 'vehicle'))
  );

  const validEntities = entities.filter(e => e !== null);

  if (validEntities.length < 2) {
    return {
      title: 'Compare Vehicles',
    };
  }

  const entityNames = validEntities.map(e => e!.name).join(' vs ');
  const title = stripSiteSuffix(`Compare ${entityNames} | Rental Fleet UAE`);
  const description = `Detailed comparison of ${entityNames} for car rental in UAE. Compare prices, features, and specifications to make the best choice.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_AE',
      url: `${siteConfig.url}/compare/${entitySlugs.join('/')}`,
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/compare/${entitySlugs.join('/')}`,
    },
  };
}

/**
 * Configure ISR revalidation
 */
export const revalidate = 7200; // 2 hours for comparison pages

/**
 * Comparison Page Component
 */
export default async function ComparePage({ params }: ComparePageProps) {
  const { entities: entitySlugs } = await params;

  if (!entitySlugs || entitySlugs.length < 2 || entitySlugs.length > 3) {
    notFound();
  }

  // Load entities (assuming vehicles for now)
  const entities = await Promise.all(
    entitySlugs.map(slug => getEntityBySlug(slug, 'vehicle'))
  );

  const validEntities = entities.filter(e => e !== null);

  if (validEntities.length < 2) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Compare', href: '/compare' },
          { label: validEntities.map(e => e!.name).join(' vs '), href: `/compare/${entitySlugs.join('/')}` },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            {validEntities.map(e => e!.name).join(' vs ')}
          </h1>
          <p className="text-xl text-blue-100 text-center max-w-3xl mx-auto">
            Compare features, prices, and specifications to find the perfect rental vehicle for your needs in UAE.
          </p>
        </div>
      </section>

      {/* Quick Comparison Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {validEntities.map((entity) => (
              <div key={entity!.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                  <h2 className="text-2xl font-bold mb-2">{entity!.name}</h2>
                  <p className="text-blue-100">{entity!.displayName || entity!.name}</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Price Range</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {entity!.metadata.priceRange?.min || 'N/A'} - {entity!.metadata.priceRange?.max || 'N/A'} AED
                      </div>
                      <div className="text-sm text-gray-600">Per Day</div>
                    </div>
                    {entity!.metadata.seats && (
                      <div>
                        <div className="text-sm text-gray-500">Capacity</div>
                        <div className="text-lg font-semibold">{entity!.metadata.seats} Passengers</div>
                      </div>
                    )}
                    {entity!.metadata.rating && (
                      <div>
                        <div className="text-sm text-gray-500">Rating</div>
                        <div className="text-lg font-semibold">{entity!.metadata.rating}/5 ⭐</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Comparison Table */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Detailed Comparison</h2>

          {/* Price Comparison */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">💰 Pricing</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Feature</th>
                    {validEntities.map(entity => (
                      <th key={entity!.id} className="text-center py-4 px-4 font-semibold text-gray-700">
                        {entity!.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Starting Price</td>
                    {validEntities.map(entity => (
                      <td key={entity!.id} className="py-4 px-4 text-center">
                        <span className="text-xl font-bold text-blue-600">
                          {entity!.metadata.priceRange?.min || 'N/A'} AED
                        </span>
                        <div className="text-sm text-gray-500">per day</div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="py-4 px-4 font-medium">Maximum Price</td>
                    {validEntities.map(entity => (
                      <td key={entity!.id} className="py-4 px-4 text-center">
                        {entity!.metadata.priceRange?.max || 'N/A'} AED
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Features Comparison */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">🚗 Features</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Feature</th>
                    {validEntities.map(entity => (
                      <th key={entity!.id} className="text-center py-4 px-4 font-semibold text-gray-700">
                        {entity!.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Passenger Capacity</td>
                    {validEntities.map(entity => (
                      <td key={entity!.id} className="py-4 px-4 text-center">
                        {entity!.metadata.seats || 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="py-4 px-4 font-medium">Rating</td>
                    {validEntities.map(entity => (
                      <td key={entity!.id} className="py-4 px-4 text-center">
                        {entity!.metadata.rating ? `${entity!.metadata.rating}/5 ⭐` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  {validEntities[0]!.metadata.fuelEfficiency && (
                    <tr className="border-b">
                      <td className="py-4 px-4 font-medium">Fuel Efficiency</td>
                      {validEntities.map(entity => (
                        <td key={entity!.id} className="py-4 px-4 text-center">
                          {entity!.metadata.fuelEfficiency || 'N/A'}
                        </td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Feature Lists */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">✨ Included Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {validEntities.map(entity => (
                <div key={entity!.id} className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-4">{entity!.name}</h4>
                  {entity!.metadata.features && entity!.metadata.features.length > 0 ? (
                    <ul className="space-y-2">
                      {entity!.metadata.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No features listed</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Comparison */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">🎯 Key Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {validEntities.map(entity => (
                <div key={entity!.id} className="bg-blue-50 rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-4">{entity!.name}</h4>
                  {entity!.content.benefits && entity!.content.benefits.length > 0 ? (
                    <ul className="space-y-3">
                      {entity!.content.benefits.slice(0, 5).map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold mt-1">{idx + 1}.</span>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No benefits listed</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description Comparison */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">📋 Overview</h3>
            <div className="grid grid-cols-1 gap-6">
              {validEntities.map(entity => (
                <div key={entity!.id} className="bg-white border rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-3">{entity!.name}</h4>
                  <p className="text-gray-700">{entity!.content.description}</p>
                  {entity!.content.longDescription && (
                    <p className="text-gray-600 mt-4">{entity!.content.longDescription}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Winner Card (Recommendation) */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Which One Should You Choose?</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-blue-100 mb-8">
              All options are excellent choices. Your decision should be based on:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl mb-3">💰</div>
                <div className="font-bold mb-2">Budget</div>
                <div className="text-sm text-blue-100">Compare daily rates and long-term rental discounts</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
                <div className="font-bold mb-2">Group Size</div>
                <div className="text-sm text-blue-100">Consider passenger capacity and luggage space</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl mb-3">🎯</div>
                <div className="font-bold mb-2">Purpose</div>
                <div className="text-sm text-blue-100">Choose based on your specific travel needs</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href={`${siteConfig.promotedSites.adnanRentals.url}?utm_source=rentalfleetuae&utm_campaign=compare`}
                className="bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
              >
                Book Now with Adnan Rentals
              </a>
              <a
                href={`${siteConfig.promotedSites.autycloud.url}?utm_source=rentalfleetuae&utm_campaign=compare`}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Manage Your Fleet
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* More Comparisons */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">More Comparisons</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(await getEntitiesByType('vehicle', { limit: 8 }))
              .filter(v => !validEntities.some(e => e!.id === v.id))
              .slice(0, 4)
              .map(vehicle => (
                <Link
                  key={vehicle.id}
                  href={`/compare/${validEntities[0]!.slug}/${vehicle.slug}`}
                  className="bg-white border rounded-lg p-4 text-center hover:shadow-md transition group"
                >
                  <div className="font-semibold group-hover:text-blue-600 mb-2">
                    {validEntities[0]!.name} vs {vehicle.name}
                  </div>
                  <div className="text-sm text-gray-600">Compare →</div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/blog" className="bg-gray-50 border rounded-xl p-6 hover:shadow-md transition">
              <div className="font-bold text-gray-900 mb-1">Read UAE rental guides</div>
              <div className="text-sm text-gray-600">Fleet ops, pricing, tech, and compliance →</div>
            </Link>
            <Link href="/resources" className="bg-gray-50 border rounded-xl p-6 hover:shadow-md transition">
              <div className="font-bold text-gray-900 mb-1">Download free resources</div>
              <div className="text-sm text-gray-600">Checklists, reports, and templates →</div>
            </Link>
            <Link href="/tools" className="bg-gray-50 border rounded-xl p-6 hover:shadow-md transition">
              <div className="font-bold text-gray-900 mb-1">Use free tools</div>
              <div className="text-sm text-gray-600">Calculators and planning helpers →</div>
            </Link>
          </div>
        </div>
      </section>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: `Compare ${validEntities.map(e => e!.name).join(' vs ')}`,
            description: `Detailed comparison of ${validEntities.map(e => e!.name).join(', ')} for car rental in UAE`,
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: validEntities.map((entity, idx) => ({
                '@type': 'ListItem',
                position: idx + 1,
                item: {
                  '@type': 'Product',
                  name: entity!.name,
                  description: entity!.content.description,
                },
              })),
            },
          }),
        }}
      />
    </div>
  );
}
