/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://rentalfleetuae.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,

  // Custom priority and changefreq for specific pages
  transform: async (config, path) => {
    // High priority pages
    const priorityMap = {
      '/': 1.0,
      '/blog': 0.9,
      '/resources': 0.9,
      '/tools': 0.9,
      '/compare': 0.9,
      '/about': 0.8,
      '/contact': 0.8,
      '/privacy': 0.6,
      '/terms': 0.6,
      '/cookies': 0.5,
    };

    // Blog posts get special treatment
    const isBlogPost = path.startsWith('/blog/') && path !== '/blog';
    const isToolPage = path.startsWith('/tools/') && path !== '/tools';

    return {
      loc: path,
      changefreq: isBlogPost ? 'monthly' : config.changefreq,
      priority: priorityMap[path] || (isBlogPost ? 0.8 : isToolPage ? 0.85 : config.priority),
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    };
  },

  /**
   * Add dynamic/programmatic URLs to sitemap
   * (Next build may only pre-render a subset of params).
   */
  additionalPaths: async (config) => {
    const fs = require('fs');
    const path = require('path');

    const now = new Date().toISOString();

    /** @type {{ loc: string, lastmod?: string, changefreq?: string, priority?: number }[]} */
    const extra = [];

    // Always include key static pages even if not in build manifest
    for (const loc of ['/compare', '/cookies']) {
      extra.push({
        loc,
        lastmod: now,
        changefreq: 'weekly',
        priority: loc === '/compare' ? 0.9 : 0.5,
      });
    }

    // SEO keyword landing pages (programmatic)
    // Keep this JSON-backed so postbuild stays simple.
    const slugify = (text) =>
      String(text || '')
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();

    try {
      const seoKeywordsRaw = fs.readFileSync(
        path.join(process.cwd(), 'data', 'seo', 'keywords.json'),
        'utf8'
      );
      const seoKeywordsJson = JSON.parse(seoKeywordsRaw);
      const keywords = Array.isArray(seoKeywordsJson?.keywords) ? seoKeywordsJson.keywords : [];

      // Pages
      for (const kw of keywords) {
        const slug = slugify(kw);
        if (!slug) continue;
        extra.push({ loc: `/blog/${slug}`, lastmod: now, changefreq: 'weekly', priority: 0.78 });
      }
    } catch {
      // ignore if missing
    }

    // Programmatic entities from JSON data (safe in postbuild)
    const dataDir = path.join(process.cwd(), 'data', 'entities');
    const readEntities = (file) => {
      try {
        const raw = fs.readFileSync(path.join(dataDir, file), 'utf8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed?.entities) ? parsed.entities : [];
      } catch {
        return [];
      }
    };

    const emirates = readEntities('emirate.json');
    const vehicles = readEntities('vehicle.json');

    // Emirate hub pages
    for (const e of emirates) {
      if (!e?.slug) continue;
      extra.push({ loc: `/${e.slug}`, lastmod: now, changefreq: 'weekly', priority: 0.75 });
    }

    // Emirate + Vehicle spoke pages
    for (const e of emirates) {
      if (!e?.slug) continue;
      for (const v of vehicles) {
        if (!v?.slug) continue;
        extra.push({ loc: `/${e.slug}/${v.slug}`, lastmod: now, changefreq: 'weekly', priority: 0.7 });
      }
    }

    // Vehicle comparisons (limit to avoid huge sitemaps)
    const maxComparePairs = 50;
    let pairs = 0;
    for (let i = 0; i < vehicles.length; i++) {
      for (let j = i + 1; j < vehicles.length; j++) {
        if (pairs >= maxComparePairs) break;
        const a = vehicles[i]?.slug;
        const b = vehicles[j]?.slug;
        if (!a || !b) continue;
        extra.push({ loc: `/compare/${a}/${b}`, lastmod: now, changefreq: 'weekly', priority: 0.65 });
        pairs++;
      }
      if (pairs >= maxComparePairs) break;
    }

    return extra;
  },

  // Exclude these paths from sitemap
  exclude: [
    '/api/*',
    '/admin/*',
    '/404',
    '/_next/*',
    '/server-sitemap.xml',
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      // Be nice to search engine bots
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 0,
      },
      // Slow down aggressive crawlers
      {
        userAgent: 'AhrefsBot',
        crawlDelay: 10,
      },
      {
        userAgent: 'SemrushBot',
        crawlDelay: 10,
      },
    ],
    // Do not add additional sitemaps here unless you have a separate
    // non-next-sitemap sitemap URL (adding sitemap.xml here causes self-reference).
  },
};
