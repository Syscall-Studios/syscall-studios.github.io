import { getPublishedPosts } from "../lib/devlog";
import { escapeXml } from "../lib/xml";

const staticRoutes = [
    "/",
    "/games/",
    "/devlog/",
    "/about/",
    "/contact/"
];

export async function GET({ site: siteURL }) {
    const origin = siteURL ?? new URL("https://syscall-studios.github.io");
    const posts = await getPublishedPosts();
    const routes = [
        ...staticRoutes,
        ...posts.map((post) => `/devlog/${post.id}/`)
    ];

    const urls = routes
        .map((path) => {
            const loc = new URL(path, origin);

            return [
                "  <url>",
                `    <loc>${escapeXml(loc.toString())}</loc>`,
                "  </url>"
            ].join("\n");
        })
        .join("\n");

    const xml = [
        `<?xml version="1.0" encoding="UTF-8"?>`,
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
        urls,
        "</urlset>"
    ].join("\n");

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8"
        }
    });
}
