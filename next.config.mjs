/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Proxy /api/* requests to the backend.
  // On Vercel: set NEXT_PUBLIC_API_URL to your deployed backend URL.
  // Locally:   defaults to http://localhost:3001
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
