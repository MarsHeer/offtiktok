/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 1000 * 60 * 5, // 5 minutes
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
      },
      {
        hostname: 'smolvideo.com',
      },
    ],
  },
  redirects: async () => {
    return [
      // General redirect rule
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '(?<subdomain>[^.]+)\\.(?<domain>.+)',
          },
        ],
        destination: `${
          process.env.NODE_ENV === 'production'
            ? 'https://www.offtiktok.com'
            : 'http://localhost:3000'
        }/sd/:subdomain/:path*`,
        permanent: false,
        // Add a condition to exclude the destination domain
        missing: [
          {
            type: 'query',
            key: 'id',
          },
          {
            type: 'host',
            value: 'offtiktok.com',
          },
          {
            type: 'host',
            value: 'www.offtiktok.com',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
