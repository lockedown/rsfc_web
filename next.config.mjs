import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Cloudflare R2 public bucket (configure your own domain)
      { protocol: 'https', hostname: '*.r2.dev' },
      { protocol: 'https', hostname: 'media.rawskillsfc.com' },
    ],
  },
  experimental: {
    reactCompiler: false,
  },
}

export default withPayload(nextConfig)
