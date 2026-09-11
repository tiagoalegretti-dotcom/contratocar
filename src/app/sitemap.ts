import { siteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/contrato`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/recibo`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${base}/calculadora-ipva`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
