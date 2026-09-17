import { SITE_URL } from "@/lib/site";

const pages = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/contrato", priority: "0.9", changefreq: "weekly" },
  { path: "/recibo", priority: "0.7", changefreq: "monthly" },
  { path: "/calculadora-ipva", priority: "0.6", changefreq: "monthly" },
];

function xml() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = pages
    .map(
      (p) => `  <url>
    <loc>${SITE_URL}${p.path === "/" ? "" : p.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function GET() {
  return new Response(xml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
