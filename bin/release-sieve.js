#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { analyzeHistory, renderJson, renderMarkdown } from "../src/analyze.js";

function usage() {
  console.log(`release-sieve — make a release brief from git history

Usage:
  release-sieve [base] [--title "Release title"] [--format markdown|json] [--out brief.md]

Examples:
  release-sieve v1.4.0 --title "October reliability release"
  release-sieve HEAD~12 --format json --out release-brief.json`);
}

function readGit(args) {
  try { return execFileSync("git", args, { encoding: "utf8" }).trim(); }
  catch (error) { throw new Error(`Could not read git history: ${error.message}`); }
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) { usage(); process.exit(0); }
const titleAt = args.indexOf("--title");
const outAt = args.indexOf("--out");
const formatAt = args.indexOf("--format");
const title = titleAt >= 0 ? args[titleAt + 1] : "Release brief";
const out = outAt >= 0 ? args[outAt + 1] : null;
const format = formatAt >= 0 ? args[formatAt + 1] : "markdown";
const base = args.find((item, index) =>
  !item.startsWith("-") &&
  (titleAt < 0 || index !== titleAt + 1) &&
  (outAt < 0 || index !== outAt + 1) &&
  (formatAt < 0 || index !== formatAt + 1)
) || "HEAD~10";

try {
  if (!['markdown', 'json'].includes(format)) throw new Error(`Unsupported format \"${format}\". Use markdown or json.`);
  const commits = readGit(["log", "--format=%H%x1f%s%x1e", `${base}..HEAD`]);
  const stat = readGit(["diff", "--numstat", `${base}..HEAD`]);
  const report = analyzeHistory(commits, stat, { title, base });
  const output = format === "json" ? renderJson(report) : renderMarkdown(report);
  if (out) {
    const { writeFileSync } = await import("node:fs");
    writeFileSync(out, output);
    console.log(`Wrote ${out}`);
  } else console.log(output);
} catch (error) {
  console.error(`release-sieve: ${error.message}`);
  process.exit(1);
}
