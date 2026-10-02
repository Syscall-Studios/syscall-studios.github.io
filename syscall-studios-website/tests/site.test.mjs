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
        "careers/index.html",
        "devlog/index.html",
        "robots.txt",
        "sitemap.xml",
        "rss.xml",
        "llms.txt"
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

test("careers page states that no roles are open", async () => {
    const html = await readPage("careers/index.html");

    assert.match(html, /None right now/);
    assert.match(html, /Not hiring/);
    assert.match(html, /mailto:/);
});

test("footer links to careers and the feed", async () => {
    const html = await readPage("index.html");

    assert.match(html, /href="\/careers\/"/);
    assert.match(html, /href="\/rss\.xml"/);
});

const readJsonLd = (html) => {
    const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    assert.ok(json, "page is missing JSON-LD");
    return JSON.parse(json)["@graph"];
};

test("internal links point at canonical trailing-slash URLs", async () => {
    for (const path of ["index.html", "about/index.html", "devlog/hello-world/index.html", "404.html"]) {
        const html = await readPage(path);
        assert.doesNotMatch(
            html,
            /href="\/(games|devlog|about|contact|careers)"/,
            `${path} links to a URL that redirects`
        );
    }
});

test("pages describe the studio with structured data", async () => {
    const graph = readJsonLd(await readPage("index.html"));
    const types = graph.map((node) => node["@type"]);

    assert.ok(types.includes("Organization"));
    assert.ok(types.includes("WebSite"));
    assert.ok(graph.find((node) => node["@type"] === "Organization").sameAs.length > 0);
});

test("dev log posts are marked up as articles", async () => {
    const [id] = await expectedPostIds();
    const html = await readPage(`devlog/${id}/index.html`);
    const graph = readJsonLd(html);
    const post = graph.find((node) => node["@type"] === "BlogPosting");

    assert.match(html, /property="og:type" content="article"/);
    assert.match(html, /property="article:published_time"/);
    assert.ok(post?.headline && post.datePublished);
    assert.equal(
        graph.find((node) => node.breadcrumb)?.breadcrumb.itemListElement.length,
        3
    );
});

test("noindex pages skip the canonical link and structured data", async () => {
    const html = await readPage("404.html");

    assert.doesNotMatch(html, /rel="canonical"/);
    assert.doesNotMatch(html, /application\/ld\+json/);
});

test("sitemap dates posts and robots.txt points at it", async () => {
    const xml = await readPage("sitemap.xml");
    const robots = await readPage("robots.txt");

    assert.match(xml, /<lastmod>\d{4}-\d{2}-\d{2}T/);
    assert.doesNotMatch(xml, /404/);
    assert.match(robots, /Sitemap: https:\/\/syscallstudios\.com\/sitemap\.xml/);
});

test("pages share a PNG social card and brand icons", async () => {
    const html = await readPage("index.html");

    assert.match(html, /property="og:image" content="[^"]+\/og\.png"/);
    assert.match(html, /rel="apple-touch-icon" href="\/apple-touch-icon\.png"/);

    for (const asset of ["og.png", "favicon.svg", "favicon.ico", "apple-touch-icon.png"]) {
        const contents = await readFile(new URL(`../dist/${asset}`, import.meta.url));
        assert.ok(contents.length > 0, `${asset} is missing`);
    }
});

test("custom 404 page offers a clear route home", async () => {
    const html = await readPage("404.html");

    assert.match(html, /Page not found/);
    assert.match(html, /couldn't find that page/);
    assert.match(html, /data-finder/);
    assert.equal(html.match(/data-tile=/g)?.length, 54);
    assert.match(html, /href="\/"[^>]*>[\s\S]*Return Home/i);
    assert.match(html, /name="robots"[^>]*content="noindex, nofollow"/);
});

test("only /api routes run Worker code", async () => {
    const source = await readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8");
    const config = JSON.parse(source.replace(/^\s*\/\/.*$/gm, ""));

    // If page views ran the Worker, hitting the free-tier limit would take the site down.
    assert.deepEqual(config.assets.run_worker_first, ["/api/*"]);
    assert.equal(config.assets.not_found_handling, "404-page");
    assert.equal(config.assets.directory, "./dist");
});
