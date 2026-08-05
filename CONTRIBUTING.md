# Contributing

Thanks for your interest in contributing! This is a small project, so the process is light.

## Development

This repo has two npm projects:

- **Root** — the library itself, plus Storybook
- **`site/`** — the marketing site and docs

```sh
git clone https://github.com/sallf/accessible-react-form
cd accessible-react-form
npm install
npm install --prefix site
```

Common commands:

```sh
npm run storybook        # open Storybook on :6006
npm run build-lib        # build the library
npm run build-storybook  # build static Storybook
npm test                 # build Storybook + run story tests (play functions + axe a11y checks)
npm run test-storybook   # same tests against an already-running Storybook dev server

cd site
npm run dev              # dev server for marketing + docs site
npm run build            # full prod build (lib → storybook → site)
```

## Reporting bugs

Open an issue with:

- A minimal repro (StackBlitz / CodeSandbox preferred over a description)
- React version, library version
- Expected vs. actual behavior

For accessibility regressions, please mention the assistive tech you tested with (screen reader + browser).

## Pull requests

`main` is protected: all changes land via pull request, and merging requires an
approving review plus passing CI (the **Typecheck & build**, **Lint & format**,
and **Storybook tests (a11y)** checks).

1. Fork, branch off `main`, make your changes
   - We name branches with a `YYMMDD-` date prefix (e.g. `260805-ci-lint-format`)
     — feel free to follow suit, though it's not required for fork branches
2. Run `npm run lint` and `npm run format:check` locally
3. Make sure CI passes: typecheck, builds, lint/format, and Storybook tests (`npm test`)
4. If you change a component, add or update a Storybook story
5. Keep PRs focused — one logical change per PR
6. Include a test plan in the PR description (story tests where possible, manual steps otherwise)

## Versioning

This project follows [semver](https://semver.org) with the usual pre-1.0
convention: **minor** versions (`0.2.0`) may contain breaking changes,
**patch** versions (`0.1.1`) are always safe upgrades. Releases are cut early
and often — any user-facing change is a fine reason for a release.

## Releasing (maintainers only)

1. Bump `version` in root `package.json` (lands on `main` via PR)
2. Tag the release from `main`: `git tag v0.x.y && git push origin v0.x.y`
3. The release workflow verifies the tag is on `main` and matches
   `package.json`, runs typecheck + lint, publishes to npm (trusted
   publishing + provenance — no token involved), and creates a GitHub
   release with generated notes

## Code of conduct

By participating, you agree to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md).
