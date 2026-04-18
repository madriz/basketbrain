/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — everything is rendered at build time and served from
  // GitHub Pages' CDN. No serverless functions, no runtime Node.
  output: 'export',

  // next/image can't use the default loader under static export.
  images: { unoptimized: true },

  // Leaflet ships CommonJS internals that need transpiling under Next.js 15.
  transpilePackages: ['leaflet'],

  // Trailing slash keeps GitHub Pages happy with directory-style URLs
  // (e.g. /demo/ → /demo/index.html).
  trailingSlash: true,
};

module.exports = nextConfig;
