import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // webpack: (
  //   /** @type {import('webpack').Configuration} */
  //   webpackConfig
  // ) => {
  //   // 💥 Still needed for dynamic import
  //   /** @type {Exclude<typeof webpackConfig.resolve, undefined>} */ webpackConfig.resolve.extensionAlias =
  //     {
  //       ".js": [".ts", ".tsx", ".js", ".jsx"],
  //     };

  //   return webpackConfig;
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
      },
    ],
  },
  turbopack: {},
};

export default nextConfig;
