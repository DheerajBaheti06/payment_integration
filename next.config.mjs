/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
        os: false,
        util: false,
        buffer: false,
        url: false,
        http: false,
        https: false,
        zlib: false,
        assert: false,
        "pg-native": false,
        dns: false,
      };
    }

    // Handle Cloudflare and other custom schemes
    config.module.rules.push({
      test: /\.(m?js|node)$/,
      parser: { amd: false },
      use: {
        loader: "@vercel/webpack-asset-relocator-loader",
        options: {
          outputAssetBase: "assets",
          existingAssetNames: [],
          wrapperCompatibility: true,
          production: process.env.NODE_ENV === "production",
        },
      },
    });

    // Handle Cloudflare scheme and pg-cloudflare
    config.module.rules.push({
      test: /\.(m?js|node)$/,
      parser: { amd: false },
      use: {
        loader: "null-loader",
      },
      include: [/cloudflare:/, /pg-cloudflare/],
    });

    // Ignore pg-cloudflare and related modules on the client side
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "pg-cloudflare": false,
        pg: false,
        "pg-native": false,
      };
    }

    return config;
  },
};

export default nextConfig;
