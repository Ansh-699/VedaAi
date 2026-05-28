import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfjs-dist ships ESM worker; let Next bundle it.
  transpilePackages: ["pdfjs-dist"],
};

export default nextConfig;
