# Contributing

Thanks for your interest in contributing! This is a small project, so the process is light.

## Development

This repo has two npm projects:

- **Root** — the library itself, plus Storybook
- **`site/`** — the marketing site and docs

```sh
git clone https://github.com/adam-rho/accessible-react-form
cd accessible-react-form
npm install
npm install --prefix site
```

Common commands:

```sh
npm run storybook        # open Storybook on :6006
npm run build-lib        # build the library
npm run build-storybook  # build static Storybook

cd site
npm run dev              # dev server for marketing + docs site
npm run build            # full prod build (lib → storybook → site)
```

## Reporting bugs

Open an issue with:
- A minimal repro (StackBlitz / CodeSandbox / Stackblitz preferred over a description)
- React version, library version
- Expected vs. actual behavior

For accessibility regressions, please mention the assistive tech you tested with (screen reader + browser).

## Pull requests

1. Fork, branch off `main`, make your changes
2. Make sure CI passes: typecheck, library build, site build, Storybook build
3. If you change a component, add or update a Storybook story
4. Keep PRs focused — one logical change per PR
5. Include a test plan in the PR description (manual is fine; this repo has no test suite yet)

## Releasing (maintainers only)

1. Bump `version` in root `package.json`
2. Tag the release: `git tag v0.x.y && git push origin v0.x.y`
3. The release workflow publishes to npm with provenance

## Code of conduct

By participating, you agree to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md).
