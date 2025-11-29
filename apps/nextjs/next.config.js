import path from "path";
import { fileURLToPath } from "url";
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
import createJiti from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

const appDir = fileURLToPath(new URL(".", import.meta.url));
const logoAssetsDir = path.join(appDir, "src/app/assets/logos");

/** @type {import("next").NextConfig} */
const config = {
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@sassy/api",
    "@sassy/db",
    "@sassy/ui",
    "@sassy/validators",
  ],

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        port: "",
        pathname: "/api/portraits/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "jxpkcowxbzzbasbxpdkc.supabase.co",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
    ],
  },

  /** Add Prisma plugin to make it works with turbo deployment vercel*/
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    // Configure SVGR for SVG imports
    config.module.rules.push(
      {
        test: /\.svg$/,
        include: logoAssetsDir,
        use: [
          {
            loader: "@svgr/webpack",
          },
        ],
      },
      {
        test: /\.svg$/,
        exclude: logoAssetsDir,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              icon: true,
            },
          },
        ],
      },
    );

    return config;
  },

  experimental: {
    turbo: {
      rules: {
        "src/app/assets/logos/*.svg": {
          loaders: [
            {
              loader: "@svgr/webpack",
              options: {},
            },
          ],
          as: "*.js",
        },
        "*.svg": {
          loaders: [
            {
              loader: "@svgr/webpack",
              options: {
                icon: true,
              },
            },
          ],
          as: "*.js",
        },
      },
    },
  },
};

export default config;
