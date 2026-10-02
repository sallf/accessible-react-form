Compatible lock updates clear both site findings and all root high/low findings. The preparation experiments ran in isolated manifest/lock copies. The chosen locks have now been applied in the consumer-readiness batch; manifests and Git state remain unchanged.

| Experiment                        | Audit before              | Audit after | Changed lock package entries   |
| --------------------------------- | ------------------------- | ----------- | ------------------------------ |
| Site, compatible audit fix        | 1 high, 1 moderate        | 0           | 2                              |
| Root, targeted compatible updates | 7 high, 8 moderate, 2 low | 5 moderate  | 70 (57 distinct package names) |
| Root, compatible audit fix        | same                      | 5 moderate  | 71 (58 distinct package names) |

Site updates are exactly `valibot 1.3.1 → 1.5.0` and `nanoid 3.3.17 → 3.3.19`. Valibot is a site runtime dependency; 1.5.0 fits the existing `^1.3.1` range and clears GHSA-5qjj-4xww-7phc. Nanoid is a build dependency. Both manifests remain unchanged.

Use the targeted root update to keep Storybook test-runner at 0.24.4 and React Hook Form at the minimum peer version 7.75.0. The wider audit fix also moves test-runner to 0.24.5 without reducing the remaining findings. Commands validated in isolated manifest/lock copies:

```sh
npm update --package-lock-only --ignore-scripts @babel/core axios baseline-browser-mapping brace-expansion fast-uri joi js-yaml nanoid qs valibot
npm update --package-lock-only --ignore-scripts browserslist esbuild
npm audit fix --prefix site --package-lock-only --ignore-scripts
```

Root security-relevant results: Babel core 7.29.0 → 7.29.7; axios 1.19.0 → 1.20.0; baseline-browser-mapping 2.10.27 → 2.11.27; brace-expansion 1.1.18 → 1.1.21, 2.1.4 → 2.1.7, 5.0.9 → 5.0.12; browserslist 4.28.2 → 4.29.3; esbuild 0.27.7 → 0.28.2; fast-uri 3.1.5 → 3.1.8; joi 17.13.4 → 17.13.8 and 18.2.3 → 18.2.9; js-yaml 3.14.2 → 3.15.2 and 4.1.1 → 4.3.2; nanoid 3.3.17 → 3.3.19; qs 6.15.3 → 6.16.0; valibot 1.3.1 → 1.5.0. Other changes are compatible Babel/browser-data dependencies and platform copies of esbuild. Storybook explicitly accepts esbuild ^0.28.0.

The five remaining moderate root entries are `uuid`, `@storybook/test-runner`, `jest-junit`, `nyc`, and `istanbul-lib-processinfo`, all tracing to uuid <11.1.1 (GHSA-w5hq-g745-h8pq). Test-runner 0.24.5 still requests uuid ^8.3.2. npm suggests a breaking downgrade to test-runner 0.23.0; do not force that downgrade or override uuid across majors merely to clear the report. These are development test-tool dependencies; root production audit is clean.

This preparation verified dependency resolution and audit results only. After applying chosen locks, run clean installs and the final build/test gates, especially Storybook and Valibot recipes. No full suite ran during preparation.

Ignored local evidence: `root-before.json.log`, `root-targeted-after.json.log`, `root-targeted-changes.json.log` (all 70 exact changes), `site-before.json.log`, `site-after.json.log`, and `site-changes.json.log`. `targeted-temp-path.log` locates the targeted root lock; `temp-path.txt.log` locates the audit-fix root/site locks. These local paths and raw artifacts should remain uncommitted.

Applied results: the exact targeted root lock and site audit-fix lock passed clean `npm ci` installs. Root React Hook Form remains 7.75.0. Root/site production audits both report zero; the full site audit reports zero and the full root audit retains the five moderate uuid-related development-tool entries described above. Root/site typechecks, library/Storybook/site production builds, and the no-package-CSS check pass. Focused docs browser checks pass. Full Storybook/recipe regression gates remain with the coordinator. Logs are in `.scratch/consumer-readiness/*.log`. The site lock also refreshes stale root devDependency metadata to match the unchanged current manifest.

Final regression gates passed: 98 interaction/accessibility tests, recipe/isolated-consumer checks, and all root/site builds and checks. See ../consumer-readiness/final-gates.md.
