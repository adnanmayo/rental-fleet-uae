/**
 * Content Quality Validator
 *
 * Validates generated content to ensure it meets SEO and quality standards
 * before being published at scale.
 */

import { GeneratedContent, ProgrammaticEntity } from './types';
import { calculateKeywordDensity, calculateReadabilityScore, calculateSimilarity } from './content-generator';

export interface ValidationResult {
  valid: boolean;
  score: number; // 0-100
  issues: ValidationIssue[];
  warnings: ValidationWarning[];
  metrics: QualityMetrics;
}

export interface ValidationIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  message: string;
  fix?: string;
}

export interface ValidationWarning {
  type: string;
  message: string;
  suggestion?: string;
}

export interface QualityMetrics {
  wordCount: number;
  uniquenessScore: number;
  readabilityScore: number;
  keywordDensity: Record<string, number>;
  averageKeywordDensity: number;
  sectionCount: number;
  faqCount: number;
  internalLinkCount: number;
}

/**
 * Quality thresholds for validation
 */
const QUALITY_THRESHOLDS = {
  minWordCount: 500,
  idealWordCount: 800,
  maxWordCount: 3000,
  minUniqueness: 70,
  minReadability: 40,
  idealReadability: 60,
  minKeywordDensity: 0.005, // 0.5%
  maxKeywordDensity: 0.03, // 3%
  idealKeywordDensity: 0.015, // 1.5%
  minSections: 4,
  minFAQs: 3,
  minInternalLinks: 3,
  maxSimilarity: 0.3 // 30% similarity threshold
};

/**
 * Validate generated content
 */
export async function validateContent(
  content: GeneratedContent,
  entity: ProgrammaticEntity,
  options: {
    strictMode?: boolean;
    checkSimilarity?: boolean;
    existingContent?: string[];
  } = {}
): Promise<ValidationResult> {
  const { strictMode = false, checkSimilarity = false, existingContent = [] } = options;

  const issues: ValidationIssue[] = [];
  const warnings: ValidationWarning[] = [];

  // Calculate metrics
  const allContent = content.sections.map(s => s.content).join(' ');
  const keywordDensity =
    typeof content.keywordDensity === 'object' && content.keywordDensity !== null
      ? content.keywordDensity
      : {};
  const metrics: QualityMetrics = {
    wordCount: content.wordCount || estimateWordCount(allContent),
    uniquenessScore: content.uniquenessScore || 100,
    readabilityScore: content.readabilityScore || calculateReadabilityScore(allContent),
    keywordDensity,
    averageKeywordDensity: calculateAverageKeywordDensity(keywordDensity),
    sectionCount: content.sections.length,
    faqCount: content.sections.filter(s => s.type === 'faq' || s.id === 'faq').length,
    internalLinkCount: countInternalLinks(allContent)
  };

  // Validate word count
  validateWordCount(metrics.wordCount, issues, warnings, strictMode);

  // Validate uniqueness
  validateUniqueness(metrics.uniquenessScore, issues, warnings);

  // Validate readability
  validateReadability(metrics.readabilityScore, issues, warnings);

  // Validate keyword density
  validateKeywordDensity(metrics.averageKeywordDensity, metrics.keywordDensity, issues, warnings, strictMode);

  // Validate structure
  validateStructure(metrics, issues, warnings, strictMode);

  // Check for duplicate content
  if (checkSimilarity && existingContent.length > 0) {
    validateSimilarity(allContent, existingContent, issues, warnings);
  }

  // Check for keyword stuffing
  validateKeywordStuffing(allContent, entity.seo.keywords, issues, warnings);

  // Check for thin content
  validateThinContent(content.sections, issues, warnings);

  // Calculate overall score
  const score = calculateOverallScore(metrics, issues);

  return {
    valid: issues.filter(i => i.severity === 'critical' || i.severity === 'high').length === 0,
    score,
    issues,
    warnings,
    metrics
  };
}

/**
 * Validate word count
 */
function validateWordCount(
  wordCount: number,
  issues: ValidationIssue[],
  warnings: ValidationWarning[],
  strictMode: boolean
): void {
  if (wordCount < QUALITY_THRESHOLDS.minWordCount) {
    issues.push({
      severity: strictMode ? 'critical' : 'high',
      type: 'word-count',
      message: `Content too short: ${wordCount} words (minimum: ${QUALITY_THRESHOLDS.minWordCount})`,
      fix: 'Add more detailed information, examples, or expand existing sections'
    });
  } else if (wordCount < QUALITY_THRESHOLDS.idealWordCount) {
    warnings.push({
      type: 'word-count',
      message: `Content below ideal length: ${wordCount} words (ideal: ${QUALITY_THRESHOLDS.idealWordCount})`,
      suggestion: 'Consider adding more details or examples to reach ideal word count'
    });
  } else if (wordCount > QUALITY_THRESHOLDS.maxWordCount) {
    warnings.push({
      type: 'word-count',
      message: `Content very long: ${wordCount} words (maximum: ${QUALITY_THRESHOLDS.maxWordCount})`,
      suggestion: 'Consider breaking into multiple pages or removing redundant information'
    });
  }
}

/**
 * Validate uniqueness score
 */
function validateUniqueness(
  uniquenessScore: number,
  issues: ValidationIssue[],
  warnings: ValidationWarning[]
): void {
  if (uniquenessScore < QUALITY_THRESHOLDS.minUniqueness) {
    issues.push({
      severity: 'high',
      type: 'uniqueness',
      message: `Content not unique enough: ${uniquenessScore}% (minimum: ${QUALITY_THRESHOLDS.minUniqueness}%)`,
      fix: 'Use different template variants or add more entity-specific content'
    });
  } else if (uniquenessScore < 85) {
    warnings.push({
      type: 'uniqueness',
      message: `Uniqueness score could be improved: ${uniquenessScore}%`,
      suggestion: 'Add more unique details or examples specific to this entity'
    });
  }
}

/**
 * Validate readability
 */
function validateReadability(
  readabilityScore: number,
  issues: ValidationIssue[],
  warnings: ValidationWarning[]
): void {
  if (readabilityScore < QUALITY_THRESHOLDS.minReadability) {
    issues.push({
      severity: 'medium',
      type: 'readability',
      message: `Content too difficult to read: ${readabilityScore.toFixed(1)} (minimum: ${QUALITY_THRESHOLDS.minReadability})`,
      fix: 'Use shorter sentences, simpler words, and break up long paragraphs'
    });
  } else if (readabilityScore < QUALITY_THRESHOLDS.idealReadability) {
    warnings.push({
      type: 'readability',
      message: `Readability below ideal: ${readabilityScore.toFixed(1)} (ideal: ${QUALITY_THRESHOLDS.idealReadability})`,
      suggestion: 'Consider simplifying complex sentences for better readability'
    });
  }
}

/**
 * Validate keyword density
 */
function validateKeywordDensity(
  avgDensity: number,
  densityMap: Record<string, number>,
  issues: ValidationIssue[],
  warnings: ValidationWarning[],
  strictMode: boolean
): void {
  if (avgDensity < QUALITY_THRESHOLDS.minKeywordDensity) {
    const severity = strictMode ? 'high' : 'medium';
    issues.push({
      severity,
      type: 'keyword-density',
      message: `Keyword density too low: ${(avgDensity * 100).toFixed(2)}% (minimum: ${(QUALITY_THRESHOLDS.minKeywordDensity * 100).toFixed(1)}%)`,
      fix: 'Naturally incorporate target keywords throughout the content'
    });
  } else if (avgDensity > QUALITY_THRESHOLDS.maxKeywordDensity) {
    issues.push({
      severity: 'high',
      type: 'keyword-density',
      message: `Keyword density too high: ${(avgDensity * 100).toFixed(2)}% (maximum: ${(QUALITY_THRESHOLDS.maxKeywordDensity * 100).toFixed(1)}%)`,
      fix: 'Reduce keyword usage to avoid appearing spammy to search engines'
    });
  } else if (avgDensity < QUALITY_THRESHOLDS.idealKeywordDensity * 0.7) {
    warnings.push({
      type: 'keyword-density',
      message: `Keyword density below ideal: ${(avgDensity * 100).toFixed(2)}%`,
      suggestion: 'Consider adding keywords naturally in a few more places'
    });
  }

  // Check individual keywords
  for (const [keyword, density] of Object.entries(densityMap)) {
    if (density > 0.05) {
      // 5% for a single keyword is too much
      warnings.push({
        type: 'keyword-overuse',
        message: `Keyword "${keyword}" used too frequently: ${(density * 100).toFixed(2)}%`,
        suggestion: 'Use synonyms or related terms instead of repeating this keyword'
      });
    }
  }
}

/**
 * Validate content structure
 */
function validateStructure(
  metrics: QualityMetrics,
  issues: ValidationIssue[],
  warnings: ValidationWarning[],
  strictMode: boolean
): void {
  if (metrics.sectionCount < QUALITY_THRESHOLDS.minSections) {
    issues.push({
      severity: strictMode ? 'high' : 'medium',
      type: 'structure',
      message: `Too few sections: ${metrics.sectionCount} (minimum: ${QUALITY_THRESHOLDS.minSections})`,
      fix: 'Add more sections like Benefits, Features, FAQs, or Comparison'
    });
  }

  if (metrics.faqCount < 1) {
    warnings.push({
      type: 'structure',
      message: 'No FAQ section found',
      suggestion: 'Add FAQs to answer common questions and improve SEO'
    });
  }

  if (metrics.internalLinkCount < QUALITY_THRESHOLDS.minInternalLinks) {
    warnings.push({
      type: 'internal-links',
      message: `Few internal links: ${metrics.internalLinkCount} (minimum: ${QUALITY_THRESHOLDS.minInternalLinks})`,
      suggestion: 'Add more internal links to related pages for better SEO and user experience'
    });
  }
}

/**
 * Validate similarity with existing content
 */
function validateSimilarity(
  content: string,
  existingContent: string[],
  issues: ValidationIssue[],
  warnings: ValidationWarning[]
): void {
  for (let i = 0; i < existingContent.length; i++) {
    const similarity = calculateSimilarity(content, existingContent[i]);

    if (similarity > QUALITY_THRESHOLDS.maxSimilarity) {
      issues.push({
        severity: 'high',
        type: 'duplicate',
        message: `Content too similar to existing page ${i + 1}: ${(similarity * 100).toFixed(1)}% similarity`,
        fix: 'Use different template variant or add more unique entity-specific content'
      });
      break; // Only report first duplicate
    } else if (similarity > 0.2) {
      warnings.push({
        type: 'similarity',
        message: `Content somewhat similar to existing page ${i + 1}: ${(similarity * 100).toFixed(1)}% similarity`,
        suggestion: 'Consider adding more unique content to differentiate this page'
      });
    }
  }
}

/**
 * Validate keyword stuffing
 */
function validateKeywordStuffing(
  content: string,
  keywords: string[],
  issues: ValidationIssue[],
  warnings: ValidationWarning[]
): void {
  const sentences = content.split(/[.!?]+/);

  for (const sentence of sentences) {
    const sentenceLower = sentence.toLowerCase();
    let keywordCount = 0;

    for (const keyword of keywords) {
      const keywordLower = keyword.toLowerCase();
      const matches = sentenceLower.match(new RegExp(keywordLower, 'g'));
      if (matches) {
        keywordCount += matches.length;
      }
    }

    const sentenceWords = sentence.split(/\s+/).length;
    if (sentenceWords > 5 && keywordCount >= 3) {
      issues.push({
        severity: 'medium',
        type: 'keyword-stuffing',
        message: 'Potential keyword stuffing detected in sentence',
        fix: 'Rewrite sentence to use keywords more naturally'
      });
      break; // Only report first instance
    }
  }
}

/**
 * Validate thin content sections
 */
function validateThinContent(
  sections: any[],
  issues: ValidationIssue[],
  warnings: ValidationWarning[]
): void {
  for (const section of sections) {
    const wordCount = estimateWordCount(section.content);

    if (section.type === 'text' && wordCount < 50 && section.id !== 'cta') {
      warnings.push({
        type: 'thin-content',
        message: `Section "${section.title || section.id}" is very short: ${wordCount} words`,
        suggestion: 'Add more detail to this section or consider merging with another section'
      });
    }
  }
}

/**
 * Calculate overall quality score
 */
function calculateOverallScore(
  metrics: QualityMetrics,
  issues: ValidationIssue[]
): number {
  let score = 100;

  // Deduct points for issues
  for (const issue of issues) {
    switch (issue.severity) {
      case 'critical':
        score -= 25;
        break;
      case 'high':
        score -= 15;
        break;
      case 'medium':
        score -= 10;
        break;
      case 'low':
        score -= 5;
        break;
    }
  }

  // Bonus points for good metrics
  if (metrics.wordCount >= QUALITY_THRESHOLDS.idealWordCount) {
    score += 5;
  }

  if (metrics.uniquenessScore >= 90) {
    score += 5;
  }

  if (metrics.readabilityScore >= QUALITY_THRESHOLDS.idealReadability) {
    score += 5;
  }

  if (
    metrics.averageKeywordDensity >= QUALITY_THRESHOLDS.idealKeywordDensity * 0.8 &&
    metrics.averageKeywordDensity <= QUALITY_THRESHOLDS.idealKeywordDensity * 1.2
  ) {
    score += 5;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Helper: Calculate average keyword density
 */
function calculateAverageKeywordDensity(densityMap: Record<string, number>): number {
  const values = Object.values(densityMap);
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Helper: Count internal links in content
 */
function countInternalLinks(content: string): number {
  // Count markdown links and HTML links
  const markdownLinks = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
  const htmlLinks = content.match(/<a\s+href="([^"]+)"/g) || [];
  return markdownLinks.length + htmlLinks.length;
}

/**
 * Helper: Estimate word count
 */
function estimateWordCount(text: string): number {
  return text.split(/\s+/).filter(word => word.trim().length > 0).length;
}

/**
 * Batch validate multiple pages
 */
export async function batchValidate(
  pages: Array<{
    content: GeneratedContent;
    entity: ProgrammaticEntity;
  }>,
  options: {
    strictMode?: boolean;
    parallelLimit?: number;
  } = {}
): Promise<Array<ValidationResult & { entityId: string }>> {
  const { strictMode = false, parallelLimit = 10 } = options;
  const results: Array<ValidationResult & { entityId: string }> = [];
  const existingContent: string[] = [];

  // Process in batches
  for (let i = 0; i < pages.length; i += parallelLimit) {
    const batch = pages.slice(i, i + parallelLimit);

    const batchResults = await Promise.all(
      batch.map(async ({ content, entity }) => {
        const result = await validateContent(content, entity, {
          strictMode,
          checkSimilarity: true,
          existingContent
        });

        // Add to existing content for similarity checks
        const allContent = content.sections.map(s => s.content).join(' ');
        existingContent.push(allContent);

        return {
          ...result,
          entityId: entity.id
        };
      })
    );

    results.push(...batchResults);
  }

  return results;
}

/**
 * Generate validation report
 */
export function generateValidationReport(
  results: Array<ValidationResult & { entityId?: string }>
): {
  summary: {
    total: number;
    valid: number;
    invalid: number;
    averageScore: number;
  };
  issueBreakdown: Record<string, number>;
  recommendedActions: string[];
} {
  const summary = {
    total: results.length,
    valid: results.filter(r => r.valid).length,
    invalid: results.filter(r => !r.valid).length,
    averageScore: results.reduce((sum, r) => sum + r.score, 0) / results.length
  };

  const issueBreakdown: Record<string, number> = {};
  const allIssues = results.flatMap(r => r.issues);

  for (const issue of allIssues) {
    issueBreakdown[issue.type] = (issueBreakdown[issue.type] || 0) + 1;
  }

  // Generate recommendations
  const recommendedActions: string[] = [];

  if (summary.invalid > summary.total * 0.2) {
    recommendedActions.push(`${summary.invalid} pages failed validation - review template configurations`);
  }

  const topIssues = Object.entries(issueBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  for (const [type, count] of topIssues) {
    if (count > results.length * 0.1) {
      recommendedActions.push(`Common issue: ${type} (${count} occurrences) - review content generation logic`);
    }
  }

  if (summary.averageScore < 70) {
    recommendedActions.push('Average quality score is low - consider improving content templates');
  }

  return {
    summary,
    issueBreakdown,
    recommendedActions
  };
}
