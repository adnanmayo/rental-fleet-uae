/**
 * Dynamic Schema Markup Builder
 *
 * Generates JSON-LD structured data (Schema.org) for programmatic pages
 * to enhance SEO and search engine rich results.
 *
 * @module lib/programmatic/schema-builder
 * @version 2.0
 */

import type {
  ProgrammaticEntity,
  GenerationContext,
  SchemaType,
  FAQ,
} from './types';

// ============================================================================
// Schema Type Definitions
// ============================================================================

/**
 * Base schema interface
 */
interface BaseSchema {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

/**
 * Organization schema
 */
interface OrganizationSchema extends BaseSchema {
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description?: string;
  contactPoint?: ContactPoint[];
  sameAs?: string[];
}

/**
 * Contact point for organization
 */
interface ContactPoint {
  '@type': 'ContactPoint';
  telephone: string;
  contactType: string;
  areaServed?: string;
  availableLanguage?: string[];
}

/**
 * Place schema
 */
interface PlaceSchema extends BaseSchema {
  '@type': 'Place';
  name: string;
  description?: string;
  geo?: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  address?: {
    '@type': 'PostalAddress';
    addressCountry: string;
    addressRegion?: string;
    addressLocality: string;
  };
}

/**
 * Product schema
 */
interface ProductSchema extends BaseSchema {
  '@type': 'Product';
  name: string;
  description: string;
  image?: string;
  brand?: {
    '@type': 'Brand';
    name: string;
  };
  offers?: OfferSchema;
  aggregateRating?: AggregateRating;
}

/**
 * Offer schema
 */
interface OfferSchema {
  '@type': 'Offer';
  price: number;
  priceCurrency: string;
  availability: string;
  priceValidUntil?: string;
  url?: string;
}

/**
 * Service schema
 */
interface ServiceSchema extends BaseSchema {
  '@type': 'Service';
  name: string;
  description: string;
  provider: {
    '@type': 'Organization';
    name: string;
  };
  areaServed: {
    '@type': 'Place';
    name: string;
  };
  offers?: OfferSchema;
}

/**
 * FAQ Page schema
 */
interface FAQPageSchema extends BaseSchema {
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

/**
 * ItemList schema (for comparisons)
 */
interface ItemListSchema extends BaseSchema {
  '@type': 'ItemList';
  name: string;
  description?: string;
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    item: BaseSchema;
  }>;
}

/**
 * Aggregate rating
 */
interface AggregateRating {
  '@type': 'AggregateRating';
  ratingValue: number;
  reviewCount?: number;
  bestRating?: number;
  worstRating?: number;
}

/**
 * BreadcrumbList schema
 */
interface BreadcrumbListSchema extends BaseSchema {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

// ============================================================================
// Constants
// ============================================================================

const SCHEMA_CONTEXT = 'https://schema.org';

const ORGANIZATION_DATA = {
  name: 'Rental Fleet UAE',
  url: 'https://rental-fleet-uae.com',
  logo: 'https://rental-fleet-uae.com/logo.png',
  description: 'Premium car rental services across the United Arab Emirates',
  contactPoint: [
    {
      '@type': 'ContactPoint' as const,
      telephone: '+971-4-XXX-XXXX',
      contactType: 'Customer Service',
      areaServed: 'AE',
      availableLanguage: ['English', 'Arabic'],
    },
  ],
  sameAs: [
    'https://facebook.com/rentalfleetuae',
    'https://twitter.com/rentalfleetuae',
    'https://instagram.com/rentalfleetuae',
  ],
};

// ============================================================================
// Main Schema Builder
// ============================================================================

/**
 * Build all relevant schema markup for a page
 *
 * @example
 * ```typescript
 * const schemas = buildSchemaMarkup({
 *   primary: dubaiEntity,
 *   secondary: [luxuryCarEntity],
 *   template: hubTemplate
 * });
 * ```
 */
export function buildSchemaMarkup(
  context: GenerationContext
): Record<string, unknown>[] {
  const schemas: Record<string, unknown>[] = [];

  // Always include organization schema
  schemas.push(buildOrganizationSchema());

  // Build entity-specific schemas
  const entitySchemas = buildEntitySchemas(context);
  schemas.push(...entitySchemas);

  // Add FAQ schema if FAQs are present
  if (hasFAQs(context)) {
    const faqSchema = buildFAQSchema(context);
    if (faqSchema) {
      schemas.push(faqSchema);
    }
  }

  // Add breadcrumb schema
  const breadcrumbSchema = buildBreadcrumbSchema(context);
  schemas.push(breadcrumbSchema);

  return schemas;
}

// ============================================================================
// Entity-Specific Schema Builders
// ============================================================================

/**
 * Build schemas based on entity types
 */
function buildEntitySchemas(
  context: GenerationContext
): Record<string, unknown>[] {
  const { primary, secondary } = context;
  const schemas: Record<string, unknown>[] = [];

  // Emirate/Location schemas
  if (primary.type === 'emirate' || primary.type === 'location') {
    schemas.push(buildPlaceSchema(primary));

    // If vehicle is secondary, add product/service schema
    if (secondary && secondary[0]?.type === 'vehicle') {
      schemas.push(buildVehicleProductSchema(secondary[0], primary));
      schemas.push(buildRentalServiceSchema(secondary[0], primary));
    }
  }

  // Vehicle type schemas
  if (primary.type === 'vehicle') {
    schemas.push(buildVehicleProductSchema(primary));

    // If location is secondary, add service schema
    if (
      secondary &&
      (secondary[0]?.type === 'emirate' || secondary[0]?.type === 'location')
    ) {
      schemas.push(buildRentalServiceSchema(primary, secondary[0]));
    }
  }

  // Service schemas
  if (primary.type === 'service') {
    schemas.push(buildServiceSchema(primary));
  }

  // Comparison schemas
  if (secondary && secondary.length > 1) {
    schemas.push(buildComparisonSchema(primary, secondary));
  }

  return schemas;
}

// ============================================================================
// Individual Schema Builders
// ============================================================================

/**
 * Build organization schema
 */
function buildOrganizationSchema(): OrganizationSchema {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Organization',
    ...ORGANIZATION_DATA,
  };
}

/**
 * Build place schema for emirate/location
 */
function buildPlaceSchema(entity: ProgrammaticEntity): PlaceSchema {
  const schema: PlaceSchema = {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Place',
    name: entity.name,
    description: entity.content.description,
  };

  // Add geographic coordinates if available
  if (entity.metadata.coordinates) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: entity.metadata.coordinates.lat,
      longitude: entity.metadata.coordinates.lng,
    };
  }

  // Add address
  schema.address = {
    '@type': 'PostalAddress',
    addressCountry: 'AE',
    addressLocality: entity.name,
  };

  return schema;
}

/**
 * Build product schema for vehicle
 */
function buildVehicleProductSchema(
  vehicle: ProgrammaticEntity,
  location?: ProgrammaticEntity
): ProductSchema {
  const schema: ProductSchema = {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Product',
    name: vehicle.name,
    description: vehicle.content.description,
  };

  // Add brand if available
  if (vehicle.metadata.brand) {
    schema.brand = {
      '@type': 'Brand',
      name: vehicle.metadata.brand as string,
    };
  }

  // Add image if available
  if (vehicle.metadata.image) {
    schema.image = vehicle.metadata.image as string;
  }

  // Add offer information
  if (vehicle.metadata.price) {
    schema.offers = {
      '@type': 'Offer',
      price: vehicle.metadata.price.daily || vehicle.metadata.price.from || 150,
      priceCurrency: vehicle.metadata.price.currency || 'AED',
      availability: 'https://schema.org/InStock',
      priceValidUntil: getNextYearDate(),
    };

    if (location) {
      schema.offers.url = `https://rental-fleet-uae.com/${location.slug}/${vehicle.slug}`;
    }
  }

  // Add rating if available
  if (vehicle.metadata.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: vehicle.metadata.rating,
      bestRating: 5,
      worstRating: 1,
      reviewCount: Math.floor(Math.random() * 100) + 20, // Mock review count
    };
  }

  return schema;
}

/**
 * Build service schema for rental service
 */
function buildRentalServiceSchema(
  vehicle: ProgrammaticEntity,
  location: ProgrammaticEntity
): ServiceSchema {
  const serviceName = `${vehicle.name} Rental in ${location.name}`;

  const schema: ServiceSchema = {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Service',
    name: serviceName,
    description: `Rent a ${vehicle.name} in ${location.name}. ${vehicle.content.description}`,
    provider: {
      '@type': 'Organization',
      name: ORGANIZATION_DATA.name,
    },
    areaServed: {
      '@type': 'Place',
      name: location.name,
    },
  };

  // Add offer if price available
  if (vehicle.metadata.price) {
    schema.offers = {
      '@type': 'Offer',
      price: vehicle.metadata.price.daily || vehicle.metadata.price.from || 150,
      priceCurrency: vehicle.metadata.price.currency || 'AED',
      availability: 'https://schema.org/InStock',
    };
  }

  return schema;
}

/**
 * Build generic service schema
 */
function buildServiceSchema(entity: ProgrammaticEntity): ServiceSchema {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Service',
    name: entity.name,
    description: entity.content.description,
    provider: {
      '@type': 'Organization',
      name: ORGANIZATION_DATA.name,
    },
    areaServed: {
      '@type': 'Place',
      name: 'United Arab Emirates',
    },
  };
}

/**
 * Build FAQ page schema
 */
function buildFAQSchema(context: GenerationContext): FAQPageSchema | null {
  const faqs = collectFAQs(context);

  if (faqs.length === 0) {
    return null;
  }

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question' as const,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: faq.answer,
      },
    })),
  };
}

/**
 * Build comparison ItemList schema
 */
function buildComparisonSchema(
  primary: ProgrammaticEntity,
  secondary: ProgrammaticEntity[]
): ItemListSchema {
  const items = [primary, ...secondary];

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'ItemList',
    name: `Comparison: ${items.map((e) => e.name).join(' vs ')}`,
    description: `Compare ${items.map((e) => e.name).join(', ')} for car rental`,
    itemListElement: items.map((entity, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      item: buildVehicleProductSchema(entity) as BaseSchema,
    })),
  };
}

/**
 * Build breadcrumb schema
 */
function buildBreadcrumbSchema(context: GenerationContext): BreadcrumbListSchema {
  const { primary, secondary } = context;

  const breadcrumbs: Array<{ name: string; item?: string }> = [
    {
      name: 'Home',
      item: 'https://rental-fleet-uae.com',
    },
    {
      name: primary.name,
      item: `https://rental-fleet-uae.com/${primary.slug}`,
    },
  ];

  if (secondary && secondary.length > 0) {
    breadcrumbs.push({
      name: secondary[0].name,
      item: `https://rental-fleet-uae.com/${primary.slug}/${secondary[0].slug}`,
    });
  }

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if context has FAQs
 */
function hasFAQs(context: GenerationContext): boolean {
  const { primary, secondary } = context;

  if (primary.content.faqs && primary.content.faqs.length > 0) {
    return true;
  }

  if (secondary) {
    return secondary.some(
      (entity) => entity.content.faqs && entity.content.faqs.length > 0
    );
  }

  return false;
}

/**
 * Collect all FAQs from entities
 */
function collectFAQs(context: GenerationContext): FAQ[] {
  const { primary, secondary } = context;
  const faqs: FAQ[] = [];

  if (primary.content.faqs) {
    faqs.push(...primary.content.faqs);
  }

  if (secondary) {
    secondary.forEach((entity) => {
      if (entity.content.faqs) {
        faqs.push(...entity.content.faqs);
      }
    });
  }

  // Limit to 10 FAQs for schema
  return faqs.slice(0, 10);
}

/**
 * Get date one year from now
 */
function getNextYearDate(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
}

// ============================================================================
// Schema Validation
// ============================================================================

/**
 * Validate schema structure
 */
export function validateSchema(schema: Record<string, unknown>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required fields
  if (!schema['@context']) {
    errors.push('Missing @context');
  }

  if (!schema['@type']) {
    errors.push('Missing @type');
  }

  // Check schema-specific requirements
  const schemaType = schema['@type'] as string;

  switch (schemaType) {
    case 'Organization':
      if (!schema.name) errors.push('Organization missing name');
      if (!schema.url) errors.push('Organization missing url');
      break;

    case 'Place':
      if (!schema.name) errors.push('Place missing name');
      break;

    case 'Product':
      if (!schema.name) errors.push('Product missing name');
      if (!schema.description) errors.push('Product missing description');
      break;

    case 'Service':
      if (!schema.name) errors.push('Service missing name');
      if (!schema.provider) errors.push('Service missing provider');
      break;

    case 'FAQPage':
      if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
        errors.push('FAQPage missing mainEntity array');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate all schemas in array
 */
export function validateAllSchemas(
  schemas: Record<string, unknown>[]
): {
  valid: boolean;
  results: Array<{ index: number; valid: boolean; errors: string[] }>;
} {
  const results = schemas.map((schema, index) => ({
    index,
    ...validateSchema(schema),
  }));

  return {
    valid: results.every((r) => r.valid),
    results,
  };
}

// ============================================================================
// Schema Output
// ============================================================================

/**
 * Convert schema to JSON-LD script tag
 */
export function schemaToScriptTag(schema: Record<string, unknown>): string {
  return `<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>`;
}

/**
 * Convert all schemas to script tags
 */
export function schemasToScriptTags(schemas: Record<string, unknown>[]): string {
  return schemas.map(schemaToScriptTag).join('\n');
}

/**
 * Build schema graph (multiple schemas in one script)
 */
export function buildSchemaGraph(
  schemas: Record<string, unknown>[]
): Record<string, unknown> {
  return {
    '@context': SCHEMA_CONTEXT,
    '@graph': schemas,
  };
}

// ============================================================================
// React Component Helper
// ============================================================================

/**
 * Generate props for Next.js script component
 *
 * @example
 * ```tsx
 * import Script from 'next/script';
 *
 * const schemaProps = getSchemaScriptProps(schemas);
 * return <Script {...schemaProps} />;
 * ```
 */
export function getSchemaScriptProps(schemas: Record<string, unknown>[]) {
  return {
    id: 'schema-markup',
    type: 'application/ld+json',
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(buildSchemaGraph(schemas)),
    },
  };
}

// ============================================================================
// Exports
// ============================================================================

export type {
  BaseSchema,
  OrganizationSchema,
  PlaceSchema,
  ProductSchema,
  ServiceSchema,
  FAQPageSchema,
  ItemListSchema,
  BreadcrumbListSchema,
};

export { SCHEMA_CONTEXT, ORGANIZATION_DATA };
