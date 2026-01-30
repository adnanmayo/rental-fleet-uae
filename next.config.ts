import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/seo",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/seo/:slug*",
        destination: "/blog/:slug*",
        permanent: true,
      },
      {
        source: "/articles",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/articles/:slug*",
        destination: "/blog/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
