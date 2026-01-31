import { Metadata } from "next";
import Link from "next/link";
import { generateMetadata as genMeta } from "@/lib/seo-utils";
import { siteConfig } from "@/lib/site-config";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = genMeta({
  title: "Fleet Management Guide - UAE Rental Business",
  description:
    "A practical fleet management guide for UAE rental operators. Operations, software, maintenance, and optimization for Dubai, Abu Dhabi, and Sharjah.",
  keywords: [
    "fleet management guide",
    "UAE rental operations",
    "fleet optimization UAE",
    "car rental fleet management",
    "rental business operations",
  ],
  canonical: `${siteConfig.url}/resources/fleet-management`,
});

export default function FleetManagementGuidePage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Fleet Management Guide", href: "/resources/fleet-management" },
        ]}
      />
      <section className="bg-gradient-to-br from-blue-50 via-white to-amber-50 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Fleet Management Guide
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Practical operations, software, and optimization for UAE rental fleets in Dubai, Abu Dhabi, and Sharjah.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What good fleet management looks like in the UAE
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Whether you run 20 cars or 200, the same basics apply: clear availability, clean contracts, deposits and refunds you can prove, and maintenance that doesn’t surprise you. In the UAE, add Salik and fines handling, Arabic/English support, and multi-location controls—then you’re in the game.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
              Core areas to get right
            </h2>
            <ul className="space-y-3 text-gray-700 mb-8">
              <li>
                <strong>Reservations & availability</strong> — Buffers for cleaning, delivery, and late returns so you don’t overbook.
              </li>
              <li>
                <strong>Contracts & audit trail</strong> — Who changed what, when. Disputes drop when you have proof.
              </li>
              <li>
                <strong>Deposits & payments</strong> — Payment links, clear refund workflow, and a visible ledger. See our{" "}
                <Link href="/blog/car-rental-payment-integration-uae-2026" className="text-blue-600 hover:underline">
                  car rental payment integration
                </Link>{" "}
                guide.
              </li>
              <li>
                <strong>Handovers</strong> — Mobile check-in/out with photos and signatures. See{" "}
                <Link href="/blog/contactless-car-rental-software-dubai-2026" className="text-blue-600 hover:underline">
                  contactless car rental software
                </Link>{" "}
                for workflows.
              </li>
              <li>
                <strong>Salik & fines</strong> — Daily import, assign to contract, notify customer. Official refs:{" "}
                <a href="https://www.salik.ae/" target="_blank" rel="nofollow noopener noreferrer" className="text-blue-600 hover:underline">
                  Salik
                </a>
                ,{" "}
                <a href="https://www.rta.ae/" target="_blank" rel="nofollow noopener noreferrer" className="text-blue-600 hover:underline">
                  RTA Dubai
                </a>
                .
              </li>
              <li>
                <strong>Maintenance</strong> — Preventive scheduling that blocks bookings. See{" "}
                <Link href="/blog/preventive-maintenance-car-rental-software-uae-2026" className="text-blue-600 hover:underline">
                  preventive maintenance
                </Link>{" "}
                for UAE.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
              Choosing software
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Start with a shortlist that fits UAE ops: mobile handovers, toll/fines workflow, multi-location, and clean invoicing. Use our{" "}
              <Link href="/blog/best-car-rental-software-uae-2026" className="text-blue-600 hover:underline">
                best car rental software UAE 2026
              </Link>{" "}
              guide and run the 7-day reality test before you sign. For a cloud-first option, compare{" "}
              <a href={siteConfig.promotedSites.autycloud.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" data-ga-event="cta_click" data-ga-label="autycloud_fleet_management" data-ga-category="outbound">
                AutyCloud
              </a>{" "}
              features and demo.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
              Next steps
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              Pull it together with a weekly cadence: utilization, idle days, fines pending, and pricing rules. For KPIs and reporting, see our{" "}
              <Link href="/blog/car-rental-analytics-software-uae-2026-kpis" className="text-blue-600 hover:underline">
                car rental analytics
              </Link>{" "}
              and{" "}
              <Link href="/blog/rental-fleet-optimization-software-uae-2026" className="text-blue-600 hover:underline">
                fleet optimization
              </Link>{" "}
              guides.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-12">
            <Link
              href="/resources"
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition"
            >
              All resources
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Blog & guides
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
