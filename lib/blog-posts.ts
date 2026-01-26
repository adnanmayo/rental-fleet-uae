// Blog post data
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'scale-uae-car-rental-business-2024',
    title: 'How to Scale Your UAE Car Rental Business in 2024',
    excerpt: 'Proven strategies for sustainable growth in the competitive UAE rental market',
    category: 'Fleet Tech',
    readTime: '8 min read'
  },
  {
    slug: 'fleet-management-mistakes',
    title: 'Top Mistakes in Fleet Management and How to Avoid Them',
    excerpt: 'Learn from common pitfalls and optimize your fleet operations',
    category: 'Rental Tips',
    readTime: '6 min read'
  },
  {
    slug: 'uae-driving-laws-rental-vehicles',
    title: 'UAE Driving Laws for Rental Vehicles: Complete Guide',
    excerpt: 'Stay compliant with the latest regulations and protect your business',
    category: 'UAE Business',
    readTime: '10 min read'
  }
];

export function getAllPosts() {
  return blogPosts;
}

export function getPostBySlug(slug: string) {
  return blogPosts.find(post => post.slug === slug);
}
