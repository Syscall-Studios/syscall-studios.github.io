import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const readPage = (path) =>
    readFile(new URL(`../dist/${path}`, import.meta.url), "utf8");

const collectDevlogHrefs = (html) =>
    [...html.matchAll(/href="\/devlog\/([a-z0-9-]+)\/"/g)].map(
        (match) => match[1]
    );

async function expectedPostIds() {
    const dir = new URL("../src/data/devlog/", import.meta.url);
    const files = await readdir(dir);
    const posts = [];

    for (const file of files.filter((name) => name.endsWith(".md"))) {
        const markdown = await readFile(new URL(file, dir), "utf8");

        if (/^draft:\s*true\s*$/m.test(markdown)) {
            continue;
        }

        const pubDate = markdown.match(/^pubDate:\s*(.+)$/m)?.[1];
        assert.ok(pubDate, `${file} is missing pubDate`);

        posts.push({
            id: file.replace(/\.md$/, ""),
            pubDate: Date.parse(pubDate)
        });
    }

    return posts
        .sort((a, b) => b.pubDate - a.pubDate)
        .map((post) => post.id);
}

test("homepage exposes a clear heading and the latest dev log", async () => {
    const html = await readPage("index.html");
    const expectedIds = await expectedPostIds();

    assert.match(html, /<h1[^>]*>[\s\S]*Syscall Studios[\s\S]*<\/h1>/i);
    assert.match(html, /logo-full-box-light\.svg/);
    assert.doesNotMatch(html, /DEVLOG \| 000/);
    assert.deepEqual(
        collectDevlogHrefs(html).slice(0, 2),
        expectedIds.slice(0, 2)
    );
});

test("site shell provides keyboard navigation affordances", async () => {
    const html = await readPage("index.html");

    assert.match(html, /class="skip-link"[^>]*href="#main-content"/);
    assert.match(html, /class="menu-toggle"/);
    assert.match(html, /aria-controls="main-navigation"/);
    assert.match(html, /aria-expanded="false"/);
    assert.match(html, /id="main-navigation"/);
    assert.match(html, /aria-label="Footer navigation"/);
});

test("core pages and feeds are generated", async () => {
    const pages = [
        "about/index.html",
        "contact/index.html",
        "games/index.html",
        "devlog/index.html",
        "robots.txt",
        "sitemap.xml",
        "rss.xml"
    ];

    await Promise.all(
        pages.map(async (path) => {
            const contents = await readPage(path);
            assert.ok(contents.trim().length > 0, `${path} is empty`);
        })
    );
});

test("dev log lists published posts newest first", async () => {
    const html = await readPage("devlog/index.html");
    const expectedIds = await expectedPostIds();

    assert.deepEqual(collectDevlogHrefs(html), expectedIds);
});

test("rss feed lists published posts newest first", async () => {
    const xml = await readPage("rss.xml");
    const expectedIds = await expectedPostIds();
    const feedIds = [
        ...xml.matchAll(
            /<link>https?:\/\/[^<]+\/devlog\/([a-z0-9-]+)\/<\/link>/g
        )
    ].map((match) => match[1]);

    assert.deepEqual(feedIds, expectedIds);
});

test("custom 404 page offers a clear route home", async () => {
    const html = await readPage("404.html");

    assert.match(html, /SEGMENTATION FAULT/);
    assert.match(html, /The requested page could not be found/);
    assert.match(html, /href="\/"[^>]*>[\s\S]*Return Home/i);
    assert.match(html, /name="robots"[^>]*content="noindex, nofollow"/);
});
