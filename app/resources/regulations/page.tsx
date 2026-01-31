import { Metadata } from "next";
import Link from "next/link";
import { generateMetadata as genMeta } from "@/lib/seo-utils";
import { siteConfig } from "@/lib/site-config";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = genMeta({
  title: "UAE Regulations - Rental & Fleet Compliance",
  description:
    "UAE rental and fleet regulations by emirate: Dubai RTA, Salik, Abu Dhabi, Sharjah. Compliance, licensing, tolls, fines, and official sources for rental businesses.",
  keywords: [
    "UAE rental regulations",
    "Dubai RTA",
    "Salik",
    "Abu Dhabi rental rules",
    "Sharjah transport",
    "rental business compliance UAE",
  ],
  canonical: `${siteConfig.url}/resources/regulations`,
});

export default function UAERegulationsPage() {
  const emirates = [
    {
      name: "Dubai",
      authority: "RTA Dubai",
      href: "https://www.rta.ae",
      topics: [
        "Vehicle registration and renewal",
        "Salik toll system and tag requirements",
        "Traffic fines and blacklisting",
        "Insurance and rental permit requirements",
        "Parking and mobility rules",
      ],
    },
    {
      name: "Abu Dhabi",
      authority: "Abu Dhabi authorities",
      href: "https://www.add.gov.ae",
      topics: [
        "Darb toll system",
        "Parking and traffic regulations",
        "Vehicle and business licensing",
        "Safety and inspection standards",
      ],
    },
    {
      name: "Sharjah",
      authority: "Sharjah Transport / Municipality",
      href: "https://www.sharjah.ae",
      topics: [
        "Traffic and transport regulations",
        "Business and rental licensing",
        "Vehicle standards and permits",
      ],
    },
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "UAE Regulations", href: "/resources/regulations" },
        ]}
      />
      <section className="bg-gradient-to-br from-blue-50 via-white to-amber-50 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            UAE Regulations for Rental & Fleet
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Official sources and compliance topics by emirate for rental businesses in the UAE.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-700 leading-relaxed mb-10">
            Regulations vary by emirate. Always confirm with the relevant authority and your legal advisor. This page points you to official sources and key topics—not legal advice.
          </p>

          <div className="space-y-12">
            {emirates.map((emirate) => (
              <div key={emirate.name} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{emirate.name}</h2>
                  <a
                    href={emirate.href}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                  >
                    Official site
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                <p className="text-gray-600 text-sm mb-4">{emirate.authority}</p>
                <ul className="space-y-2 text-gray-700">
                  {emirate.topics.map((topic) => (
                    <li key={topic} className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Tolls & fines (all Emirates)</h3>
            <p className="text-gray-700 mb-4">
              Salik (Dubai) and Darb (Abu Dhabi) post charges with a delay. Assign tolls and fines to the correct contract and notify customers promptly—see our{" "}
              <Link href="/blog/salik-fines-reconciliation-uae-2026-rental-fleets" className="text-blue-600 hover:underline">
                Salik + fines workflow
              </Link>{" "}
              guide. Official:{" "}
              <a href="https://www.salik.ae/" target="_blank" rel="nofollow noopener noreferrer" className="text-blue-600 hover:underline">
                Salik.ae
              </a>
              ,{" "}
              <a href="https://www.rta.ae/" target="_blank" rel="nofollow noopener noreferrer" className="text-blue-600 hover:underline">
                RTA.ae
              </a>
              .
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
