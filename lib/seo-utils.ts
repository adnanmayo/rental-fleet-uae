// SEO Utilities for rentalfleetuae.com
// Helpers for metadata generation, schema markup, and internal linking

import { Metadata } from 'next';
import { siteConfig, linkBuildingKeywords } from './site-config';

// Generate optimized metadata for pages
export function generateMetadata({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  article = false,
  publishedTime,
  modifiedTime,
  authors = ['Rental Fleet UAE Team']
}: {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  article?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const canonicalUrl = canonical || `${siteConfig.url}`;
  const ogImageUrl = ogImage || `${siteConfig.url}${siteConfig.seo.ogImage.url}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: [...siteConfig.primaryKeywords, ...keywords].join(', '),
    authors: authors.map(name => ({ name })),
    creator: siteConfig.seo.author,
    publisher: siteConfig.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImageUrl,
          width: siteConfig.seo.ogImage.width,
          height: siteConfig.seo.ogImage.height,
          alt: siteConfig.seo.ogImage.alt,
        },
      ],
      locale: 'en_AE',
      type: article ? 'article' : 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImageUrl],
      creator: siteConfig.social.twitter,
    },
  };

  if (article && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      authors: authors,
      tags: keywords,
    };
  }

  return metadata;
}

// Generate Article Schema for blog posts
export function generateArticleSchema({
  title,
  description,
  url,
  imageUrl,
  publishedTime,
  modifiedTime,
  author = 'Rental Fleet UAE Team',
  keywords = []
}: {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: imageUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    keywords: keywords.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

// Generate BreadcrumbList Schema
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Generate FAQPage Schema
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Internal Linking Helper - Automatically add contextual links
export function addInternalLinks(content: string): string {
  let linkedContent = content;

  // Add links to AutyCloud
  linkBuildingKeywords.autycloud.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b(?![^<]*>|[^<>]*</)`, 'gi');
    linkedContent = linkedContent.replace(
      regex,
      match => `<a href="${siteConfig.promotedSites.autycloud.url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${match}</a>`
    );
  });

  // Add links to Adnan Rentals
  linkBuildingKeywords.adnanRentals.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b(?![^<]*>|[^<>]*</)`, 'gi');
    linkedContent = linkedContent.replace(
      regex,
      match => `<a href="${siteConfig.promotedSites.adnanRentals.url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${match}</a>`
    );
  });

  return linkedContent;
}

// Generate SEO-friendly slug
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

// Calculate reading time
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Extract excerpt from content
export function generateExcerpt(content: string, length: number = 160): string {
  const plainText = content.replace(/<[^>]*>/g, '');
  if (plainText.length <= length) return plainText;
  return plainText.substring(0, length).trim() + '...';
}

// SEO-friendly date formatter
export function formatSEODate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

// Generate canonical URL
export function generateCanonicalURL(path: string): string {
  return `${siteConfig.url}${path}`;
}

// Social sharing URLs
export function getSocialShareURLs(url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=Check%20this%20out:%20${encodedUrl}`,
  };
}

// Embed code generator for backlink assets
export function generateEmbedCode(assetUrl: string, title: string): string {
  return `<!-- Embed from Rental Fleet UAE -->
<div class="rentalfleetuae-embed">
  <iframe src="${assetUrl}" width="100%" height="600" frameborder="0"></iframe>
  <p style="font-size:12px;margin-top:8px;">
    Source: <a href="${siteConfig.url}" target="_blank" rel="noopener">Rental Fleet UAE</a>
  </p>
</div>`;
}

// Attribution badge HTML for linkable assets
export function generateAttributionBadge(): string {
  return `<a href="${siteConfig.url}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;padding:8px 12px;background:#f3f4f6;border-radius:6px;text-decoration:none;color:#374151;font-size:14px;">
    <span style="margin-right:8px;">Powered by</span>
    <strong>${siteConfig.name}</strong>
  </a>`;
}

// Outreach email template generator
export function generateOutreachEmail({
  recipientName,
  recipientSite,
  articleUrl,
  articleTitle,
  relevantContent
}: {
  recipientName: string;
  recipientSite: string;
  articleUrl: string;
  articleTitle: string;
  relevantContent: string;
}) {
  return `Subject: Resource for ${recipientSite}: ${articleTitle}

Hi ${recipientName},

I came across your article on "${relevantContent}" at ${recipientSite} and found it incredibly valuable for UAE rental business professionals.

I recently published a comprehensive guide that might complement your content perfectly: "${articleTitle}" (${articleUrl})

This resource includes:
- Original research and data specific to the UAE rental market
- Actionable insights from industry experts
- Free downloadable tools and templates

If you find it valuable, I'd be honored if you'd consider referencing it in your article or sharing it with your audience. I'm also happy to contribute a guest post to ${recipientSite} on topics relevant to your readers.

Looking forward to connecting!

Best regards,
${siteConfig.name} Team
${siteConfig.contact.email}`;
}
