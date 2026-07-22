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
  // Standalone bundelt server + alleen de gebruikte node_modules, zodat de
  // productie-image klein blijft (zie web/Dockerfile).
  output: "standalone",
  turbopack: {
    root: path.join(__dirname),
  },
  poweredByHeader: false,
  /**
   * De oude statische site had .html-URL's. Die blijven in Google staan en in
   * links van derden, dus ze worden permanent doorgezet naar hun opvolger.
   */
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/collectie.html", destination: "/collecties", permanent: true },
      { source: "/workshops.html", destination: "/workshops", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/collectie", destination: "/collecties", permanent: true },
      { source: "/shop", destination: "/collecties", permanent: true },
      { source: "/workshop", destination: "/workshops", permanent: true },
      { source: "/over", destination: "/over-mij", permanent: true },
    ];
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
      // Productie: uploads worden geserveerd via veramiek.nl/api/uploads/*
      // (zie de upload-URL in ../api/server.js).
      {
        protocol: "https",
        hostname: "veramiek.nl",
        port: "",
        pathname: "/api/uploads/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "www.veramiek.nl",
        port: "",
        pathname: "/api/uploads/**",
        search: "",
      },
      // Losse API-subdomein-variant, mocht de upload-host later wijzigen.
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
