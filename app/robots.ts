import type { MetadataRoute } from "next";
import { publicEnv } from "@/config/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/api", "/preview"]
    },
    sitemap: new URL("/sitemap.xml", publicEnv.siteUrl).toString()
  };
}
