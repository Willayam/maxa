/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@maxa/shared', 'react-native-web', 'react-native-reanimated'],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];
    return config;
  },
  async redirects() {
    return [
      {
        source: '/gamla-prov',
        destination: '/hogskoleprovet',
        permanent: true,
      },
      {
        source: '/gamla-prov/:slug',
        destination: '/hogskoleprovet/:slug',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
