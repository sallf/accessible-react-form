# Independent final QA — 260930-zero-css-components

Date: 2026-10-02. This is the 91-test intermediate QA snapshot; independent review subsequently found the additional cases recorded in final4-review-result.log. Source frozen during QA. No source files or Git state were changed by these gates. Existing ports 6006 and 6007 were preserved; QA's server on 6008 was stopped after the suite.

## Requested final gates

| Gate                                                                      | Result                                                       | Evidence                           |
| ------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------- |
| Root `npx tsc --noEmit`                                                   | PASS, exit 0                                                 | `final4-root-tsc.log`              |
| `npm run lint`                                                            | PASS, exit 0; one `react-hooks/incompatible-library` warning | `final4-lint.log`                  |
| `npm run format:check`                                                    | PASS, exit 0                                                 | `final4-format-check.log`          |
| `npm run build-storybook` (includes library build)                        | PASS, exit 0                                                 | `final4-build-storybook.log`       |
| Site `npx tsc -b site`                                                    | PASS, exit 0                                                 | `final4-site-tsc.log`              |
| Safe Storybook copy to `site/public/storybook`                            | PASS, `index.html` present                                   | `final4-storybook-copy.log`        |
| Site `npx vite build site` after copy                                     | PASS, exit 0; expected >500 KB bundle-size warning           | `final4-site-vite.log`             |
| Package CSS check                                                         | PASS, exit 0; no stylesheets in 28 packaged files            | `final4-package-css.log`           |
| Full Storybook interaction/axe suite                                      | PASS: 14 suites, 91 tests, 0 snapshots, exit 0               | `final4-storybook-suite.log`       |
| Built declarations fixture `npx tsc -p scripts/fixtures/form-integration` | PASS, exit 0; includes negative native-prop checks           | `final4-form-integration.log`      |
| Full `node scripts/test-recipes.mjs`                                      | PASS, exit 0; `CopiedRecipeConsumer: PASS`                   | `final4-recipes.log`               |
| Invalid recipe filter `RECIPES_TEST=RecipeCopyFile`                       | EXPECTED FAIL, exit 1; lists all five available names        | `final4-invalid-recipe-filter.log` |
| `git diff --check`                                                        | PASS, exit 0                                                 | command output in QA session       |

A preliminary site Vite invocation happened before the Storybook copy. Its log was replaced by the required CI-order build log; its individual result is therefore unverified. The recorded PASS above is the post-copy production build.

## Earlier requested checks verified from existing artifacts

- Root and site clean installs, route/mobile browser checks, copied-source checks, and prior type/build gates are documented in `../checks.md` with sibling logs. These were inspected and not repeated.
- Root and site production audits: zero findings each (`../root-production-audit.log`, `../site-production-audit.log`).
- Full site audit: zero findings (`../site-audit.log`). Full root audit: five moderate findings, all documented as uuid-related development test-tool dependencies (`../root-audit.log`, `../../readiness-audit/dependencies.md`).
- React 18/minimum React Hook Form isolated compatibility: PASS for install, typed package declarations, consumer build, Chromium rendering, external file validation, reset/submit behavior, and package imports. Evidence: `../../readiness-audit/react18.md` and its linked isolated-fixture artifacts; audit report only.

## Contract review

**MET** for the requested consumer-readiness and external-validation criteria, based on the two root specs, existing earlier public-behavior specs, public Storybook suite, built declaration fixture, full recipe consumer test, existing browser/copy checks, and docs/source review. Alpha install snippets consistently use `accessible-react-form@next`; recipe test uses the same string. Documentation accurately describes schema resolver ownership, forwarded native props versus registered validation, nested fields and form-wide issues, typed external methods and precedence, File/FileList/string defaults and reset behavior, and comma-separated TagInput limits. External required registration behavior and the FileUpload validator/reset/submission fixes are covered by the 91-test full suite and recorded public red/green evidence in `../../external-validation/implementation.md`.

The pre-existing accepted lint and bundle-size warnings remain. No deployment, publication, merge, or commit was performed.
