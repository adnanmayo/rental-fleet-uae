/**
 * Content Generation Engine
 *
 * Advanced content generation system with anti-duplication mechanisms,
 * template processing, and quality control for programmatic SEO.
 *
 * @module lib/programmatic/content-generator
 * @version 2.0
 */

import type {
  ProgrammaticEntity,
  GenerationContext,
  GeneratedContent,
  ContentSection,
  TemplateVariant,
  UserIntent,
  IntentType,
  ContentTone,
  FAQ,
} from './types';

// ============================================================================
// Content Variations Database
// ============================================================================

/**
 * Sentence structure variations to prevent duplication
 */
const CONTENT_VARIATIONS = {
  intro: {
    business: [
      'Looking for reliable {vehicleType} rental in {location}? Our business-focused services deliver professional solutions tailored to corporate needs.',
      'Streamline your business operations with our premium {vehicleType} rental services in {location}. Corporate packages available.',
      'Discover why {location} businesses trust our {vehicleType} rental solutions for their corporate transportation needs.',
    ],
    tourism: [
      'Explore {location} in style with our {vehicleType} rental services. Perfect for tourists seeking adventure and convenience.',
      'Make your {location} vacation unforgettable with a {vehicleType} from our extensive fleet. Tourist-friendly packages available.',
      'Experience the best of {location} with our reliable {vehicleType} rentals, designed for travelers who value comfort and flexibility.',
    ],
    family: [
      'Planning a family trip in {location}? Our {vehicleType} rentals offer the space and safety features your family deserves.',
      'Travel comfortably with your family in {location} using our {vehicleType} rental services. Child seats and family packages available.',
      'Make family memories in {location} easier with our spacious {vehicleType} rentals, perfect for all ages.',
    ],
    luxury: [
      'Indulge in luxury with our premium {vehicleType} rental collection in {location}. Exclusive vehicles for discerning clients.',
      'Experience {location} in unparalleled luxury with our high-end {vehicleType} rental services. VIP treatment guaranteed.',
      'Elevate your {location} journey with our luxury {vehicleType} rentals, featuring top-tier brands and white-glove service.',
    ],
  },
  benefits: {
    flexibility: [
      'Flexible rental periods from daily to monthly',
      'Choose your rental duration - no long-term commitments required',
      'Customize your rental period to match your exact needs',
    ],
    convenience: [
      'Free delivery and pickup across {location}',
      'Convenient door-to-door service throughout {location}',
      '24/7 customer support for your peace of mind',
    ],
    quality: [
      'Well-maintained, regularly serviced vehicles',
      'Modern fleet with the latest safety features',
      'Comprehensive insurance coverage included',
    ],
  },
  cta: {
    business: [
      'Request a Corporate Quote',
      'Get Your Business Rental Quote',
      'Contact Our Corporate Team',
    ],
    tourism: [
      'Book Your Adventure',
      'Reserve Your Vehicle Now',
      'Start Your Journey',
    ],
    default: [
      'Book Now',
      'Get a Quote',
      'Reserve Your Vehicle',
      'Check Availability',
    ],
  },
};

/**
 * Content templates for different sections
 */
const SECTION_TEMPLATES = {
  hero: {
    professional: '{vehicleType} Rental Services in {location}',
    enthusiastic: 'Your Perfect {vehicleType} Awaits in {location}!',
    informative: 'Comprehensive {vehicleType} Rental Guide for {location}',
  },
  description: {
    short: [
      'Rent a {vehicleType} in {location} for {priceFrom} per day. {feature1}, {feature2}, and {feature3} included.',
      'Get the best {vehicleType} rental deals in {location} starting at {priceFrom}/day. {benefit1} and {benefit2}.',
      '{location} {vehicleType} rental from {priceFrom} daily. Featuring {feature1}, {feature2}, and excellent customer service.',
    ],
    long: [
      'When it comes to {vehicleType} rental in {location}, we offer unmatched quality and service. Our fleet of well-maintained vehicles ensures your journey is comfortable, safe, and memorable. Whether you need a {vehicleType} for business meetings, family outings, or exploring the sights of {location}, we have the perfect vehicle for you. With transparent pricing starting at {priceFrom} per day, flexible rental terms, and 24/7 customer support, we make car rental simple and stress-free.',
      'Discover the freedom of the road with our {vehicleType} rental services in {location}. We understand that every customer has unique needs, which is why we offer a diverse range of {vehicleType}s to choose from. From the moment you book until you return the vehicle, our team is dedicated to providing exceptional service. Enjoy competitive rates starting from {priceFrom} per day, comprehensive insurance coverage, and the flexibility to extend your rental as needed.',
    ],
  },
};

// ============================================================================
// Content Generation Functions
// ============================================================================

/**
 * Generate unique content for a page based on context
 *
 * @example
 * ```typescript
 * const content = await generateContent({
 *   primary: dubaiEntity,
 *   secondary: [luxuryCarEntity],
 *   intent: { type: 'business' },
 *   template: businessTemplate,
 *   targetWordCount: 1000
 * });
 * ```
 */
export async function generateContent(
  context: GenerationContext
): Promise<GeneratedContent> {
  const { primary, secondary, intent, variant, targetWordCount = 800 } = context;

  // Build interpolation context
  const interpolationData = buildInterpolationContext(primary, secondary, intent);

  // Select content variations based on entity hash (for consistency)
  const variationSeed = hashString(primary.id + (secondary?.[0]?.id || ''));

  // Generate sections
  const sections: ContentSection[] = [];
  let totalWordCount = 0;

  // Hero section
  sections.push(
    generateHeroSection(interpolationData, intent?.type, variationSeed)
  );
  totalWordCount += estimateWordCount(sections[sections.length - 1].content);

  // Description section
  sections.push(
    generateDescriptionSection(
      interpolationData,
      intent,
      primary,
      secondary,
      variationSeed
    )
  );
  totalWordCount += estimateWordCount(sections[sections.length - 1].content);

  // Benefits section
  if (variant?.sections.some((s) => s.type === 'benefits') !== false) {
    sections.push(
      generateBenefitsSection(interpolationData, intent?.type, variationSeed)
    );
    totalWordCount += estimateWordCount(sections[sections.length - 1].content);
  }

  // Features section
  if (primary.metadata.features && primary.metadata.features.length > 0) {
    sections.push(generateFeaturesSection(primary, variationSeed));
    totalWordCount += estimateWordCount(sections[sections.length - 1].content);
  }

  // Stats section (if available)
  if (primary.metadata.stats) {
    sections.push(generateStatsSection(primary, interpolationData));
    totalWordCount += estimateWordCount(sections[sections.length - 1].content);
  }

  // Guide section
  sections.push(generateGuideSection(interpolationData, intent, variationSeed));
  totalWordCount += estimateWordCount(sections[sections.length - 1].content);

  // FAQ section
  const faqs = generateFAQs(primary, secondary, intent, variationSeed);
  if (faqs.length > 0) {
    sections.push({
      id: 'faq',
      title: 'Frequently Asked Questions',
      content: formatFAQsAsContent(faqs),
      type: 'text',
      order: sections.length,
      data: { faqs },
    });
    totalWordCount += estimateWordCount(sections[sections.length - 1].content);
  }

  // CTA section
  sections.push(generateCTASection(interpolationData, intent?.type, variationSeed));
  totalWordCount += estimateWordCount(sections[sections.length - 1].content);

  // Calculate keyword density
  const allContent = sections.map((s) => s.content).join(' ');
  const keywordDensity = calculateKeywordDensity(
    allContent,
    primary.seo.keywords
  );

  return {
    sections,
    wordCount: totalWordCount,
    keywordDensity,
    readabilityScore: calculateReadabilityScore(allContent),
  };
}

/**
 * Build interpolation context from entities
 */
function buildInterpolationContext(
  primary: ProgrammaticEntity,
  secondary: ProgrammaticEntity[] | undefined,
  intent: UserIntent | undefined
): Record<string, string> {
  const context: Record<string, string> = {
    location: primary.name,
    locationSlug: primary.slug,
  };

  if (primary.type === 'vehicle' || secondary?.[0]?.type === 'vehicle') {
    const vehicle = primary.type === 'vehicle' ? primary : secondary?.[0];
    if (vehicle) {
      context.vehicleType = vehicle.name;
      context.vehicleSlug = vehicle.slug;
    }
  }

  if (primary.metadata.price?.from) {
    context.priceFrom = `AED ${primary.metadata.price.from}`;
  }

  if (primary.metadata.features && primary.metadata.features.length >= 3) {
    context.feature1 = primary.metadata.features[0];
    context.feature2 = primary.metadata.features[1];
    context.feature3 = primary.metadata.features[2];
  }

  if (primary.content.benefits && primary.content.benefits.length >= 2) {
    context.benefit1 = primary.content.benefits[0];
    context.benefit2 = primary.content.benefits[1];
  }

  if (intent) {
    context.intent = intent.type;
  }

  return context;
}

/**
 * Generate hero section
 */
function generateHeroSection(
  data: Record<string, string>,
  intentType?: IntentType,
  seed = 0
): ContentSection {
  // Map intent to available template tones
  let tone: 'professional' | 'enthusiastic' | 'informative' = 'professional';
  if (intentType === 'family') tone = 'enthusiastic';
  if (intentType === 'tourism') tone = 'informative';

  const titleTemplate = SECTION_TEMPLATES.hero[tone];
  const title = interpolate(titleTemplate, data);

  return {
    id: 'hero',
    title,
    content: title,
    type: 'text',
    order: 0,
  };
}

/**
 * Generate description section
 */
function generateDescriptionSection(
  data: Record<string, string>,
  intent: UserIntent | undefined,
  primary: ProgrammaticEntity,
  secondary: ProgrammaticEntity[] | undefined,
  seed: number
): ContentSection {
  const intentType = intent?.type || 'default';

  // Get intro variation
  const introVariations =
    CONTENT_VARIATIONS.intro[intentType as keyof typeof CONTENT_VARIATIONS.intro] ||
    CONTENT_VARIATIONS.intro.tourism;
  const introIndex = seed % introVariations.length;
  const intro = interpolate(introVariations[introIndex], data);

  // Get long description variation
  const longDescVariations = SECTION_TEMPLATES.description.long;
  const longDescIndex = (seed + 1) % longDescVariations.length;
  const longDesc = interpolate(longDescVariations[longDescIndex], data);

  // Combine with entity-specific description
  const entityDesc = primary.content.longDescription || primary.content.description;

  const fullContent = `${intro}\n\n${longDesc}\n\n${entityDesc}`;

  return {
    id: 'description',
    title: `About ${data.vehicleType || 'Our'} Rental in ${data.location}`,
    content: fullContent,
    type: 'text',
    order: 1,
  };
}

/**
 * Generate benefits section
 */
function generateBenefitsSection(
  data: Record<string, string>,
  intentType?: IntentType,
  seed = 0
): ContentSection {
  const benefits: string[] = [];

  // Add variations from each category
  Object.values(CONTENT_VARIATIONS.benefits).forEach((category, index) => {
    const varIndex = (seed + index) % category.length;
    benefits.push(interpolate(category[varIndex], data));
  });

  const content = `
## Why Choose Our Services

${benefits.map((b, i) => `${i + 1}. ${b}`).join('\n')}

Our commitment to customer satisfaction sets us apart. With years of experience serving ${data.location}, we understand what travelers and residents need. Every vehicle in our fleet undergoes rigorous maintenance checks to ensure your safety and comfort.
  `.trim();

  return {
    id: 'benefits',
    title: 'Key Benefits',
    content,
    type: 'list',
    order: 2,
  };
}

/**
 * Generate features section
 */
function generateFeaturesSection(
  entity: ProgrammaticEntity,
  seed: number
): ContentSection {
  const features = entity.metadata.features || [];

  const content = `
## Vehicle Features

Our ${entity.name} comes equipped with:

${features.map((f) => `- ${f}`).join('\n')}

${features.length > 5 ? 'And many more premium features to enhance your driving experience.' : ''}
  `.trim();

  return {
    id: 'features',
    title: 'Features & Amenities',
    content,
    type: 'list',
    order: 3,
  };
}

/**
 * Generate stats section
 */
function generateStatsSection(
  entity: ProgrammaticEntity,
  data: Record<string, string>
): ContentSection {
  const stats = entity.metadata.stats || {};

  const statsText = Object.entries(stats)
    .map(([key, value]) => `**${formatStatKey(key)}:** ${formatStatValue(value)}`)
    .join('\n');

  const content = `
## Quick Stats

${statsText}

These numbers reflect our commitment to quality service and customer satisfaction in ${data.location}.
  `.trim();

  return {
    id: 'stats',
    title: 'By the Numbers',
    content,
    type: 'text',
    order: 4,
  };
}

/**
 * Generate guide section
 */
function generateGuideSection(
  data: Record<string, string>,
  intent: UserIntent | undefined,
  seed: number
): ContentSection {
  const guides = [
    `
### How to Book

1. **Select Your Vehicle**: Browse our fleet and choose the perfect ${data.vehicleType || 'vehicle'}
2. **Choose Your Dates**: Pick up and drop off times that work for you
3. **Confirm Details**: Review your booking and confirm
4. **Get Driving**: We'll deliver to your location in ${data.location}
    `,
    `
### Rental Process

Our streamlined booking process makes renting a ${data.vehicleType || 'vehicle'} in ${data.location} simple:

- **Online Booking**: Reserve in minutes through our website
- **Document Verification**: Quick verification of driving license and ID
- **Vehicle Inspection**: Thorough walk-around before you drive off
- **Flexible Return**: Multiple drop-off options across ${data.location}
    `,
  ];

  const guideIndex = seed % guides.length;

  return {
    id: 'guide',
    title: 'Rental Guide',
    content: guides[guideIndex].trim(),
    type: 'text',
    order: 5,
  };
}

/**
 * Generate FAQs
 */
function generateFAQs(
  primary: ProgrammaticEntity,
  secondary: ProgrammaticEntity[] | undefined,
  intent: UserIntent | undefined,
  seed: number
): FAQ[] {
  const faqs: FAQ[] = [];

  // Entity-specific FAQs
  if (primary.content.faqs && primary.content.faqs.length > 0) {
    faqs.push(...primary.content.faqs);
  }

  // Common FAQs based on intent
  const commonFAQs: FAQ[] = [
    {
      question: `What documents do I need to rent a ${secondary?.[0]?.name || 'vehicle'} in ${primary.name}?`,
      answer:
        'You will need a valid driving license, passport or Emirates ID, and a credit card for the security deposit.',
      category: 'requirements',
    },
    {
      question: 'What is included in the rental price?',
      answer:
        'Our rental prices include basic insurance, 24/7 roadside assistance, and unlimited mileage within the UAE.',
      category: 'pricing',
    },
    {
      question: `Can I pick up the vehicle in ${primary.name} and drop it off elsewhere?`,
      answer:
        'Yes, we offer one-way rentals. Additional fees may apply depending on the drop-off location.',
      category: 'logistics',
    },
    {
      question: 'Is there a minimum rental period?',
      answer:
        'Our minimum rental period is 24 hours, but we offer competitive rates for weekly and monthly rentals.',
      category: 'policies',
    },
    {
      question: 'What happens if I return the vehicle late?',
      answer:
        'We offer a 1-hour grace period. After that, late fees are calculated on an hourly basis.',
      category: 'policies',
    },
  ];

  // Select 4-5 FAQs to avoid overwhelming
  const numFAQs = 4 + (seed % 2);
  const selectedFAQs = commonFAQs.slice(0, numFAQs);

  faqs.push(...selectedFAQs);

  return faqs.slice(0, 6); // Max 6 FAQs per page
}

/**
 * Format FAQs as content
 */
function formatFAQsAsContent(faqs: FAQ[]): string {
  return faqs
    .map(
      (faq) => `
### ${faq.question}

${faq.answer}
    `.trim()
    )
    .join('\n\n');
}

/**
 * Generate CTA section
 */
function generateCTASection(
  data: Record<string, string>,
  intentType?: IntentType,
  seed = 0
): ContentSection {
  const ctaVariations =
    intentType && intentType in CONTENT_VARIATIONS.cta
      ? CONTENT_VARIATIONS.cta[intentType as keyof typeof CONTENT_VARIATIONS.cta]
      : CONTENT_VARIATIONS.cta.default;

  const ctaIndex = seed % ctaVariations.length;
  const ctaText = ctaVariations[ctaIndex];

  const content = `
## Ready to Get Started?

Don't wait - book your ${data.vehicleType || 'vehicle'} in ${data.location} today and experience hassle-free rental service. Our team is ready to help you find the perfect vehicle for your needs.

**${ctaText}** - Available 24/7
  `.trim();

  return {
    id: 'cta',
    title: 'Book Now',
    content,
    type: 'callout',
    order: 99,
  };
}

// ============================================================================
// Anti-Duplication Utilities
// ============================================================================

/**
 * Calculate content similarity between two pages
 * Returns a score from 0 (completely different) to 1 (identical)
 */
export function calculateSimilarity(content1: string, content2: string): number {
  const tokens1 = tokenize(content1);
  const tokens2 = tokenize(content2);

  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

/**
 * Tokenize content for similarity analysis
 */
function tokenize(content: string): string[] {
  return content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 3); // Ignore short words
}

/**
 * Calculate keyword density
 */
export function calculateKeywordDensity(
  content: string,
  keywords: string[]
): Record<string, number> {
  const words = content.toLowerCase().split(/\s+/);
  const totalWords = words.length;

  const density: Record<string, number> = {};

  for (const keyword of keywords) {
    const keywordLower = keyword.toLowerCase();
    const count = words.filter((word) => word.includes(keywordLower)).length;
    density[keyword] = count / totalWords;
  }

  return density;
}

/**
 * Calculate readability score (Flesch Reading Ease approximation)
 */
export function calculateReadabilityScore(content: string): number {
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = content.split(/\s+/).filter((w) => w.trim().length > 0);
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);

  if (sentences.length === 0 || words.length === 0) {
    return 0;
  }

  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  // Flesch Reading Ease formula
  const score =
    206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

  // Normalize to 0-100
  return Math.max(0, Math.min(100, score));
}

/**
 * Count syllables in a word (simplified)
 */
function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;

  const vowels = word.match(/[aeiouy]+/g);
  return vowels ? vowels.length : 1;
}

/**
 * Estimate word count from text
 */
function estimateWordCount(text: string): number {
  return text.split(/\s+/).filter((word) => word.trim().length > 0).length;
}

// ============================================================================
// Template Interpolation
// ============================================================================

/**
 * Interpolate template with data
 *
 * @example
 * ```typescript
 * interpolate('Car Rental in {location}', { location: 'Dubai' })
 * // Returns: 'Car Rental in Dubai'
 * ```
 */
export function interpolate(
  template: string,
  data: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return data[key]?.toString() || match;
  });
}

/**
 * Hash string to number for consistent variation selection
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Format stat key for display
 */
function formatStatKey(key: string): string {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format stat value for display
 */
function formatStatValue(value: number | string): string {
  if (typeof value === 'string') return value;
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

// ============================================================================
// Content Validation
// ============================================================================

/**
 * Validate generated content meets quality standards
 */
export function validateGeneratedContent(content: GeneratedContent): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check word count
  if (content.wordCount !== undefined && content.wordCount < 800) {
    issues.push(`Content too short: ${content.wordCount} words (minimum: 800)`);
  }

  // Check section count
  if (content.sections.length < 4) {
    issues.push(
      `Too few sections: ${content.sections.length} (minimum: 4)`
    );
  }

  // Check keyword density
  let avgDensity = 0;
  if (content.keywordDensity !== undefined) {
    if (typeof content.keywordDensity === 'number') {
      avgDensity = content.keywordDensity;
    } else {
      const densityValues = Object.values(content.keywordDensity);
      avgDensity = densityValues.reduce((sum, val) => sum + val, 0) / densityValues.length;
    }
  }

  if (avgDensity < 0.01) {
    issues.push('Keyword density too low (target: 1-3%)');
  } else if (avgDensity > 0.05) {
    issues.push('Keyword density too high (target: 1-3%)');
  }

  // Check readability
  if (content.readabilityScore && content.readabilityScore < 40) {
    issues.push(
      `Content too difficult to read (score: ${content.readabilityScore})`
    );
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

// ============================================================================
// Exports
// ============================================================================

export { CONTENT_VARIATIONS, SECTION_TEMPLATES };
