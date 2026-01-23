import type { NextConfig } from "next";
import { withPlausibleProxy } from "next-plausible";

import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Do this in GitHub instead:
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  redirects: async () => [
    {
      source: "/how-to-create-a-trix-custom-toolbar",
      destination: "/blog/how-to-create-a-trix-custom-toolbar",
      permanent: true,
    },
    {
      source: "/card",
      destination: "/?utm_source=Business+Card&utm_medium=QR",
      permanent: true,
    },
  ],
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(withPlausibleProxy({})(nextConfig));
