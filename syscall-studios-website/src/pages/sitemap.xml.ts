import { getPublishedPosts } from "../lib/devlog";
import { escapeXml } from "../lib/xml";

const staticRoutes = [
    "/",
    "/games/",
    "/devlog/",
    "/about/",
    "/contact/",
    "/careers/"
];

export async function GET({ site: siteURL }) {
    const origin = siteURL ?? new URL("https://syscallstudios.com");
    const posts = await getPublishedPosts();
    const latestPost = posts[0];
    const latestUpdate = latestPost
        ? latestPost.data.updatedDate ?? latestPost.data.pubDate
        : undefined;

    // The home page and dev log index list the newest posts, so they change whenever a post does.
    const routes: { path: string; lastmod?: Date }[] = [
        ...staticRoutes.map((path) => ({
            path,
            lastmod: path === "/" || path === "/devlog/" ? latestUpdate : undefined
        })),
        ...posts.map((post) => ({
            path: `/devlog/${post.id}/`,
            lastmod: post.data.updatedDate ?? post.data.pubDate
        }))
    ];

    const urls = routes
        .map(({ path, lastmod }) => {
            const loc = new URL(path, origin);

            return [
                "  <url>",
                `    <loc>${escapeXml(loc.toString())}</loc>`,
                ...(lastmod ? [`    <lastmod>${lastmod.toISOString()}</lastmod>`] : []),
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
