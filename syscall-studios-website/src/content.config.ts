import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const devlog = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/data/devlog"
    }),

    schema: z.object({
        title: z.string(),
        // Used for the <title> tag and social cards; the page itself shows `title`.
        seoTitle: z.string().optional(),
        description: z.string(),

        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),

        tags: z.array(z.string()).default([]),

        featured: z.boolean().default(false),
        draft: z.boolean().default(false),

        cover: z.string().optional()
    })
});

export const collections = {
    devlog
};