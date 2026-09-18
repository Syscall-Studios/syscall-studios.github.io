import { getPublishedPosts } from "../lib/devlog";
import { escapeXml } from "../lib/xml";
import site from "../data/site.json";

export async function GET({ site: siteURL }) {
    const origin = siteURL ?? new URL("https://syscall-studios.github.io");
    const posts = await getPublishedPosts();
    const items = posts
        .map((post) => {
            const url = new URL(`/devlog/${post.id}/`, origin);

            return [
                "    <item>",
                `      <title>${escapeXml(post.data.title)}</title>`,
                `      <link>${url}</link>`,
                `      <guid>${url}</guid>`,
                `      <pubDate>${post.data.pubDate.toUTCString()}</pubDate>`,
                `      <description>${escapeXml(post.data.description)}</description>`,
                "    </item>"
            ].join("\n");
        })
        .join("\n");

    const xml = [
        `<?xml version="1.0" encoding="UTF-8"?>`,
        `<rss version="2.0">`,
        "  <channel>",
        `    <title>${escapeXml(site.studioName)} Dev Log</title>`,
        `    <link>${new URL("/devlog/", origin)}</link>`,
        `    <description>${escapeXml(site.tagline)}</description>`,
        items,
        "  </channel>",
        "</rss>"
    ].join("\n");

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8"
        }
    });
}
