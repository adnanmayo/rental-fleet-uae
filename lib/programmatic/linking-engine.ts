/**
 * Intelligent Internal Linking Engine
 *
 * Manages automatic internal link generation for programmatic pages
 * with contextual relevance scoring and SEO optimization.
 *
 * @module lib/programmatic/linking-engine
 * @version 2.0
 */

import type {
  ProgrammaticEntity,
  EntityType,
  InternalLink,
  LinkType,
  GenerationContext,
  LinkingStrategy,
  LinkingRules,
} from './types';
import { entityRegistry } from './entities';

// ============================================================================
// Configuration
// ============================================================================

/**
 * Default linking strategy
 */
const DEFAULT_LINKING_STRATEGY: LinkingStrategy = {
  hub: {
    linkTo: ['child', 'related', 'sibling'],
    maxLinks: 50,
    minLinks: 10,
    distribution: 'balanced',
    contextual: true,
  },
  spoke: {
    linkTo: ['parent', 'sibling', 'related'],
    maxLinks: 20,
    minLinks: 5,
    distribution: 'relevance',
    contextual: true,
  },
  comparison: {
    linkTo: ['parent', 'related', 'sibling'],
    maxLinks: 15,
    minLinks: 8,
    distribution: 'balanced',
    contextual: true,
  },
  directory: {
    linkTo: ['child', 'related'],
    maxLinks: 100,
    minLinks: 20,
    distribution: 'priority',
    contextual: false,
  },
};

/**
 * Anchor text templates for different link types
 */
const ANCHOR_TEMPLATES = {
  parent: [
    '{name}',
    'Browse {name}',
    'See all in {name}',
    'Explore {name}',
  ],
  child: [
    '{name}',
    'View {name}',
    '{name} details',
    'Learn about {name}',
  ],
  sibling: [
    '{name}',
    'Also check {name}',
    'Compare with {name}',
    'Similar: {name}',
  ],
  related: [
    '{name}',
    'Related: {name}',
    'More about {name}',
    'See {name}',
  ],
  breadcrumb: [
    '{name}',
  ],
  contextual: [
    '{name}',
    '{name} rental',
    'rent a {name}',
    '{name} in {location}',
  ],
};

// ============================================================================
// Main Linking Functions
// ============================================================================

/**
 * Generate internal links for a page
 *
 * @example
 * ```typescript
 * const links = generateInternalLinks({
 *   primary: dubaiEntity,
 *   secondary: [luxuryCarEntity],
 *   template: hubTemplate
 * });
 * ```
 */
export async function generateInternalLinks(
  context: GenerationContext,
  strategy?: LinkingStrategy
): Promise<InternalLink[]> {
  const activeStrategy = strategy || DEFAULT_LINKING_STRATEGY;
  const pageType = determinePageType(context);

  // Get linking rules for this page type
  const rules = activeStrategy[pageType as keyof LinkingStrategy];
  if (!rules) {
    return [];
  }

  // Generate links based on rules
  const links: InternalLink[] = [];

  // Parent links
  if (rules.linkTo.includes('parent')) {
    links.push(...generateParentLinks(context));
  }

  // Child links
  if (rules.linkTo.includes('child')) {
    links.push(...(await generateChildLinks(context, rules)));
  }

  // Sibling links
  if (rules.linkTo.includes('sibling')) {
    links.push(...(await generateSiblingLinks(context, rules)));
  }

  // Related links
  if (rules.linkTo.includes('related')) {
    links.push(...(await generateRelatedLinks(context, rules)));
  }

  // Contextual links (embedded in content)
  if (rules.contextual) {
    links.push(...(await generateContextualLinks(context, rules)));
  }

  // Score and sort links by relevance
  const scoredLinks = links.map((link) => ({
    ...link,
    relevance: calculateLinkRelevance(link, context),
  }));

  // Sort by relevance
  scoredLinks.sort((a, b) => b.relevance - a.relevance);

  // Apply limits
  const limitedLinks = applyLinkLimits(scoredLinks, rules);

  // Deduplicate
  return deduplicateLinks(limitedLinks);
}

// ============================================================================
// Link Generation by Type
// ============================================================================

/**
 * Generate parent (hub) links
 */
function generateParentLinks(context: GenerationContext): InternalLink[] {
  const { primary, secondary } = context;
  const links: InternalLink[] = [];

  // Link to primary entity hub
  links.push({
    url: `/${primary.slug}`,
    text: generateAnchorText('parent', primary, context),
    type: 'parent',
    relevance: 1.0,
    position: 'breadcrumb',
  });

  // Link to home
  links.push({
    url: '/',
    text: 'Home',
    type: 'parent',
    relevance: 0.9,
    position: 'breadcrumb',
  });

  // If there's a secondary entity, link to its hub too
  if (secondary && secondary.length > 0) {
    links.push({
      url: `/${secondary[0].slug}`,
      text: generateAnchorText('parent', secondary[0], context),
      type: 'parent',
      relevance: 0.95,
      position: 'sidebar',
    });
  }

  return links;
}

/**
 * Generate child (spoke) links
 */
async function generateChildLinks(
  context: GenerationContext,
  rules: LinkingRules
): Promise<InternalLink[]> {
  const { primary } = context;
  const links: InternalLink[] = [];

  // Get related entities that can be children
  const childTypes = getChildEntityTypes(primary.type);

  for (const childType of childTypes) {
    const children = await entityRegistry.getByType(childType);

    // Limit children based on priority
    const priorityChildren = children
      .filter((child) => child.active !== false)
      .sort((a, b) => (b.priority || 5) - (a.priority || 5))
      .slice(0, Math.min(children.length, Math.floor(rules.maxLinks / 2)));

    for (const child of priorityChildren) {
      links.push({
        url: `/${primary.slug}/${child.slug}`,
        text: generateAnchorText('child', child, context),
        type: 'child',
        relevance: 0.8,
        position: 'body',
      });
    }
  }

  return links;
}

/**
 * Generate sibling links (same level, related entities)
 */
async function generateSiblingLinks(
  context: GenerationContext,
  rules: LinkingRules
): Promise<InternalLink[]> {
  const { primary, secondary } = context;
  const links: InternalLink[] = [];

  // Get siblings of primary entity
  const siblings = (await entityRegistry.getByType(primary.type)).filter(
    (entity) => entity.id !== primary.id && entity.active !== false
  );

  // Sort by priority and similarity
  const sortedSiblings = siblings
    .map((sibling) => ({
      entity: sibling,
      similarity: calculateEntitySimilarity(primary, sibling),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, Math.min(siblings.length, 8));

  for (const { entity: sibling } of sortedSiblings) {
    const url = secondary && secondary[0]
      ? `/${sibling.slug}/${secondary[0].slug}`
      : `/${sibling.slug}`;

    links.push({
      url,
      text: generateAnchorText('sibling', sibling, context),
      type: 'sibling',
      relevance: 0.7,
      position: 'sidebar',
    });
  }

  // Get siblings of secondary entity if present
  if (secondary && secondary[0]) {
    const secondarySiblings = (await entityRegistry.getByType(secondary[0].type))
      .filter((entity) => entity.id !== secondary[0].id && entity.active !== false)
      .slice(0, 5);

    for (const sibling of secondarySiblings) {
      links.push({
        url: `/${primary.slug}/${sibling.slug}`,
        text: generateAnchorText('sibling', sibling, context),
        type: 'sibling',
        relevance: 0.75,
        position: 'body',
      });
    }
  }

  return links;
}

/**
 * Generate related entity links
 */
async function generateRelatedLinks(
  context: GenerationContext,
  rules: LinkingRules
): Promise<InternalLink[]> {
  const { primary, secondary } = context;
  const links: InternalLink[] = [];

  // Get explicitly related entities
  const relatedEntities = await entityRegistry.getRelated(primary.id);

  for (const related of relatedEntities.slice(0, 10)) {
    links.push({
      url: buildEntityURL(related, secondary),
      text: generateAnchorText('related', related, context),
      type: 'related',
      relevance: 0.6,
      position: 'sidebar',
    });
  }

  // Get implicitly related entities (same keywords)
  const keywordMatches = await findEntitiesByKeywordOverlap(primary, 3);

  for (const match of keywordMatches.slice(0, 5)) {
    if (match.entity.id !== primary.id && !relatedEntities.find(r => r.id === match.entity.id)) {
      links.push({
        url: buildEntityURL(match.entity, secondary),
        text: generateAnchorText('related', match.entity, context),
        type: 'related',
        relevance: 0.5,
        position: 'body',
      });
    }
  }

  return links;
}

/**
 * Generate contextual links (embedded in content)
 */
async function generateContextualLinks(
  context: GenerationContext,
  rules: LinkingRules
): Promise<InternalLink[]> {
  const { primary, secondary } = context;
  const links: InternalLink[] = [];

  // Get high-priority entities to mention
  const topEntities = (await entityRegistry.getAll())
    .filter((entity: ProgrammaticEntity) => entity.active !== false)
    .filter((entity) => entity.id !== primary.id)
    .sort((a, b) => (b.priority || 5) - (a.priority || 5))
    .slice(0, 10);

  for (const entity of topEntities) {
    // Only add if entity type makes sense in context
    if (isContextuallyRelevant(entity, context)) {
      links.push({
        url: buildEntityURL(entity),
        text: generateAnchorText('contextual', entity, context),
        type: 'contextual',
        relevance: 0.65,
        position: 'body',
      });
    }
  }

  return links;
}

// ============================================================================
// Relevance Scoring
// ============================================================================

/**
 * Calculate link relevance score (0-1)
 */
function calculateLinkRelevance(
  link: InternalLink,
  context: GenerationContext
): number {
  let score = link.relevance;

  // Boost parent links
  if (link.type === 'parent') {
    score += 0.2;
  }

  // Boost links in body content
  if (link.position === 'body') {
    score += 0.1;
  }

  // Boost contextual links
  if (link.type === 'contextual') {
    score += 0.05;
  }

  return Math.min(1.0, score);
}

/**
 * Calculate similarity between two entities
 */
function calculateEntitySimilarity(
  entity1: ProgrammaticEntity,
  entity2: ProgrammaticEntity
): number {
  let score = 0;

  // Same type bonus
  if (entity1.type === entity2.type) {
    score += 0.3;
  }

  // Keyword overlap
  const keywords1 = new Set(entity1.seo.keywords);
  const keywords2 = new Set(entity2.seo.keywords);
  const overlap = new Set([...keywords1].filter((k) => keywords2.has(k)));
  score += (overlap.size / Math.max(keywords1.size, keywords2.size)) * 0.4;

  // Feature overlap
  if (entity1.metadata.features && entity2.metadata.features) {
    const features1 = new Set(entity1.metadata.features);
    const features2 = new Set(entity2.metadata.features);
    const featureOverlap = new Set([...features1].filter((f) => features2.has(f)));
    score += (featureOverlap.size / Math.max(features1.size, features2.size)) * 0.3;
  }

  return score;
}

/**
 * Find entities with keyword overlap
 */
async function findEntitiesByKeywordOverlap(
  entity: ProgrammaticEntity,
  minOverlap: number
): Promise<Array<{ entity: ProgrammaticEntity; overlap: number }>> {
  const entityKeywords = new Set(entity.seo.keywords);
  const matches: Array<{ entity: ProgrammaticEntity; overlap: number }> = [];

  for (const candidate of await entityRegistry.getAll()) {
    if (candidate.id === entity.id) continue;

    const candidateKeywords = new Set(candidate.seo.keywords);
    const overlap = new Set([...entityKeywords].filter((k) => candidateKeywords.has(k)));

    if (overlap.size >= minOverlap) {
      matches.push({
        entity: candidate,
        overlap: overlap.size,
      });
    }
  }

  return matches.sort((a, b) => b.overlap - a.overlap);
}

/**
 * Check if entity is contextually relevant
 */
function isContextuallyRelevant(
  entity: ProgrammaticEntity,
  context: GenerationContext
): boolean {
  const { primary, intent } = context;

  // Same type entities are always relevant
  if (entity.type === primary.type) {
    return true;
  }

  // Vehicle types are relevant to location pages
  if (primary.type === 'emirate' && entity.type === 'vehicle') {
    return true;
  }

  // Locations are relevant to vehicle pages
  if (primary.type === 'vehicle' && entity.type === 'emirate') {
    return true;
  }

  // Services are relevant if intent matches
  if (entity.type === 'service' && intent) {
    return entity.seo.keywords.some((k) =>
      k.toLowerCase().includes(intent.type)
    );
  }

  return false;
}

// ============================================================================
// Anchor Text Generation
// ============================================================================

/**
 * Generate anchor text for a link
 */
function generateAnchorText(
  linkType: LinkType,
  entity: ProgrammaticEntity,
  context: GenerationContext
): string {
  const templates = ANCHOR_TEMPLATES[linkType] || ANCHOR_TEMPLATES.related;

  // Select template based on entity hash for consistency
  const hash = hashString(entity.id + context.primary.id);
  const templateIndex = hash % templates.length;
  const template = templates[templateIndex];

  // Build interpolation data
  const data: Record<string, string> = {
    name: entity.name,
    location: context.primary.type === 'emirate' ? context.primary.name : '',
  };

  return interpolate(template, data);
}

/**
 * Interpolate anchor text template
 */
function interpolate(
  template: string,
  data: Record<string, string>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return data[key] || match;
  });
}

// ============================================================================
// URL Building
// ============================================================================

/**
 * Build URL for an entity
 */
function buildEntityURL(
  entity: ProgrammaticEntity,
  secondary?: ProgrammaticEntity[]
): string {
  let url = `/${entity.slug}`;

  if (secondary && secondary.length > 0) {
    url += `/${secondary[0].slug}`;
  }

  return url;
}

// ============================================================================
// Link Management
// ============================================================================

/**
 * Apply link limits based on rules
 */
function applyLinkLimits(
  links: InternalLink[],
  rules: LinkingRules
): InternalLink[] {
  const { maxLinks, minLinks = 0, distribution = 'relevance' } = rules;

  if (links.length <= maxLinks) {
    return links;
  }

  // Apply distribution strategy
  switch (distribution) {
    case 'balanced':
      return balancedDistribution(links, maxLinks);

    case 'priority':
      return priorityDistribution(links, maxLinks);

    case 'relevance':
    default:
      return links.slice(0, maxLinks);
  }
}

/**
 * Balanced distribution across link types
 */
function balancedDistribution(
  links: InternalLink[],
  maxLinks: number
): InternalLink[] {
  const byType = new Map<LinkType, InternalLink[]>();

  for (const link of links) {
    const typeLinks = byType.get(link.type) || [];
    typeLinks.push(link);
    byType.set(link.type, typeLinks);
  }

  const perType = Math.ceil(maxLinks / byType.size);
  const result: InternalLink[] = [];

  for (const typeLinks of byType.values()) {
    result.push(...typeLinks.slice(0, perType));
  }

  return result.slice(0, maxLinks);
}

/**
 * Priority-based distribution
 */
function priorityDistribution(
  links: InternalLink[],
  maxLinks: number
): InternalLink[] {
  // Ensure critical link types are included
  const critical = links.filter((l) => l.type === 'parent' || l.type === 'breadcrumb');
  const remaining = links.filter((l) => l.type !== 'parent' && l.type !== 'breadcrumb');

  const availableSlots = maxLinks - critical.length;
  return [...critical, ...remaining.slice(0, availableSlots)];
}

/**
 * Deduplicate links by URL
 */
function deduplicateLinks(links: InternalLink[]): InternalLink[] {
  const seen = new Set<string>();
  const unique: InternalLink[] = [];

  for (const link of links) {
    if (!seen.has(link.url)) {
      seen.add(link.url);
      unique.push(link);
    }
  }

  return unique;
}

// ============================================================================
// Link Analysis
// ============================================================================

/**
 * Analyze link graph for a page
 */
export async function analyzeLinkGraph(context: GenerationContext): Promise<{
  inboundCount: number;
  outboundCount: number;
  internalPageRank: number;
  linkTypes: Record<LinkType, number>;
}> {
  const links = await generateInternalLinks(context);

  const linkTypes: Record<string, number> = {};
  for (const link of links) {
    linkTypes[link.type] = (linkTypes[link.type] || 0) + 1;
  }

  // Calculate simple page rank (based on priority and relationships)
  const pageRank = await calculateSimplePageRank(context.primary);

  return {
    inboundCount: await countInboundLinks(context.primary),
    outboundCount: links.length,
    internalPageRank: pageRank,
    linkTypes: linkTypes as Record<LinkType, number>,
  };
}

/**
 * Count inbound links to an entity
 */
async function countInboundLinks(entity: ProgrammaticEntity): Promise<number> {
  let count = 0;

  for (const candidate of await entityRegistry.getAll()) {
    if (candidate.relationships) {
      for (const rel of candidate.relationships) {
        if (rel.entityId === entity.id) {
          count++;
        }
      }
    }
  }

  return count;
}

/**
 * Calculate simple page rank
 */
async function calculateSimplePageRank(entity: ProgrammaticEntity): Promise<number> {
  const priority = entity.priority || 5;
  const inboundCount = await countInboundLinks(entity);
  const relationshipCount = entity.relationships?.length || 0;

  // Simple formula: (priority * 0.4) + (inbound * 0.4) + (relationships * 0.2)
  const normalized = (priority / 10) * 0.4 +
                     Math.min(inboundCount / 20, 1) * 0.4 +
                     Math.min(relationshipCount / 10, 1) * 0.2;

  return normalized;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Determine page type from context
 */
function determinePageType(context: GenerationContext): string {
  const { primary, secondary } = context;

  if (!secondary || secondary.length === 0) {
    return 'hub';
  }

  if (secondary.length > 1) {
    return 'comparison';
  }

  return 'spoke';
}

/**
 * Get child entity types for a parent type
 */
function getChildEntityTypes(parentType: EntityType): EntityType[] {
  const childMap: Partial<Record<EntityType, EntityType[]>> = {
    emirate: ['vehicle', 'service'],
    vehicle: ['service'],
    service: [],
    location: ['vehicle', 'service'],
    intent: [],
  };

  return childMap[parentType] || [];
}

/**
 * Hash string for consistent selection
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

// ============================================================================
// Exports
// ============================================================================

export {
  DEFAULT_LINKING_STRATEGY,
  ANCHOR_TEMPLATES,
  type LinkingStrategy,
  type LinkingRules,
};
