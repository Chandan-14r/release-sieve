# release-sieve

**A tiny release analyst for Git repositories.** `release-sieve` converts the commits between a base ref and `HEAD` into a clear Markdown release brief: categorized change notes, a footprint summary, lightweight risk signals, and a ship checklist.

It is intentionally dependency-free and works offline—useful when release notes need more judgment than `git log`, but less ceremony than a release-management platform.

## What it does

- Groups conventional commits into features, fixes, performance, and maintenance
- Summarizes files touched and lines added/removed
- Flags paths and messages that often warrant a closer release review
- Produces human-editable Markdown for PRs, changelogs, or release channels
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
- JSON output for release pipelines
- Link commits to issue and pull-request metadata

## License

[MIT](LICENSE)
