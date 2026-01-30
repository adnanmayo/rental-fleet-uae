/**
 * Programmatic SEO Type System
 * Core types for scalable page generation (100k+ pages)
 */

// ==================== Entity Types ====================

export type EntityType = 'emirate' | 'vehicle' | 'service' | 'intent' | 'location';

export interface ProgrammaticEntity {
  id: string;
  type: EntityType;
  slug: string;
  name: string;
  displayName: string;
  /**
   * Whether the entity/page is active and should be indexed/linked.
   * Omitted means "active".
   */
  active?: boolean;
  metadata: EntityMetadata;
  content: EntityContent;
  relationships: EntityRelationship[];
  seo: EntitySEO;
  priority: number; // 1-10, for build prioritization
}

export interface EntityMetadata {
  // Common metadata
  stats?: Record<string, number | string>;
  features?: string[];
  tags?: string[];
  image?: string;
  brand?: string;
  coordinates?: { lat: number; lng: number };

  // Location-specific
  population?: number;
  location?: { lat: number; lng: number };

  // Service-specific
  availability?: string[];

  // Vehicle-specific
  rating?: number;
  priceRange?: { min: number; max: number; currency: string };
  price?: { from?: number; to?: number; daily?: number; currency?: string };
  seats?: number;
  popularModels?: string[];
  fuelEfficiency?: string;
  transmission?: string;
  fuelType?: string;
  capacity?: string;
  luggage?: string;
  doors?: number;
}

export interface EntityContent {
  description: string;
  longDescription?: string;
  benefits?: string[];
  features?: string[];
  faqs?: FAQ[];
  highlights?: string[];
}

export interface EntityRelationship {
  type: 'parent' | 'child' | 'related' | 'sibling';
  entityId: string;
  entityType: EntityType;
  weight?: number; // For prioritizing relationships
}

export interface EntitySEO {
  titleTemplate: string; // e.g., "{name} Car Rental in {emirate} | Best Prices"
  descriptionTemplate: string;
  keywords: string[];
  h1Template?: string;
  schemaType?: SchemaType;
}

// ==================== Content Generation ====================

export interface ContentTemplate {
  id: string;
  name: string;
  structure: TemplateStructure;
  sections: TemplateSection[];
  variants: TemplateVariant[];
}

export type TemplateStructure = 
  | 'hero-benefits-faq' 
  | 'stats-guide-cta' 
  | 'comparison-features-faq'
  | 'directory-list-cta';

export interface TemplateSection {
  id: string;
  type: 'hero' | 'benefits' | 'features' | 'faq' | 'cta' | 'stats' | 'guide' | 'comparison';
  contentTemplate: string;
  order: number;
  required: boolean;
}

export interface TemplateVariant {
  id: string;
  structure: TemplateStructure;
  weight: number; // For A/B testing
  sections: TemplateSection[];
}

export interface GeneratedContent {
  title?: string;
  description?: string;
  h1?: string;
  sections: GeneratedSection[];
  faqs?: FAQ[];
  metadata?: Record<string, any>;
  uniquenessScore?: number;
  wordCount?: number;
  keywordDensity?: number | Record<string, number>;
  readabilityScore?: number;
}

export interface GeneratedSection {
  id?: string;
  type: string;
  title?: string;
  heading?: string;
  content: string;
  order: number;
  data?: any;
}

// ==================== Page Types ====================

export type PageType = 'hub' | 'spoke' | 'comparison' | 'directory' | 'blog';

export interface GenerationContext {
  primary: ProgrammaticEntity;
  secondary?: ProgrammaticEntity[];
  intent?: { type: IntentType };
  targetWordCount?: number;
  variant?: TemplateVariant;
}

// Content generation types
export type ContentSection = GeneratedSection;
export type UserIntent = { type: string; priority?: number };
export type IntentType = 'tourism' | 'business' | 'family' | 'wedding' | 'corporate' | 'luxury' | 'default';
export type ContentTone = 'professional' | 'casual' | 'luxury' | 'budget' | 'family-friendly';

export interface PageContext {
  pageType: PageType;
  entities: ProgrammaticEntity[];
  primaryEntity: ProgrammaticEntity;
  intent?: string;
  locale?: string;
  template: ContentTemplate;
  contextualKeywords: string[];
}

export interface GeneratedPage {
  slug: string;
  path: string;
  pageType: PageType;
  content: GeneratedContent;
  metadata: PageMetadata;
  schema: SchemaMarkup[];
  internalLinks: InternalLink[];
  priority: number;
  revalidate: number; // ISR revalidation time in seconds
}

export interface GeneratedSEO {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  schema: SchemaMarkup[];
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    locale: string;
    type: string;
    images?: Array<{ url: string; width?: number; height?: number; alt?: string }>;
  };
  twitter: {
    card: 'summary' | 'summary_large_image';
    title: string;
    description: string;
    site?: string;
    creator?: string;
    images?: string[];
  };
}

// Optional config type (kept for compatibility with generators)
export interface OpenGraphConfig {
  locale?: string;
  siteName?: string;
  defaultImageUrl?: string;
}

// ==================== SEO Types ====================

export interface PageMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  openGraph: OpenGraphTags;
  twitter: TwitterTags;
  robots: RobotsConfig;
  alternates?: { [locale: string]: string };
}

export interface OpenGraphTags {
  title: string;
  description: string;
  url: string;
  type: string;
  images: Array<{
    url: string;
    width: number;
    height: number;
    alt: string;
  }>;
  siteName: string;
  locale: string;
}

export interface TwitterTags {
  card: 'summary' | 'summary_large_image';
  site?: string;
  creator?: string;
  title: string;
  description: string;
  images: string[];
}

export interface RobotsConfig {
  index: boolean;
  follow: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  'max-snippet'?: number;
  'max-image-preview'?: 'none' | 'standard' | 'large';
  'max-video-preview'?: number;
}

// ==================== Schema Types ====================

export type SchemaType = 
  | 'Article' 
  | 'Product' 
  | 'Service' 
  | 'Place' 
  | 'FAQPage' 
  | 'Offer'
  | 'ItemList'
  | 'BreadcrumbList'
  | 'Organization';

export interface SchemaMarkup {
  '@context': string;
  '@type': SchemaType | SchemaType[];
  [key: string]: any;
}

// ==================== Internal Linking ====================

export interface InternalLink {
  url: string;
  /**
   * Anchor text shown to users.
   * (Used by the linking engine.)
   */
  text: string;
  /**
   * Relationship type of the link.
   */
  type: LinkType;
  /**
   * Relevance score (0-1) used for sorting/limiting.
   */
  relevance: number;
  /**
   * Where the link is intended to appear on the page.
   */
  position: 'breadcrumb' | 'sidebar' | 'body';
}

export type LinkType =
  | 'parent'
  | 'child'
  | 'sibling'
  | 'related'
  | 'contextual'
  | 'breadcrumb';

export interface LinkingRules {
  linkTo: Array<'parent' | 'child' | 'sibling' | 'related'>;
  maxLinks: number;
  minLinks?: number;
  distribution?: 'balanced' | 'relevance' | 'priority';
  contextual?: boolean;
}

export interface LinkingStrategy {
  hub: LinkingRules;
  spoke: LinkingRules;
  comparison: LinkingRules;
  directory: LinkingRules;
  blog?: LinkingRules;
}

// ==================== Performance ====================

export interface ISRConfig {
  revalidate: number;
  tags?: string[];
  onDemand?: boolean;
  tier?: number;
  buildStrategy?: string;
}

export interface BuildConfig {
  priorityTier: 1 | 2 | 3;
  generateAtBuild: boolean;
  prerender: boolean;
}

// ==================== Content Quality ====================

export interface ContentQualityMetrics {
  uniquenessScore: number; // 0-1
  wordCount: number;
  readabilityScore: number;
  keywordDensity: number;
  internalLinkCount: number;
  schemaValidity: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  metrics: ContentQualityMetrics;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// ==================== FAQ ====================

export interface FAQ {
  question: string;
  answer: string;
  category?: string;
}

// ==================== Helper Types ====================

export interface TemplateVariables {
  [key: string]: string | number | string[] | undefined;
}

export interface ContentGenerationOptions {
  enforceUniqueness: boolean;
  minWordCount: number;
  maxLinks: number;
  includeSchema: boolean;
  templateVariant?: string;
}
