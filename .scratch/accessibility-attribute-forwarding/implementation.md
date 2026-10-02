# Accessibility attribute forwarding: implementation evidence

Approved public seam: Storybook fixtures using public components, ARForm, and explicitly supplied React Hook Form methods. No mocked component collaborators or helper-level tests.

Scoped command for each vertical slice:

`npx test-storybook --url http://127.0.0.1:6007 --includeTags attribute-regression --maxWorkers=1 --no-cache`

1. **NativeControlIds**
   - Red: expected native Text `id="name"`, received `null`; one story failed.
   - Change: forward the existing ID on shared input, select, and textarea.
   - Green: one story passed. All six control IDs resolve through document lookup; implicit labels work; wrapper and explicit-method fixtures submit the original field keys/values, including uploaded File data.
2. **FieldHelpAndErrors**
   - Red: expected `aria-describedby="first-help second-help"`, received `null`; NativeControlIds stayed green.
   - Change: internal whitespace token merge for shared input/select/textarea, consumer references first and rendered error reference last. Checkbox error remains associated even with its internal `showError={false}`.
   - Green: two stories passed. All six fields retain external multiple help texts before failure, alongside schema messages, and after valid resubmit; submission is blocked while invalid.
   - Fixture correction: invalid labels include wrapper-rendered errors, so label queries use their stable starting text. Schema messages omit final punctuation because FieldError supplies it.
3. **DescriptionTokenHandling**
   - Red: expected TagInput `token-help other-help`, received `token-help token-help other-help`; prior two stories passed.
   - Change: normalize TagInput's consumer textbox references before validation.
   - Green: three stories passed. Covers absent, empty, whitespace-only, repeated, multiple, error-only, and explicit consumer error references surviving recovery.
4. **TagInputHelpAndErrors**
   - Red: expected group help followed by required reference without duplicates; received duplicate `tag-help` before the required reference; prior three stories passed.
   - Change: merge textbox help/error references together and merge suggestions-group help/required/error references in that order.
   - Green: four stories passed. Both modes retain descriptions through validation and recovery; tags remain interactive and submit through original registration names.

Added four terminal-state companion stories so the existing shared axe runner checks native and TagInput initial and invalid states. It also checks the recovered states of the named stories. Eight focused stories passed with zero axe violations. The addon automatic a11y test is off for these fixtures to avoid overlapping axe runs; the required shared runner still always executes its axe check. A direct axe-in-play experiment was removed after it overlapped automatic runs.

Final scoped results:

- `scoped-stories.log`: eight stories passed, zero axe violations.
- `root-typecheck.log`: `npx tsc --noEmit` passed.
- `site-typecheck.log`: `npx tsc --noEmit -p site/tsconfig.json` passed.
- Changed source files formatted with Prettier.

No Git mutations, public API additions, validation-policy changes, file lifecycle changes, or example styling changes. Parent owns separate CI repair and final broad verification/review/QA.

## Independent review follow-up: consumer accessible names

- `ConsumerAccessibleNames` red: suggestions-only TagInput could not be found as group `Referenced group custom name`; its name remained `Referenced group`. Eight prior attribute stories passed. Full output: `accessible-names-red.log`.
- Minimal change: suggestions groups preserve consumer `aria-labelledby`; if only a nonempty consumer `aria-label` exists they omit the generated `aria-labelledby`. With neither consumer name, the generated label reference remains the fallback. Visible textbox naming and native naming remain forwarded as before.
- Green: all nine attribute stories passed, zero axe violations. New coverage checks reference precedence when both naming props exist, label-only naming, and generated fallback in both TagInput modes; shared input/select/textarea naming attributes also remain intact. Full output: `accessible-names-green.log`.
- Root and site typechecks rerun successfully; changed files formatted.
- Unrelated whitespace-only suggestions and duplicate prop filtering left outside this fix.

## Previous gate status

Full QA passed 51 Storybook interaction/axe tests, root/site typechecks, lint, formatting, all production builds, package assertions, and recipe browser/isolated-consumer checks. Results: `gates/final-qa-result.log`.

The preceding review found a naming regression: in suggestions-only TagInput, empty or whitespace-only `aria-labelledby`, or whitespace-only `aria-label`, can suppress the generated label reference and leave the group unnamed. The focused fix below treats blank naming values as absent when choosing the fallback and adds public regression coverage; independent gates are pending. See `gates/final-review-result.log`.

The user approved another focused fix pass after the second review finding round. Blank-name regression coverage and the fallback correction are fixed and pass scoped verification; independent gates are pending. All work remains uncommitted. The unrelated pre-existing suggestion normalization and prop-filtering findings are tracked separately in `.scratch/taginput-followups/review-findings.md`.

## Approved focused follow-up: blank consumer accessible names

- `BlankConsumerAccessibleNames` red: a genuinely empty `aria-labelledby=""` prevented finding the suggestions group named `Empty reference`; all nine existing attribute stories passed. Output: `blank-names-red.log`.
- Minimal change: inspect naming strings with `trim()` to select precedence and fallback, but forward the original nonblank string unchanged. Empty/whitespace `aria-labelledby` is absent for naming selection; a nonblank `aria-label` wins next; otherwise the generated label reference remains.
- Fixture correction during the first fix run: JSX quoted `\t`/`\n` were literal backslash strings. The final fixtures use JavaScript string expressions for real tabs/newlines, plus a separate plain spaces-only case. The original red failure used a true empty string and was unaffected by this correction.
- Green: all ten attribute stories passed, zero axe violations. The new public story covers empty strings, real tabs/newlines, plain spaces, both naming props blank, blank reference with valid label, valid reference with blank label, and absent fallback. It asserts preservation of valid consumer naming strings including surrounding spaces. Existing `ConsumerAccessibleNames` stays green.
- Output: `blank-names-green.log`. Root/site typechecks rerun successfully and changed source formatted.
- No unrelated changes or Git mutations. Source frozen for final gates.

## Approved follow-up: final results

Independent review found no actionable correctness or quality issues in the new changes since `7193738`: `gates/approved-review-result.log`. Full QA passed all 52 interaction/axe tests across nine suites and every build/static/package/recipe check: `gates/approved-qa-result.log`.

All six named criteria are met through their public Storybook regressions: NativeControlIds, FieldHelpAndErrors, DescriptionTokenHandling, TagInputHelpAndErrors, ConsumerAccessibleNames, and BlankConsumerAccessibleNames. Existing watch lint and bundle-size warnings remain nonblocking.

The separate CI repair passed local installation checks and review. The user approved committing these verified changes. GitHub CI requires separate push authorization to check the new contents. Nothing was pushed, merged, published, or deployed. The unrelated pre-existing TagInput findings remain tracked separately.
