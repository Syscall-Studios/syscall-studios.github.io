import type { CollectionEntry } from "astro:content";

import site from "../data/site.json";
import { socialLinks } from "./socials";

export type JsonLd = Record<string, unknown>;

export interface Breadcrumb {
    name: string;
    path: string;
}

export const twitterHandle = (() => {
    const handle = site.socials.twitter?.match(/(?:x|twitter)\.com\/([^/?#]+)/i)?.[1];
    return handle ? `@${handle}` : null;
})();

export function organizationId(origin: URL) {
    return new URL("/#organization", origin).toString();
}

export function websiteId(origin: URL) {
    return new URL("/#website", origin).toString();
}

export function siteGraph(origin: URL): JsonLd[] {
    const url = new URL("/", origin).toString();

    return [
        {
            "@type": "Organization",
            "@id": organizationId(origin),
            name: site.studioName,
            url,
            slogan: site.tagline,
            description: site.description,
            email: site.emails.hello,
            logo: {
                "@type": "ImageObject",
                url: new URL("/icon-512.png", origin).toString(),
                width: 512,
                height: 512
            },
            image: new URL("/og.png", origin).toString(),
            sameAs: socialLinks.map((social) => social.url),
            contactPoint: [
                { contactType: "customer support", email: site.emails.support },
                { contactType: "press", email: site.emails.press },
                { contactType: "general", email: site.emails.hello }
            ].map((point) => ({ "@type": "ContactPoint", ...point }))
        },
        {
            "@type": "WebSite",
            "@id": websiteId(origin),
            name: site.studioName,
            url,
            description: site.description,
            inLanguage: "en",
            publisher: { "@id": organizationId(origin) }
        }
    ];
}

export function breadcrumbList(origin: URL, crumbs: Breadcrumb[]): JsonLd {
    const items = [{ name: "Home", path: "/" }, ...crumbs];

    return {
        "@type": "BreadcrumbList",
        itemListElement: items.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.name,
            item: new URL(crumb.path, origin).toString()
        }))
    };
}

export function blogPosting(origin: URL, post: CollectionEntry<"devlog">, body?: string): JsonLd {
    const url = new URL(`/devlog/${post.id}/`, origin).toString();
    const { title, description, pubDate, updatedDate, tags, cover } = post.data;

    return {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        url,
        headline: title,
        description,
        datePublished: pubDate.toISOString(),
        dateModified: (updatedDate ?? pubDate).toISOString(),
        image: new URL(cover ?? "/og.png", origin).toString(),
        inLanguage: "en",
        author: { "@id": organizationId(origin) },
        publisher: { "@id": organizationId(origin) },
        ...(tags.length > 0 && { keywords: tags.join(", ") }),
        ...(body && {
            mainEntityOfPage: { "@id": `${url}#webpage` },
            isPartOf: { "@id": new URL("/devlog/#blog", origin).toString() },
            wordCount: body.split(/\s+/).filter(Boolean).length
        })
    };
}

export function serializeJsonLd(graph: JsonLd[]) {
    return JSON.stringify({ "@context": "https://schema.org", "@graph": graph })
        .replace(/</g, "\\u003c");
}
