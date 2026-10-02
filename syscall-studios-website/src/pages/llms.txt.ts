import { getPublishedPosts } from "../lib/devlog";
import { socialLinks } from "../lib/socials";
import site from "../data/site.json";

const pages = [
    { path: "/games/", name: "Games", summary: "What we're making. Our first game, Project 01, is in development and unannounced." },
    { path: "/devlog/", name: "Dev Log", summary: "Development notes, experiments, mistakes and discoveries." },
    { path: "/about/", name: "About", summary: "What the studio believes, how it picks projects, and where the name comes from." },
    { path: "/contact/", name: "Contact", summary: "Email addresses for business, press and support." },
    { path: "/careers/", name: "Careers", summary: "Not hiring yet, and what we promise for when we are." }
];

export async function GET({ site: siteURL }) {
    const origin = siteURL ?? new URL("https://syscallstudios.com");
    const posts = await getPublishedPosts();
    const link = (name: string, path: string, summary: string) =>
        `- [${name}](${new URL(path, origin)}): ${summary}`;

    const text = [
        `# ${site.studioName}`,
        "",
        `> ${site.description}`,
        "",
        `Tagline: ${site.tagline}`,
        "",
        "## Pages",
        "",
        ...pages.map((page) => link(page.name, page.path, page.summary)),
        "",
        "## Dev Log Posts",
        "",
        ...posts.map((post) => link(post.data.title, `/devlog/${post.id}/`, post.data.description)),
        "",
        "## Contact",
        "",
        `- General: ${site.emails.hello}`,
        `- Press: ${site.emails.press}`,
        `- Support: ${site.emails.support}`,
        "",
        "## Elsewhere",
        "",
        ...socialLinks.map((social) => `- [${social.label}](${social.url})`),
        ""
    ].join("\n");

    return new Response(text, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8"
        }
    });
}
