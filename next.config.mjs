import { resolve } from 'path';

const nextConfig = {
  images: {
    domains: ['thecryptogateway.it'], // Add your image host domain here
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
        // add other Node.js modules if needed
      };
    }
    return config;
  },
};

export default nextConfig;
