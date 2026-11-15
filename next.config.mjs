/** @type {import('next').NextConfig} */
const basePath = process.env.PAGES_BASE_PATH || undefined;

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  ...(basePath ? { basePath, trailingSlash: true } : {}),
};

export default nextConfig;
