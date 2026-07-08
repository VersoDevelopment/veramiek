import type { NextConfig } from "next";
import path from "node:path";

/**
 * Sta next/image toe om producten foto's van de API-host te optimaliseren.
 * Product-`images[]` uit de Express-API zijn absolute http(s)-URLs
 * (geüpload naar /uploads op de API-host). We leiden de host af uit
 * NEXT_PUBLIC_API_BASE, met localhost als dev-fallback.
 */
const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001";

let apiRemotePattern: URL | null = null;
try {
  apiRemotePattern = new URL("/uploads/**", apiBase);
} catch {
  apiRemotePattern = null;
}

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      // API-host uit NEXT_PUBLIC_API_BASE (bv. https://api.veramiek.nl/uploads/**)
      ...(apiRemotePattern
        ? [
            {
              protocol: apiRemotePattern.protocol.replace(":", "") as
                | "http"
                | "https",
              hostname: apiRemotePattern.hostname,
              port: apiRemotePattern.port,
              pathname: "/uploads/**",
              search: "",
            },
          ]
        : []),
      // Productie-API expliciet toegestaan, ongeacht env tijdens build.
      {
        protocol: "https",
        hostname: "api.veramiek.nl",
        port: "",
        pathname: "/uploads/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
