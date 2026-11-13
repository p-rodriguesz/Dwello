import type { NextConfig } from 'next';
const apiUrl = process.env.API_URL ?? 'http://localhost:3000';
const nextConfig: NextConfig = { async rewrites() { return [{ source: '/backend/:path*', destination: `${apiUrl}/:path*` }]; } };
export default nextConfig;
