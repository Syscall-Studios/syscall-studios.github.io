import site from "../data/site.json";

const labels: Record<string, string> = {
    twitter: "X",
    youtube: "YouTube",
    tiktok: "TikTok",
    reddit: "Reddit",
    github: "GitHub",
    bluesky: "Bluesky"
};

export const socialLinks = Object.entries(site.socials)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([id, url]) => ({
        id,
        url,
        label: labels[id] ?? id
    }));
