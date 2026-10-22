import test from "node:test";
import assert from "node:assert/strict";
import { analyzeHistory, renderHtml, renderJson, renderMarkdown } from "../src/analyze.js";

const commits = "abc123\x1ffeat(api): add export endpoint\x1edef456\x1ffix: handle empty response\x1eghi789\x1fdocs: clarify setup\x1e";
const stat = "12\t2\tsrc/api.js\n3\t0\tconfig/auth.json";

test("classifies conventional commit subjects", () => {
  const report = analyzeHistory(commits, stat, { base: "v1.0.0" });
  assert.equal(report.groups.Features.length, 1);
  assert.equal(report.groups.Fixes.length, 1);
  assert.equal(report.groups.Maintenance.length, 1);
});

test("reports footprint and sensitive paths", () => {
  const report = analyzeHistory(commits, stat);
  assert.equal(report.additions, 15);
  assert.match(report.signals[0], /auth/);
});

test("renders a usable markdown brief", () => {
  const report = analyzeHistory(commits, stat, { title: "Ship it", base: "v1.0.0" });
  assert.match(renderMarkdown(report), /# Ship it/);
  assert.match(renderMarkdown(report), /Suggested ship checklist/);
});

test("renders stable machine-readable release data", () => {
  const report = analyzeHistory(commits, stat, { title: "Ship it", base: "v1.0.0" });
  const json = JSON.parse(renderJson(report));
  assert.equal(json.schemaVersion, "1.0");
  assert.deepEqual(json.comparison, { base: "v1.0.0", head: "HEAD" });
  assert.deepEqual(json.summary, {
    commitCount: 3,
    fileCount: 2,
    additions: 15,
    deletions: 2,
    riskSignalCount: 1
  });
  assert.equal(json.changes.features[0].subject, "feat(api): add export endpoint");
});

test("renders a self-contained shareable HTML brief safely", () => {
  const report = analyzeHistory(commits, stat, { title: "Ship <it>", base: "v1.0.0" });
  const html = renderHtml(report);
  assert.match(html, /<!doctype html>/i);
  assert.match(html, /Ship &lt;it&gt;/);
  assert.match(html, /Release signals/);
  assert.match(html, /config\/auth\.json/);
});
