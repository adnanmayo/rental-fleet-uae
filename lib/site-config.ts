// Site Configuration for rentalfleetuae.com
// SEO-optimized settings for backlink hub strategy

export const siteConfig = {
  name: "Rental Fleet UAE",
  domain: "rentalfleetuae.com",
  url: "https://rentalfleetuae.com",
  description: "Empowering UAE Rental Businesses: Expert insights, fleet management tools, and comprehensive resources for car rental businesses in the United Arab Emirates",
  tagline: "Your Complete Resource for UAE Rental Business Success",

  // Primary Keywords for SEO
  primaryKeywords: [
    "UAE rental business",
    "fleet management UAE",
    "car rental Dubai",
    "rental business software",
    "UAE car rental tips",
    "fleet optimization UAE"
  ],

  // Promoted Sites - Internal Link Targets
  promotedSites: {
    autycloud: {
      url: "https://autycloud.com",
      name: "AutyCloud",
      description: "Cloud-based fleet management software for UAE rental businesses",
      anchor: "fleet management software"
    },
    adnanRentals: {
      url: "https://adnanrentals.com",
      name: "Adnan Rentals",
      description: "Premium car rental services across UAE",
      anchor: "car rental services"
    }
  },

  // Contact Information
  contact: {
    email: "info@rentalfleetuae.com",
    phone: "+971 XX XXX XXXX",
    address: "Dubai, United Arab Emirates"
  },

  // Social Media (for social sharing)
  social: {
    twitter: "@rentalfleetuae",
    linkedin: "company/rental-fleet-uae",
    facebook: "rentalfleetuae",
    instagram: "@rentalfleetuae"
  },

  // SEO Settings
  seo: {
    defaultTitle: "Rental Fleet UAE - Expert Resources for UAE Rental Businesses",
    titleTemplate: "%s | Rental Fleet UAE",
    defaultDescription: "Comprehensive guides, fleet management tools, and industry insights for UAE car rental businesses. Learn best practices, optimize operations, and grow your rental business.",
    siteLanguage: "en-US",
    ogLanguage: "en_US",
    author: "Rental Fleet UAE Team",

    // Open Graph Images
    ogImage: {
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Rental Fleet UAE - Expert Resources for Rental Businesses"
    }
  },

  // Navigation Links
  navigation: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Resources", href: "/resources" },
    { name: "Blog", href: "/blog" },
    { name: "Tools", href: "/tools" },
    { name: "Contact", href: "/contact" }
  ],

  // Footer Links organized by column
  footerLinks: {
    resources: {
      title: "Resources",
      links: [
        { name: "Fleet Management Guide", href: "/resources/fleet-management" },
        { name: "Rental Business Tips", href: "/blog" },
        { name: "Free Tools", href: "/tools" },
        { name: "UAE Regulations", href: "/resources/regulations" }
      ]
    },
    partners: {
      title: "Our Partners",
      links: [
        { name: "AutyCloud Software", href: "https://autycloud.com", external: true },
        { name: "Adnan Rentals", href: "https://adnanrentals.com", external: true }
      ]
    },
    company: {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Media Kit", href: "/about#media-kit" },
        { name: "Collaborate", href: "/contact#collaborate" }
      ]
    },
    legal: {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" }
      ]
    }
  }
};

// Blog Categories for SEO
export const blogCategories = [
  {
    slug: "fleet-tech",
    name: "Fleet Technology",
    description: "Latest technology and software solutions for fleet management",
    keywords: ["fleet management software", "rental technology", "automation"]
  },
  {
    slug: "rental-tips",
    name: "Rental Tips",
    description: "Best practices and tips for running a successful rental business",
    keywords: ["rental business tips", "car rental strategies", "business growth"]
  },
  {
    slug: "uae-business",
    name: "UAE Business",
    description: "UAE-specific business insights, regulations, and market trends",
    keywords: ["UAE business", "Dubai regulations", "rental market UAE"]
  },
  {
    slug: "customer-experience",
    name: "Customer Experience",
    description: "Enhancing customer satisfaction in rental services",
    keywords: ["customer service", "rental experience", "client satisfaction"]
  },
  {
    slug: "operations",
    name: "Operations",
    description: "Operational efficiency and fleet optimization strategies",
    keywords: ["fleet optimization", "operational efficiency", "cost reduction"]
  }
];

// Schema.org structured data helpers
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": siteConfig.name,
  "url": siteConfig.url,
  "logo": `${siteConfig.url}/logo.png`,
  "description": siteConfig.description,
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "AE",
    "addressRegion": "Dubai"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "email": siteConfig.contact.email
  },
  "sameAs": [
    `https://twitter.com/${siteConfig.social.twitter.replace('@', '')}`,
    `https://linkedin.com/${siteConfig.social.linkedin}`,
    `https://facebook.com/${siteConfig.social.facebook}`,
    `https://instagram.com/${siteConfig.social.instagram.replace('@', '')}`
  ]
};

// Link Building Keywords (for internal linking strategy)
export const linkBuildingKeywords = {
  autycloud: [
    "fleet management software",
    "rental management system",
    "cloud-based fleet tracking",
    "inventory management",
    "booking automation",
    "fleet analytics",
    "rental business software",
    "vehicle tracking system"
  ],
  adnanRentals: [
    "car rental",
    "vehicle rental",
    "rent a car",
    "luxury car rental",
    "SUV rental",
    "Dubai car rental",
    "UAE vehicle rental",
    "business car rental"
  ]
};

// Backlink Asset Types
export const backlinkAssets = {
  infographics: [
    {
      title: "UAE Rental Business Statistics 2024",
      slug: "uae-rental-statistics-2024",
      description: "Comprehensive infographic with market data",
      keywords: ["UAE rental market", "statistics", "industry data"]
    },
    {
      title: "Fleet Management Cost Optimization",
      slug: "fleet-cost-optimization",
      description: "Visual guide to reducing fleet operational costs",
      keywords: ["cost optimization", "fleet savings", "efficiency"]
    }
  ],
  downloads: [
    {
      title: "UAE Rental Business Starter Guide",
      file: "uae-rental-starter-guide.pdf",
      description: "Complete 50-page guide for launching a rental business in UAE",
      keywords: ["startup guide", "business launch", "UAE regulations"]
    },
    {
      title: "Fleet Management Checklist",
      file: "fleet-management-checklist.pdf",
      description: "Daily, weekly, and monthly operational checklist",
      keywords: ["checklist", "fleet operations", "maintenance"]
    },
    {
      title: "Rental Pricing Calculator Template",
      file: "pricing-calculator-template.xlsx",
      description: "Excel template for dynamic pricing strategy",
      keywords: ["pricing strategy", "calculator", "revenue optimization"]
    }
  ],
  tools: [
    {
      title: "ROI Calculator",
      slug: "roi-calculator",
      description: "Calculate fleet management software ROI",
      keywords: ["ROI", "calculator", "investment return"]
    },
    {
      title: "Fleet Size Optimizer",
      slug: "fleet-size-optimizer",
      description: "Determine optimal fleet size for your market",
      keywords: ["fleet sizing", "optimization", "planning"]
    }
  ]
};

// Target Backlink Sources (for outreach)
export const targetBacklinkSources = [
  {
    category: "UAE Business Directories",
    sites: [
      "dubai-business.ae",
      "uaebusiness.com",
      "dubaichamber.com"
    ]
  },
  {
    category: "Travel & Tourism Blogs",
    sites: [
      "visitdubai.com/blog",
      "timeoutdubai.com",
      "thenational.ae/travel"
    ]
  },
  {
    category: "Automotive Publications",
    sites: [
      "autoworld.ae",
      "carnity.com",
      "dubaidriving.ae"
    ]
  },
  {
    category: "Business & Tech Blogs",
    sites: [
      "entrepreneur.com/middle-east",
      "arabianbusiness.com",
      "thenational.ae/business"
    ]
  }
];
