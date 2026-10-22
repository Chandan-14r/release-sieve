# release-sieve

**A tiny release analyst for Git repositories.** `release-sieve` converts the commits between a base ref and `HEAD` into a clear Markdown release brief: categorized change notes, a footprint summary, lightweight risk signals, and a ship checklist.

It is intentionally dependency-free and works offline—useful when release notes need more judgment than `git log`, but less ceremony than a release-management platform.

## What it does

- Groups conventional commits into features, fixes, performance, and maintenance
- Summarizes files touched and lines added/removed
- Flags paths and messages that often warrant a closer release review
- Produces human-editable Markdown for PRs, changelogs, or release channels
- Exports stable JSON for release dashboards, CI checks, and delivery bots
- Generates a polished, self-contained HTML brief for async release reviews
- Runs on Node.js 18+ with no install step

## Quick start

```bash
git clone https://github.com/Chandan-14r/release-sieve.git
cd your-project
node ../release-sieve/bin/release-sieve.js v1.4.0 --title "October reliability release"
```

Or install it globally from a checkout:

```bash
npm install -g /path/to/release-sieve
release-sieve HEAD~8 --out release-brief.md
```

### Automate a release gate

Use JSON when another tool needs to decide how to handle the release. The payload includes a schema version, categorized commits, file-level footprint, and a `riskSignalCount` that is `0` when no automatic concerns were found.

```bash
release-sieve v1.4.0 --format json --out release-brief.json
node -e "const r = require('./release-brief.json'); process.exit(r.summary.riskSignalCount ? 1 : 0)"
```

`--format markdown` remains the default. JSON is deliberately local and deterministic, making it suitable for CI artifacts without an API token.

### Share an async release review

Create an attractive, standalone review page that can be attached to a release ticket or opened locally—no build pipeline or hosted dashboard required.

```bash
release-sieve v1.4.0 --title "October reliability release" --format html --out release-brief.html
```

The HTML report includes the release footprint, categorized commits, risk signals, and a ship checklist. It is self-contained and safely escapes commit subjects and paths.

## Example output

```md
# October reliability release

## At a glance
- **8** commits across **14** files
- **+268 / -71** lines

## Release signals
- Review sensitive paths: `src/auth/session.js`.
```

## Development

```bash
npm test
npm run check
```

## Design notes

The tool reads only local Git metadata and writes nothing unless `--out` is supplied. Risk signals are prompts for review, not claims that a release is unsafe.

## Future ideas

- Configurable classification rules for team conventions
- Link commits to issue and pull-request metadata

## License

[MIT](LICENSE)
