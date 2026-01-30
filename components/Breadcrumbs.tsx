 "use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

function toAbsoluteUrl(href: string): string {
  try {
    return new URL(href, siteConfig.url).toString();
  } catch {
    return href;
  }
}

export default function Breadcrumbs({
  items,
  variant = "bar",
  className = "",
}: {
  items: BreadcrumbItem[];
  variant?: "bar" | "inline";
  className?: string;
}) {
  const normalized = items.filter((i) => i.label && i.label.trim().length > 0);
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: normalized.map((crumb, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: crumb.label,
      ...(crumb.href ? { item: toAbsoluteUrl(crumb.href) } : {}),
    })),
  };

  const inner = (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        {normalized.map((crumb, idx) => {
          const isLast = idx === normalized.length - 1;
          return (
            <li key={`${crumb.label}-${idx}`} className="flex items-center">
              {idx > 0 ? <span className="mx-2 text-gray-300">/</span> : null}
              {crumb.href && !isLast ? (
                <Link href={crumb.href} className="text-blue-600 hover:text-blue-800">
                  {crumb.label}
                </Link>
              ) : (
                <span className={isLast ? "text-gray-700" : "text-gray-600"}>{crumb.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {variant === "bar" ? (
        <div className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 py-4">{inner}</div>
        </div>
      ) : (
        inner
      )}
    </>
  );
}

