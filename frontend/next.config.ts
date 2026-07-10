/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname, // force correct root
  },
};

module.exports = nextConfig;