import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { bots } from "@/data/bots";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = ["/", "/explore", "/features", "/pricing", "/dashboard", "/about"];
        const botPaths = bots.map((b) => `/bots/${b.id}`);
        const all = [...staticPaths, ...botPaths];

        const urls = all
          .map((p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`)
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});