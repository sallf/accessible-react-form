# CI dependency installation repair

Status: implemented; independent review and local QA passed. Commit approved in conversation; a subsequent GitHub CI run awaits push authorization.

The October 1 GitHub Actions run failed before lint, typechecks, builds, or Storybook tests started. Root `npm ci` rejected incomplete lockfile entries. Reproduced in a temporary copy containing only the root/site manifests and lockfiles.

Regenerated the root lockfile with npm, including validation with npm 10.8.2 used by the failed CI run. Added missing transitive dependency records and updated the shared `@emnapi/wasi-threads` resolution from 1.2.1 to 1.2.3, retaining nested versions required by other packages. No direct dependency ranges changed. The site lockfile already passed and remains unchanged.

Changed CI from Node 20 to Node 22, matching the release workflow and the minimum major required by Chromatic and concurrently.

Evidence:

- `baseline.log`: original root install rejection.
- `npm-10.8.2.log`: older npm also identifies missing nested dependencies and ajv.
- `npm-10.8.2-install.log`: repaired root clean install succeeds with lifecycle scripts disabled.
- `root-current.log`, `root-ci-npm.log`, `site-ci-npm.log`: final dry-run checks all exit 0, using local npm and CI's npm 10.8.2.

These checks used a temporary copy and did not modify the working checkout's installed dependencies. GitHub CI cannot validate the new contents until the user authorizes pushing the approved commits. No push or deployment was performed.
