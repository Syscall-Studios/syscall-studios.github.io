import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const local = process.argv.includes("--local");
const command = [
    "npx wrangler d1 execute syscall-newsletter",
    local ? "--local" : "--remote",
    "--json",
    '--command "SELECT email, source, created_at FROM subscribers ORDER BY created_at"'
].join(" ");

const result = spawnSync(command, { shell: true, encoding: "utf8" });

if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    process.exit(1);
}

const output = result.stdout.slice(result.stdout.indexOf("["));
const rows = JSON.parse(output)[0]?.results ?? [];

const escape = (value) => {
    const text = value == null ? "" : String(value);
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const csv = [
    "email,source,created_at",
    ...rows.map((row) => [row.email, row.source, row.created_at].map(escape).join(","))
].join("\n");

const file = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
writeFileSync(file, `${csv}\n`);

console.log(`Saved ${rows.length} subscribers to ${file}`);
