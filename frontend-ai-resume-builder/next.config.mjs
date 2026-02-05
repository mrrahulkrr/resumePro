/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  serverExternalPackages: ["next-auth"],
  // Disable static generation for all pages to avoid React context prerender errors
  output: 'standalone',
}

export default nextConfig
