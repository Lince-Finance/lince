/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  reactStrictMode: false,
  trailingSlash: false,
};

module.exports = nextConfig;
