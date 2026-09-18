import { getCollection } from "astro:content";

export async function getPublishedPosts() {
    return (
        await getCollection("devlog", ({ data }) => !data.draft)
    ).sort(
        (a, b) =>
            b.data.pubDate.valueOf() -
            a.data.pubDate.valueOf()
    );
}
