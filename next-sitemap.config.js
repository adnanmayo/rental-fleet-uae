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
      '/about': 0.8,
      '/contact': 0.8,
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
    additionalSitemaps: [
      'https://rentalfleetuae.com/sitemap.xml',
    ],
  },
};
