/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.producthunt.com',
        port: '',
        pathname: '**',
      },
    ],
  },
  redirects() {
    return [
      {
        source: '/android',
        destination: 'https://play.google.com/store/apps/details?id=com.rapbook',
        permanent: false,
        basePath: false,
      },
      {
        source: '/android/beta',
        destination: 'https://play.google.com/apps/testing/com.rapbook',
        permanent: false,
        basePath: false,
      },
      {
        source: '/demo',
        destination: 'https://www.youtube.com/watch?v=NUhlzDv9m9g',
        permanent: false,
        basePath: false,
      },
      {
        source: '/ios',
        destination: 'https://itunes.apple.com/us/app/rapbook/id1352247113',
        permanent: false,
        basePath: false,
      },
      {
        source: '/ios/beta',
        destination: 'https://testflight.apple.com/join/x3hOZLt5/',
        permanent: false,
        basePath: false,
      },
      {
        source: '/openmic',
        destination: 'https://forms.gle/G4fo4SBPDjvwkLAk7',
        permanent: false,
        basePath: false,
      },
      {
        source: '/meet',
        destination: 'https://calendar.app.google/sy5huqZBieyu8pu68',
        permanent: false,
        basePath: false,
      },
      {
        source: '/pitch',
        destination: 'https://1drv.ms/p/s!AoIPBhqDp9yHmAL1ZqqK70QO7NHx?e=gRZyxF',
        permanent: false,
        basePath: false,
      },
      {
        source: '/peytspencer/where-i-wanna-be',
        destination: 'https://distrokid.com/hyperfollow/peytspencer/where-i-wanna-be',
        permanent: false,
        basePath: false,
      },
      {
        source: '/creators',
        destination: 'https://forms.fillout.com/t/vEBe5ABuNaus',
        permanent: false,
        basePath: false,
      },
    ];
  },
  reactStrictMode: true,
  webpack: config => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      'react-native$': 'react-native-web',
    };
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];
    // config.resolve.fallback = {
    //   fs: false,
    //   ...config.resolve.fallback,
    // };
    return config;
  },
  transpilePackages: ['react-native-web'],
};

module.exports = nextConfig;
