import { createFileRoute } from "@tanstack/react-router";
import { siteUrl } from "@/lib/seo";

const body = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${siteUrl}/sitemap.xml
`;

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () =>
        new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          },
        }),
    },
  },
});
