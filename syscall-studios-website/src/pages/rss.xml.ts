import { getPublishedPosts } from "../lib/devlog";
import { escapeXml } from "../lib/xml";
import site from "../data/site.json";

export async function GET({ site: siteURL }) {
    const origin = siteURL ?? new URL("https://syscallstudios.com");
    const posts = await getPublishedPosts();
    const items = posts
        .map((post) => {
            const url = new URL(`/devlog/${post.id}/`, origin);

            return [
                "    <item>",
                `      <title>${escapeXml(post.data.title)}</title>`,
                `      <link>${url}</link>`,
                `      <guid isPermaLink="true">${url}</guid>`,
                `      <pubDate>${post.data.pubDate.toUTCString()}</pubDate>`,
                `      <description>${escapeXml(post.data.description)}</description>`,
                ...post.data.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
                "    </item>"
            ].join("\n");
        })
        .join("\n");

    const lastBuildDate = posts[0]
        ? [`    <lastBuildDate>${(posts[0].data.updatedDate ?? posts[0].data.pubDate).toUTCString()}</lastBuildDate>`]
        : [];

    const xml = [
        `<?xml version="1.0" encoding="UTF-8"?>`,
        `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
        "  <channel>",
        `    <title>${escapeXml(site.studioName)} Dev Log</title>`,
        `    <link>${new URL("/devlog/", origin)}</link>`,
        `    <atom:link href="${new URL("/rss.xml", origin)}" rel="self" type="application/rss+xml" />`,
        `    <description>${escapeXml(site.description)}</description>`,
        "    <language>en</language>",
        ...lastBuildDate,
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
