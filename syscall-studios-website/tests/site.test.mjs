import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readPage = (path) =>
    readFile(new URL(`../dist/${path}`, import.meta.url), "utf8");

test("homepage exposes a clear heading and the latest dev log", async () => {
    const html = await readPage("index.html");

    assert.match(html, /<h1[^>]*>[\s\S]*Syscall Studios[\s\S]*<\/h1>/i);
    assert.match(html, /Hello, World/);
    assert.doesNotMatch(html, /DEVLOG \/\/ 000/);
    assert.match(html, /logo-full-box-light\.svg/);
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

test("custom 404 page offers a clear route home", async () => {
    const html = await readPage("404.html");

    assert.match(html, /SEGMENTATION FAULT/);
    assert.match(html, /The requested page could not be found/);
    assert.match(html, /href="\/"[^>]*>[\s\S]*Return Home/i);
    assert.match(html, /name="robots"[^>]*content="noindex, nofollow"/);
});
