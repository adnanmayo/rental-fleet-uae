import Link from "next/link";
import { generateMetadata as genMeta } from "@/lib/seo-utils";
import { siteConfig } from "@/lib/site-config";
import { getEntitiesByType } from "@/lib/programmatic/entities";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = genMeta({
  title: "Compare Rental Vehicles in UAE",
  description:
    "Compare popular rental vehicles in the UAE. See pricing ranges, key features, and make a faster decision with side-by-side comparisons.",
  keywords: ["compare rental cars UAE", "vehicle comparison UAE", "car rental comparison Dubai", "SUV vs sedan UAE"],
  canonical: `${siteConfig.url}/compare`,
});

function buildPairs<T>(items: T[], maxPairs: number): Array<[T, T]> {
  const pairs: Array<[T, T]> = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      pairs.push([items[i], items[j]]);
      if (pairs.length >= maxPairs) return pairs;
    }
  }
  return pairs;
}

export default async function CompareIndexPage() {
  const vehicles = await getEntitiesByType("vehicle", { minPriority: 7, limit: 12, useCache: false });
  const pairs = buildPairs(vehicles, 8);

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compare", href: "/compare" }]} />

      <section className="bg-gradient-to-br from-blue-50 via-white to-amber-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Compare vehicles for UAE rentals</h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Shortlist faster with side-by-side comparisons. Start with popular matchups, or browse a few options and
              compare what matters: budget, capacity, and features.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Popular comparisons</h2>
              <p className="text-gray-600 mt-2">Handy starting points based on high-priority vehicles.</p>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-blue-700 hover:text-blue-900">
              Read guides →
            </Link>
          </div>

          {pairs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pairs.map(([a, b]) => (
                <Link
                  key={`${a.slug}-${b.slug}`}
                  href={`/compare/${a.slug}/${b.slug}`}
                  className="group bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition"
                >
                  <div className="text-sm text-gray-500 mb-2">Compare</div>
                  <div className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {a.name} <span className="text-gray-400">vs</span> {b.name}
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    Price: {a.metadata.priceRange?.min ?? "N/A"}–{a.metadata.priceRange?.max ?? "N/A"} AED vs{" "}
                    {b.metadata.priceRange?.min ?? "N/A"}–{b.metadata.priceRange?.max ?? "N/A"} AED
                  </div>
                  <div className="mt-4 inline-flex items-center text-sm font-semibold text-blue-700">
                    View comparison
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-gray-700">
              Comparisons are being generated. Check back soon.
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/resources" className="bg-white border rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-bold text-gray-900 mb-1">Free resources</div>
              <div className="text-sm text-gray-600">Market reports, templates, checklists →</div>
            </Link>
            <Link href="/tools" className="bg-white border rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-bold text-gray-900 mb-1">Tools</div>
              <div className="text-sm text-gray-600">Calculators and planning helpers →</div>
            </Link>
            <Link href="/blog" className="bg-white border rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-bold text-gray-900 mb-1">Read guides</div>
              <div className="text-sm text-gray-600">Ops, pricing, and fleet tech →</div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

