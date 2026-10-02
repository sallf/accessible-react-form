# External validation correction evidence

Current approved contract (2026-10-02 06:00 UTC): native capture runs the consumer callback once, then derives required from the final native FileList. All programmatic file updates must render before schema-free validation/submission. There is no registration subscription or ref restoration. Final6 supersedes the earlier synchronous programmatic-update experiments, retained below as an honest review/correction record.

Initial source freeze: 2026-10-02 05:04 UTC. Three new public Storybook/form regressions; no helper-only tests, private RHF state access, public API changes, or Git/server mutations.

Slice command:

`npx test-storybook --url http://127.0.0.1:6007 --includeTags external-validation-regression --maxWorkers=1 --no-cache`

1. **ConsumerFileValidators**
   - Red: blocked uploaded files submitted successfully; expected no submit callback, received one. Output: `file-validators-red.log`.
   - Fix: FileUpload never supplies validate. Its explicit required prop enables the built-in required rule only while the current logical File/FileList/string value is empty, preserving required presentation. Valid logical defaults bypass the native empty-file-input required check without replacing consumer validators.
   - Green: omitted/false/true required cases preserve consumer async functions and validator maps, messages, and error types after native upload and File/string resets. Immediate submission rejects blocked values and accepts corrected values. Output: `file-validators-green.log`.
2. **OmittedRequiredRules**
   - Red: all empty externally required controls submitted successfully; expected no submit callback, received one. Prior file-validator story passed. Output: `omitted-required-red.log`.
   - Fix: omit required registration options when the prop is undefined across shared Input, Select, TextArea, and TagInput. Text/Date/Checkbox forward undefined instead of coercing it to false. FileUpload also preserves omitted required registration.
   - Green: all eight controls preserve consumer required messages, invalid associations, and required error type, including both TagInput modes. Output: `omitted-required-green.log`.
3. **ExplicitRequiredChanges**
   - Coverage of maintained semantics, no additional production fix required: true rejects missing values, false clears a prior library requirement, true restores it across every control. A reset logical File remains accepted and announced required; clearing it immediately restores missing-file feedback with error type required.

Final focused command:

`npx test-storybook --url http://127.0.0.1:6007 --includeTags external-validation-regression file-lifecycle-regression required-regression --maxWorkers=1 --no-cache`

- `scoped-stories.log`: 18 focused stories pass with zero axe violations (three new, seven lifecycle, eight required).
- `root-typecheck.log` and `site-typecheck.log`: pass.
- `scoped-lint.log`: changed component/story lint passes.
- Changed source/spec/tracker formatted with Prettier.
- Expected full Storybook count: 87, after adding three stories to the previously verified 84.

Coordinator owns incremental independent review, full QA, and integration. Source remains frozen; only local evidence/status was written after the freeze notice.

## Same-handler reset correction

Source frozen again: 2026-10-02 05:13 UTC. Independent review found render-only conditional required rules stale during resetField followed by handleSubmit in one event handler.

- Red: new SameHandlerFileResetSubmission cleared a previously populated default with resetField and immediately submitted the empty string. The submit spy unexpectedly received one call. Output: `same-handler-red.log`.
- Fix: explicit file required rules now also synchronize through the public watch callback, before React renders. Matching field or whole-form value notifications register only current required and effective disabled options. Consumer validate rules remain untouched. The subscription unsubscribes on cleanup, including required/disabled/method changes. Registration publishes no value notification, avoiding a feedback loop.
- Green: same-handler resetField rejects empty strings and empty FileLists with required type/fallback; accepts restored Files and populated FileLists; preserves async consumer validator rejection and recovery for strings. Whole-form reset clear/restore also validates current required semantics. Output: `same-handler-green.log`.
- Final focused run passes 19 stories (four external-validation, seven lifecycle, eight required), with zero axe violations. Root/site typechecks, changed-file lint, and formatting pass: `same-handler-root-typecheck.log`, `same-handler-site-typecheck.log`, `same-handler-lint.log`, `same-handler-format.log`.
- Expected full Storybook total: 88. No Git/server mutations or private RHF access.

The spec states the existing limits: setValue with shouldValidate true may validate before notification; whole-form reset retains RHF's normal cleared-registration lifecycle. No new consumer-validator persistence promise is made across same-handler whole-form resets.

Only this evidence file was edited after the second freeze. Coordinator owns follow-up gates and integration.

## Final3 review corrections

Source frozen: 2026-10-02 05:22 UTC. All three independent findings were reproduced at public Storybook/form boundaries before production changes.

- ParentPathFileSubmission: red submitted an empty nested file after parent-path setValue and immediate handleSubmit. Watch filtering now includes ancestor names followed by dot/bracket boundaries, in addition to exact and unnamed notifications. Green rejects the cleared value and accepts restoration before a render.
- DisabledFileResetSubmission: red raised required errors after same-handler whole-form reset on disabled required files. Render, notification, and native-change registration now keep the library required rule false while effectively disabled. Green local and global disabled panels submit without required errors and remain disabled.
- OnChangeFileRequired: red left aria-invalid false after uploading then selecting an empty FileList in onChange mode. The native capture handler now synchronizes required before RHF's bubble handler decides whether to validate. It composes the consumer capture callback once. Green selects, clears with required feedback, and recovers; consumer capture observes exactly three events.

`final3-red.log` contains three new failures and four existing external-validation passes. `final3-green.log` contains 22 scoped passes, zero axe violations (seven external-validation, seven lifecycle, eight required). `final3-root-typecheck.log`, `final3-site-typecheck.log`, `final3-lint.log`, and `final3-format.log` pass. Expected full suite: 91 stories.

No private RHF access, public API expansion, Git or server changes. Source remains frozen after 05:22 UTC; coordinator owns final gates/integration.

## Final4 review corrections

Source frozen: 2026-10-02 05:33 UTC. Independent review found raw path aliases missed by notification filtering and missing native references immediately after whole-form reset.

- AliasedFilePathSubmission: red accepted an empty items[0].file after setValue('items.0', { file: '' }) and immediate submit. The watch callback now refreshes the current file rule on every value notification, without raw path filtering. Green rejects clearing and accepts restoration in the same handler.
- WholeResetFileListSubmission: red accepted an empty FileList after whole-form reset and immediate submit. A private Input ref observer retains the actual native element; the watch callback uses the public registration's ref callback to restore it after registrations are reset. RHF then recognizes native-empty FileLists. Existing attachments are unchanged, avoiding native selection loss. Green rejects the empty list with required type/fallback and accepts a populated list with correct submitted filename.

`final4-red.log`: two new failures, seven existing external-validation passes. `final4-green.log`: 24 scoped passes (nine external-validation, seven lifecycle, eight required), zero axe violations. `final4-root-typecheck.log`, `final4-site-typecheck.log`, `final4-lint.log`, and `final4-format.log`: pass. Expected full suite: 93 stories.

Existing callback, native-selection, previews/URLs, logical defaults, disabled, consumer-validator, onChange validation, and reset tests remain green. No private RHF access, public prop/type expansion, Git or server mutation. Existing documented shouldValidate timing and whole-form-reset consumer registration lifecycle remain the limits; no additional concrete defect was left unresolved. Only ignored evidence edited after freeze; coordinator owns gates.

## Final5 scope correction and registration lifecycle

Source frozen: 2026-10-02 05:47 UTC. Review found that synchronous whole-form reset support added by this correction interfered with upstream registration lifecycle. Unnamed value notifications represent both reset and unregister, and cannot safely be distinguished using the supplied public methods. Re-registering/reattaching during these notifications resurrected removed fields and altered disabled tracking. This added guarantee was beyond the original file preview/reset/default requirements.

With coordinator approval, remove the native-ref observer/restoration and same-handler whole-form reset guarantee. Ignore unnamed notifications. Synchronize only named exact/ancestor paths using canonical dot/bracket segments, preserving named setValue/resetField and native-capture behavior while avoiding unrelated work. Whole-reset File/string/empty/populated FileList fixtures remain, using separate reset then submit interactions after React renders. README, ComponentPage, and root spec state that boundary explicitly. Existing shouldValidate timing limit also remains.

- RemovedFileSubmission red: conditional removal plus unregister/sibling setValue and immediate submit resurrected the empty required file. Green submits without the removed value and confirms the control disappeared.
- UnrelatedFileNotification red: unrelated setValue caused file registration. Green observes zero registrations at the supplied public register boundary.
- DisabledConsumerResetLifecycle already passed the normal reset-render-submit path before the fix; it remains as protection for a rejecting external validator skipped on disabled controls before and after keepDirtyValues reset. No synthetic red was claimed. Same-handler whole-form reset is explicitly outside the supported validation boundary, including retained validator/disabled metadata; no new immediacy promise is made.

`final5-red.log`: two new failures, ten passes including the disabled lifecycle fixture. `final5-green.log`: 27 scoped passes (12 external-validation, seven lifecycle, eight required), zero axe violations. `final5-root-typecheck.log`, `final5-site-typecheck.log`, `final5-lint.log`, and `final5-format.log`: pass. Expected full suite: 96 stories.

No private RHF state, new public API, Git or server mutations. Original reset previews/defaults, logical file validation after render, callback/disabled behavior, consumer validation, URL lifecycle and named update tests remain green. Only ignored evidence edited after source freeze; coordinator owns gates/integration.

## Final6 simplification and single-owner fixtures

Source frozen: 2026-10-02 06:00 UTC. Follow-up review showed canonical named subscriptions still resurrected a removed nested file when its parent changed. Registration subscriptions cannot safely own RHF lifecycle without registration state unavailable through the narrowed public API. With coordinator approval, remove the subscription entirely; preview watch(id) remains. All programmatic updates (defaults, setValue, resetField, reset) render before schema-free validation/submission. This withdraws self-added atomic programmatic guarantees, preserving the original lifecycle requirements. README, ComponentPage and root spec explicitly state the boundary and shouldValidate caveat; schema resolvers can validate logical values independently of the native picker.

- RemovedNestedFileSubmission red: remove profile.file, unregister it, update profile, then submit in the same handler resurrected the required field. Green submits without profile.file and the control disappears.
- ConsumerCaptureFileChange red: consumer capture cleared the native selection after the library derived required, leaving onChange aria-invalid false. The consumer callback now runs once before a shared fileRules calculation reads final files. Green shows required feedback, no stale preview, and required submission failure; capture runs once.
- A single fileRules calculation serves rendering and capture. No registration subscription, path filter, private ref observer, public API change, or private RHF access remains.
- Every external-validation fixture now uses a native form owned by its supplied useForm methods. The omitted consumer required fixture validates correctly through both its submit button and Enter in the text input, eliminating the prior second ARForm owner.
- ProgrammaticFileUpdates replaces the misleading same-handler fixture name. All File/FileList/string/empty/resetField/whole-reset and consumer-validator cases remain through separate update, render, and submit interactions. Parent/alias fixtures explicitly use public aggregate watch(), assert changed preview before submission, and retain dot/bracket value coverage. Original file-lifecycle stories remain unchanged and green.

`final6-red.log`: two new failures, 12 existing passes. `final6-green.log`: 29 scoped passes (14 external-validation, seven lifecycle, eight required), zero axe violations. `final6-root-typecheck.log`, `final6-site-typecheck.log`, `final6-lint.log`, and `final6-format.log`: pass. Expected full suite: 98 stories.

No Git/server mutations. Only ignored evidence was edited after freeze. Coordinator owns gates/integration.

## Final7 documentation disposition

Documentation/spec freeze: 2026-10-02 06:11 UTC. Runtime and stories remain unchanged since final6; expected full count stays 98. The report is `.scratch/consumer-readiness/gates/final7-review-result.log`.

1. Consumer-required logical defaults: clarify the intended preservation contract rather than modifying consumer rules. Explicit component required handles logical defaults; when omitted, consumer required remains RHF's native-file rule and may reject the empty browser picker even with a logical default. The old passing baseline erased that rule and is not evidence of correct preservation. README, ComponentPage, and root spec now state the distinction; coordinator owns independent resolution review against direct native RHF behavior.
2. Parent/alias update rendering: docs now recommend reset/resetField, explain that waiting alone does not trigger a render, and show public methods.watch() in the owning form's render before a separate parent-path setValue handler. Submission follows actual preview rendering. Existing arbitrary File-identity setValue notification limit remains documented.
3. Compatibility evidence: coordinator's final7 React18 report refresh corrected the stale intermediate body; this implementation pass did not edit that evidence.

`final7-doc-format.log` passed. The initial report incorrectly called `final7-doc-lint.log` passing; it contained two unescaped JSX apostrophe errors. Independent QA caught both. The coordinator escaped those characters without changing rendered wording; the independent verification is recorded in consumer-readiness/gates/doc-lint-fix-result.log. No runtime, Storybook, Git, or server mutation. Only ignored disposition evidence edited after documentation freeze; coordinator owns targeted independent review and integration.

## Final independent disposition

Full QA passed 98 tests and all build/type/package/recipe checks. The independent resolution review confirmed 48 RHF 7.75/React 18 probes: omitted required preserves native consumer-rule semantics, explicit required handles logical defaults, and documented aggregate watching renders parent-path updates. Final7 source and package hashes match. The docs-only supplement passed build/browser checks; its two JSX lint errors were fixed and independently rechecked. Reports are in ../consumer-readiness/gates/{final7-qa-result,resolution-review-result,resolution-qa-result,doc-lint-recheck-result}.log. No unresolved actionable review finding remains under the documented contract.
