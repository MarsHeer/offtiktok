const nextConfig = {
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
      // Redirect rule for subdomains
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
      },
      // Redirect rule for the main domain
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'offtiktok.com',
          },
          {
            type: 'host',
            value: 'www.offtiktok.com',
          },
        ],
        destination: `${
          process.env.NODE_ENV === 'production'
            ? 'https://www.offtiktok.com'
            : 'http://localhost:3000'
        }/:path*`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
