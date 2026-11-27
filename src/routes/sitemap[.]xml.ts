import { createFileRoute } from "@tanstack/react-router";
import { siteUrl } from "@/lib/seo";

const staticRoutes = ["/", "/about", "/alumni", "/contact"];

function buildSitemap() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = staticRoutes
    .map((path) => {
      const loc = `${siteUrl}${path === "/" ? "/" : path}`;
      const priority = path === "/" ? "1.0" : "0.8";
      const changefreq = path === "/" ? "weekly" : "monthly";
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () =>
        new Response(buildSitemap(), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          },
        }),
    },
  },
});
