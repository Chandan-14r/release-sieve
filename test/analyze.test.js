import test from "node:test";
import assert from "node:assert/strict";
import { analyzeHistory, renderMarkdown } from "../src/analyze.js";

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
