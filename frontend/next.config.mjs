import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: ["pdfjs-dist"],
  turbopack: {
    root: here,
  },
};

export default nextConfig;
