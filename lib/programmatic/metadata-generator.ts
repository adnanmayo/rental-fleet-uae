/**
 * Advanced Metadata Generation System
 *
 * Generates SEO-optimized metadata including titles, descriptions,
 * Open Graph tags, Twitter cards, and canonical URLs for programmatic pages.
 *
 * @module lib/programmatic/metadata-generator
 * @version 2.0
 */

import type { Metadata } from 'next';
import type {
  ProgrammaticEntity,
  GenerationContext,
  GeneratedSEO,
  UserIntent,
} from './types';
import { interpolate } from './content-generator';

// ============================================================================
// Configuration
// ============================================================================

const SITE_CONFIG = {
  name: 'Rental Fleet UAE',
  url: 'https://rental-fleet-uae.com',
  description: 'Premium car rental services across the UAE',
  locale: 'en_AE',
  twitter: '@rentalfleetuae',
};

/**
 * Title templates with variations to prevent duplication
 */
const TITLE_TEMPLATES = {
  'emirate-hub': [
    'Car Rental in {location} | Rent a Car {location} | {siteName}',
    '{location} Car Rental - Best Rates & Service | {siteName}',
    'Rent a Car in {location} - Premium Fleet | {siteName}',
  ],
  'vehicle-hub': [
    '{vehicleType} Rental UAE | Rent {vehicleType} | {siteName}',
    'Rent a {vehicleType} in UAE - Best Deals | {siteName}',
    '{vehicleType} Car Rental - UAE Wide Service | {siteName}',
  ],
  'emirate-vehicle': [
    '{vehicleType} Rental in {location} | From AED {price}/Day',
    'Rent a {vehicleType} in {location} - {siteName}',
    '{location} {vehicleType} Rental - Best Prices & Service',
  ],
  'emirate-vehicle-intent': [
    '{vehicleType} Rental in {location} for {intent} | {siteName}',
    '{intent} {vehicleType} Rental {location} - Premium Service',
    'Rent {vehicleType} for {intent} in {location} | {siteName}',
  ],
  comparison: [
    'Compare {entity1} vs {entity2} | Car Rental Guide',
    '{entity1} vs {entity2} - Which is Better? | {siteName}',
    'Car Rental Comparison: {entity1} vs {entity2}',
  ],
};

/**
 * Description templates with variations
 */
const DESCRIPTION_TEMPLATES = {
  'emirate-hub': [
    'Rent a car in {location} with {siteName}. Choose from our premium fleet of vehicles starting at AED {price}/day. Free delivery, 24/7 support, and best rates guaranteed.',
    'Looking for car rental in {location}? {siteName} offers the best vehicles at competitive prices. Book now and enjoy free delivery across {location}.',
    'Premium car rental services in {location}. Wide selection of vehicles, flexible rental periods, and excellent customer service. Starting from AED {price} per day.',
  ],
  'vehicle-hub': [
    'Rent a {vehicleType} across UAE with {siteName}. Premium {vehicleType} rentals with comprehensive insurance, 24/7 support, and flexible terms. Book your {vehicleType} today.',
    '{vehicleType} rental made easy. Choose from our well-maintained fleet of {vehicleType}s. Competitive rates, free delivery, and excellent service across UAE.',
    'Find the perfect {vehicleType} rental in UAE. {siteName} offers a wide range of {vehicleType}s for all budgets. Book online and get instant confirmation.',
  ],
  'emirate-vehicle': [
    'Rent a {vehicleType} in {location} from AED {price}/day. {siteName} offers premium {vehicleType} rentals with free delivery, comprehensive insurance, and 24/7 support.',
    'Looking for {vehicleType} rental in {location}? Get the best deals starting at AED {price}/day. Flexible rental periods and excellent customer service.',
    '{location} {vehicleType} rental with {siteName}. Choose from our fleet of well-maintained {vehicleType}s. Free delivery and pickup across {location}.',
  ],
  'emirate-vehicle-intent': [
    '{vehicleType} rental in {location} perfect for {intent}. From AED {price}/day with free delivery, insurance included. Book your {intent} {vehicleType} today.',
    'Need a {vehicleType} for {intent} in {location}? {siteName} offers tailored solutions starting at AED {price}/day. Premium service guaranteed.',
    'Rent a {vehicleType} in {location} for {intent}. Competitive rates, flexible terms, and vehicles designed for {intent} use. Book now from AED {price}/day.',
  ],
  comparison: [
    'Compare {entity1} vs {entity2} for car rental. Detailed comparison of features, pricing, availability, and customer reviews to help you choose the best option.',
    'Choosing between {entity1} and {entity2}? Our comprehensive comparison guide covers pricing, features, and benefits to help you make the right decision.',
    '{entity1} vs {entity2}: Which car rental option is better for you? Compare prices, features, and customer satisfaction in our detailed guide.',
  ],
};

// ============================================================================
// Metadata Generation
// ============================================================================

/**
 * Generate complete metadata for a programmatic page
 *
 * @example
 * ```typescript
 * const metadata = generateMetadata({
 *   primary: dubaiEntity,
 *   secondary: [luxuryCarEntity],
 *   intent: { type: 'business' },
 *   template: businessTemplate
 * });
 * ```
 */
export function generateMetadata(context: GenerationContext): Metadata {
  const { primary, secondary, intent } = context;

  // Determine page type
  const pageType = determinePageType(primary, secondary, intent);

  // Build interpolation data
  const data = buildMetadataContext(primary, secondary, intent);

  // Generate title
  const title = generateTitle(pageType, data);

  // Generate description
  const description = generateDescription(pageType, data);

  // Generate keywords
  const keywords = generateKeywords(primary, secondary, intent);

  // Generate canonical URL
  const canonical = generateCanonicalURL(primary, secondary, intent);

  // Generate Open Graph metadata
  const openGraph = generateOpenGraph(title, description, canonical, primary);

  // Generate Twitter metadata
  const twitter = generateTwitterCard(title, description);

  // Robots configuration
  const robots = generateRobots(primary);

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    robots,
    openGraph,
    twitter,
    alternates: {
      canonical,
    },
    other: {
      'article:publisher': SITE_CONFIG.url,
    },
  };
}

/**
 * Generate SEO elements for JSON consumption
 */
export function generateSEOElements(context: GenerationContext): GeneratedSEO {
  const { primary, secondary, intent } = context;

  const pageType = determinePageType(primary, secondary, intent);
  const data = buildMetadataContext(primary, secondary, intent);

  const title = generateTitle(pageType, data);
  const description = generateDescription(pageType, data);
  const keywords = generateKeywords(primary, secondary, intent);
  const canonical = generateCanonicalURL(primary, secondary, intent);

  return {
    title,
    description,
    keywords,
    canonical,
    schema: [], // Populated by schema-builder
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: SITE_CONFIG.twitter,
    },
  };
}

// ============================================================================
// Page Type Detection
// ============================================================================

/**
 * Determine page type from entities and intent
 */
function determinePageType(
  primary: ProgrammaticEntity,
  secondary: ProgrammaticEntity[] | undefined,
  intent: UserIntent | undefined
): string {
  // Comparison page
  if (secondary && secondary.length > 1) {
    return 'comparison';
  }

  // Hub pages (single entity)
  if (!secondary || secondary.length === 0) {
    return `${primary.type}-hub`;
  }

  // Spoke pages with intent
  if (intent && secondary.length === 1) {
    return `${primary.type}-${secondary[0].type}-intent`;
  }

  // Basic spoke pages
  if (secondary.length === 1) {
    return `${primary.type}-${secondary[0].type}`;
  }

  return 'default';
}

// ============================================================================
// Context Building
// ============================================================================

/**
 * Build metadata interpolation context
 */
function buildMetadataContext(
  primary: ProgrammaticEntity,
  secondary: ProgrammaticEntity[] | undefined,
  intent: UserIntent | undefined
): Record<string, string> {
  const context: Record<string, string> = {
    siteName: SITE_CONFIG.name,
    location: primary.name,
    locationSlug: primary.slug,
  };

  // Add vehicle information
  if (primary.type === 'vehicle') {
    context.vehicleType = primary.name;
    context.vehicleSlug = primary.slug;
  } else if (secondary && secondary[0]?.type === 'vehicle') {
    context.vehicleType = secondary[0].name;
    context.vehicleSlug = secondary[0].slug;
  }

  // Add price information
  const priceEntity = secondary?.[0] || primary;
  if (priceEntity.metadata.price?.from) {
    context.price = priceEntity.metadata.price.from.toString();
  } else {
    context.price = '150'; // Default fallback
  }

  // Add intent
  if (intent) {
    context.intent = formatIntent(intent.type);
  }

  // For comparisons
  if (secondary && secondary.length > 1) {
    context.entity1 = primary.name;
    context.entity2 = secondary[0].name;
  }

  return context;
}

/**
 * Format intent for display
 */
function formatIntent(intent: string): string {
  const intentMap: Record<string, string> = {
    business: 'Business',
    tourism: 'Tourism',
    family: 'Family',
    wedding: 'Wedding',
    corporate: 'Corporate',
    luxury: 'Luxury',
    budget: 'Budget',
    'long-term': 'Long-Term',
    airport: 'Airport Transfer',
    chauffeur: 'Chauffeur Service',
  };

  return intentMap[intent] || intent;
}

// ============================================================================
// Title Generation
// ============================================================================

/**
 * Generate SEO-optimized title
 */
function generateTitle(pageType: string, data: Record<string, string>): string {
  const templates = TITLE_TEMPLATES[pageType as keyof typeof TITLE_TEMPLATES];

  if (!templates) {
    return `${data.location || data.vehicleType || 'Car Rental'} | ${SITE_CONFIG.name}`;
  }

  // Use entity hash for consistent template selection
  const hash = hashString(data.locationSlug || data.vehicleSlug || '');
  const templateIndex = hash % templates.length;
  const template = templates[templateIndex];

  const title = interpolate(template, data);

  // Ensure title is within 60 characters (SEO best practice)
  if (title.length > 60) {
    const parts = title.split('|');
    if (parts.length > 1) {
      return `${parts[0].trim()} | ${SITE_CONFIG.name}`.substring(0, 60);
    }
    return title.substring(0, 57) + '...';
  }

  return title;
}

// ============================================================================
// Description Generation
// ============================================================================

/**
 * Generate SEO-optimized meta description
 */
function generateDescription(
  pageType: string,
  data: Record<string, string>
): string {
  const templates =
    DESCRIPTION_TEMPLATES[pageType as keyof typeof DESCRIPTION_TEMPLATES];

  if (!templates) {
    return `Rent a car in UAE with ${SITE_CONFIG.name}. Premium vehicles, competitive rates, and excellent service.`;
  }

  // Use entity hash for consistent template selection
  const hash = hashString(data.locationSlug || data.vehicleSlug || '');
  const templateIndex = hash % templates.length;
  const template = templates[templateIndex];

  const description = interpolate(template, data);

  // Ensure description is within 160 characters (SEO best practice)
  if (description.length > 160) {
    return description.substring(0, 157) + '...';
  }

  return description;
}

// ============================================================================
// Keyword Generation
// ============================================================================

/**
 * Generate relevant keywords
 */
function generateKeywords(
  primary: ProgrammaticEntity,
  secondary: ProgrammaticEntity[] | undefined,
  intent: UserIntent | undefined
): string[] {
  const keywords: Set<string> = new Set();

  // Primary entity keywords
  keywords.add(primary.name);
  keywords.add(`${primary.name} car rental`);
  primary.seo.keywords.forEach((k) => keywords.add(k));

  // Secondary entity keywords
  if (secondary) {
    secondary.forEach((entity) => {
      keywords.add(entity.name);
      entity.seo.keywords.forEach((k) => keywords.add(k));

      // Combination keywords
      keywords.add(`${entity.name} rental in ${primary.name}`);
      keywords.add(`rent ${entity.name} ${primary.name}`);
    });
  }

  // Intent-based keywords
  if (intent) {
    keywords.add(`${intent.type} car rental`);
    if (secondary && secondary[0]) {
      keywords.add(`${secondary[0].name} for ${intent.type}`);
    }
  }

  // Generic car rental keywords
  keywords.add('car rental UAE');
  keywords.add('rent a car');
  keywords.add('vehicle rental');

  return Array.from(keywords).slice(0, 15); // Limit to 15 keywords
}

// ============================================================================
// Canonical URL Generation
// ============================================================================

/**
 * Generate canonical URL
 */
function generateCanonicalURL(
  primary: ProgrammaticEntity,
  secondary: ProgrammaticEntity[] | undefined,
  intent: UserIntent | undefined
): string {
  let path = `/${primary.slug}`;

  if (secondary && secondary.length > 0) {
    path += `/${secondary[0].slug}`;

    if (intent) {
      path += `/${intent.type}`;
    }
  }

  return `${SITE_CONFIG.url}${path}`;
}

// ============================================================================
// Open Graph Generation
// ============================================================================

/**
 * Generate Open Graph metadata
 */
function generateOpenGraph(
  title: string,
  description: string,
  url: string,
  primary: ProgrammaticEntity
): Metadata['openGraph'] {
  // Default image
  let image = `${SITE_CONFIG.url}/og-default.jpg`;

  // Use entity-specific image if available
  if (primary.metadata.image) {
    image = primary.metadata.image as string;
  }

  return {
    title,
    description,
    url,
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    type: 'website',
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  };
}

// ============================================================================
// Twitter Card Generation
// ============================================================================

/**
 * Generate Twitter card metadata
 */
function generateTwitterCard(
  title: string,
  description: string
): Metadata['twitter'] {
  return {
    card: 'summary_large_image',
    title,
    description,
    site: SITE_CONFIG.twitter,
    creator: SITE_CONFIG.twitter,
  };
}

// ============================================================================
// Robots Configuration
// ============================================================================

/**
 * Generate robots meta tag configuration
 */
function generateRobots(primary: ProgrammaticEntity): Metadata['robots'] {
  // Default: index and follow
  const robots: Metadata['robots'] = {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };

  // Check if entity should be indexed
  if (primary.active === false) {
    robots.index = false;
    robots.follow = false;
  }

  // Low priority entities
  if (primary.priority && primary.priority < 3) {
    // Still index but with restrictions
    if (robots.googleBot && typeof robots.googleBot === 'object') {
      (robots.googleBot as Record<string, unknown>)['max-snippet'] = 160;
    }
  }

  return robots;
}

// ============================================================================
// Hreflang Generation
// ============================================================================

/**
 * Generate hreflang tags for internationalization
 */
export function generateHreflangTags(
  canonical: string,
  locales: string[] = ['en-AE', 'ar-AE']
): Record<string, string> {
  const hreflang: Record<string, string> = {};

  for (const locale of locales) {
    const lang = locale.split('-')[0];
    hreflang[locale] = `${canonical}?lang=${lang}`;
  }

  // x-default for fallback
  hreflang['x-default'] = canonical;

  return hreflang;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Hash string to number for consistent selection
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Validate metadata completeness
 */
export function validateMetadata(metadata: Metadata): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!metadata.title) {
    issues.push('Missing title');
  } else if (typeof metadata.title === 'string' && metadata.title.length > 60) {
    issues.push(`Title too long: ${metadata.title.length} characters (max: 60)`);
  }

  if (!metadata.description) {
    issues.push('Missing description');
  } else if (
    typeof metadata.description === 'string' &&
    metadata.description.length > 160
  ) {
    issues.push(
      `Description too long: ${metadata.description.length} characters (max: 160)`
    );
  }

  if (!metadata.alternates?.canonical) {
    issues.push('Missing canonical URL');
  }

  if (!metadata.openGraph) {
    issues.push('Missing Open Graph metadata');
  }

  if (!metadata.twitter) {
    issues.push('Missing Twitter card metadata');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Generate meta tags as HTML string (for testing/preview)
 */
export function generateMetaTagsHTML(metadata: Metadata): string {
  const tags: string[] = [];

  if (typeof metadata.title === 'string') {
    tags.push(`<title>${metadata.title}</title>`);
    tags.push(`<meta property="og:title" content="${metadata.title}" />`);
  }

  if (typeof metadata.description === 'string') {
    tags.push(`<meta name="description" content="${metadata.description}" />`);
    tags.push(
      `<meta property="og:description" content="${metadata.description}" />`
    );
  }

  if (metadata.keywords) {
    tags.push(`<meta name="keywords" content="${metadata.keywords}" />`);
  }

  if (metadata.alternates?.canonical) {
    tags.push(`<link rel="canonical" href="${metadata.alternates.canonical}" />`);
  }

  return tags.join('\n');
}

// ============================================================================
// Exports
// ============================================================================

export { SITE_CONFIG, TITLE_TEMPLATES, DESCRIPTION_TEMPLATES };
