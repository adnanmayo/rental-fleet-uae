import Link from "next/link";
import { generateMetadata as genMeta } from "@/lib/seo-utils";
import { siteConfig } from "@/lib/site-config";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = genMeta({
  title: "Cookie Policy",
  description: "Cookie Policy for Rental Fleet UAE. Learn what cookies we use and how you can manage your preferences.",
  keywords: ["cookie policy", "cookies", "tracking", "privacy"],
  canonical: `${siteConfig.url}/cookies`,
});

export default function CookiesPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cookies", href: "/cookies" }]} />

      <section className="bg-gradient-to-br from-blue-50 via-white to-amber-50 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">Cookie Policy</h1>
            <p className="text-lg text-gray-700 mb-4">Last Updated: January 30, 2026</p>
            <p className="text-gray-600">
              This page explains what cookies are, how we use them, and how you can control cookie settings.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2>What are cookies?</h2>
            <p>
              Cookies are small text files stored on your device. They help websites work properly, improve user
              experience, and provide analytics.
            </p>

            <h2>How we use cookies</h2>
            <ul>
              <li>
                <strong>Essential cookies</strong> to run the site and keep it secure.
              </li>
              <li>
                <strong>Analytics cookies</strong> to understand traffic and improve content (e.g., which pages are most
                useful).
              </li>
            </ul>

            <h2>Managing cookies</h2>
            <p>
              You can control cookies through your browser settings. Disabling some cookies may impact site
              functionality.
            </p>

            <h2>Related policies</h2>
            <p>
              See our <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms of Service</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/blog" className="bg-white border rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-bold text-gray-900 mb-1">Read guides</div>
              <div className="text-sm text-gray-600">UAE rental insights and best practices →</div>
            </Link>
            <Link href="/resources" className="bg-white border rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-bold text-gray-900 mb-1">Free resources</div>
              <div className="text-sm text-gray-600">Reports, templates, checklists →</div>
            </Link>
            <Link href="/compare" className="bg-white border rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-bold text-gray-900 mb-1">Compare vehicles</div>
              <div className="text-sm text-gray-600">Side-by-side comparisons →</div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

