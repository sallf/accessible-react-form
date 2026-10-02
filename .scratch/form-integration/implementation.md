# Form integration evidence

Baseline: `e1cf216`. Approved seams: exported Storybook form components with public RHF methods, and an isolated TypeScript fixture importing the built package declarations. The coordinator owns Git and final independent gates. No known-red tests.

Focused story command:

`npx test-storybook --url http://127.0.0.1:6007 --includeTags <slice-tag> --maxWorkers=1 --no-cache`

- **NestedSchemaErrorsRecover:** `nested-red.log` reproduces the stale initial message after changing to another invalid value. Nested resolver output and a shared field lookup pass in `nested-green.log`.
- **ArrayAndMetadataErrors:** `array-red.log` shows the summary missing six actual errors across two containers. Recursive error counting passes array items and fields named type/message/ref/types in `array-green.log`. The invalid-state query was corrected to allow the existing label's appended error text; no accessible-name behavior was changed.
- **ParentAndChildSchemaErrors:** `parent-red.log` shows lost parent feedback. Ancestor issues become form-wide messages, while descendant errors stay beside fields. Both issue orders pass in `parent-green.log` and the later safety run.
- **UnsafeSchemaPathsRemainBlocking:** `unsafe-red.log` lacks the required visible path feedback, including a symbol path that cannot be joined into a native name. Complete-path validation routes prototype and unrepresentable segments to blocking form-wide messages. `unsafe-green.log` passes all five messages and confirms Object.prototype is unchanged.
- **TypedExternalMethods:** `typed-red.log` contains TS2322 for conventional typed external methods on every field. A full erased UseFormReturn still failed because RHF control internals retain invariant validation options. The shared field boundary therefore picks only register/watch/setValue/formState and erases shape generics there. `typed-green.log` is empty with exit zero after building current declarations; negative native-prop checks remain effective. CI now runs this fixture after the library build.
- **ExternalNestedErrors:** `external-green.log` verifies every native field and both TagInput modes with an external typed FormProvider and explicit methods inside a different ARForm. Public setError/clearErrors updates feedback and preserves help descriptions. This adds coverage to the earlier shared-lookup fix without another implementation change.
- **UpdatedChangeCallback:** `callback-red.log` shows the replacement callback called zero times. The watch subscription now follows the current callback and unsubscribes when removed. `callback-green.log` verifies replacement state, one notification per field change, and removal.

Summary traversal counts actual error branches, including message-less registered errors, while excluding metadata and DOM refs. Container fields named ref/types are retained. Unsafe paths never reach RHF's setter, avoiding its silent rejection or partial containers. Multiple issues on one field retain the existing single-message policy.

Final scoped checks:

- `scoped-stories.log`: 36 stories pass, covering eight integration stories, required/attribute/file lifecycle regressions, and existing whole-form schema errors. Zero axe violations; initial and invalid terminal fixtures are included.
- `handlers.log`: all three existing event-handler stories pass with zero axe violations.
- `root-typecheck.log`, `site-typecheck.log`, `typed-green.log`: typechecks pass.
- `final-build.log`: current library builds successfully.
- `scoped-lint.log`: no errors; the existing RHF watch/React Compiler warning remains.
- Changed source, fixture, spec, and CI configuration formatted with Prettier; git diff --check passes.

No full suite or independent gates run by the builder. No Git mutations, new servers, dependency changes, or port 6006 operations. Source frozen for coordinator review and full QA. The separately written `.scratch/readiness-audit/react18.md` concerns the prior file-lifecycle commit and is not evidence for this batch.

## First review findings and fixes

Coordinator QA passed all 75 tests. Independent review found two blockers: RHF strips pipe characters while parsing paths, which could leave an empty error object and permit submission; storing an error on an array's length could throw RangeError. Reports are under `gates/round1-*`.

- **PipePathsRemainBlocking:** `pipe-red.log` reproduces missing feedback for a pipe-only path. `pipe-green.log` passes pipe-only, disguised prototype, and ordinary pipe-containing paths. The guard rejects pipes before RHF parsing, and each original issue remains visible as blocking form-wide feedback.
- **ArrayLengthPathsRemainBlocking:** `array-length-red.log` reproduces missing feedback after index-first array storage collides with length. `array-length-green.log` passes numeric/string index paths in either order and retains ordinary object length feedback. A length-only issue on an actual current array also failed visibility (`array-length-only-red.log`); recognizing current arrays as well as array storage implied by issue paths passes `array-length-only-green.log`. No catch-and-drop exception handling is used.
- **ExternalParentAndChildErrorCount:** `external-parent-red.log` reproduces one summary error for a retained parent and child. `external-parent-green.log` counts both public setError branches in either order and verifies clearing/help recovery. Summary traversal now visits child branches alongside a parent error while skipping its own metadata.

Spec acceptance criteria name all three regressions. `round2-scoped-stories.log` passes all 14 integration/schema stories, including the new cases, with zero axe violations. `round2-typecheck.log` and `round2-lint.log` pass without errors or warnings. Changed files are formatted and git diff --check passes.

Source frozen again. The builder has not rerun full QA or independent gates; those must inspect and rebuild these corrected contents. No Git or server changes.

## Second review findings and fixes

Coordinator QA passed all 78 tests. Independent review found that RHF removes its reserved top-level root error bucket before deciding validity, and that the summary skipped a retained child named types beneath an external parent error. Reports are under `gates/round2-*`.

- **ReservedRootSchemaErrorsRemainBlocking:** `root-path-red.log` reproduces missing feedback for the reserved root bucket. `root-path-green.log` passes exact root and root.name issues as visible blocking form-wide feedback, including a collision with the existing form-error key. Ordinary nested ordinary.root retains local field feedback.
- **ExternalParentAndChildErrorCount:** `metadata-child-red.log` reproduces a count of two for three retained errors. Summary traversal recognizes RHF's retained child error ref marker under a metadata name. `metadata-child-feedback-red.log` then exposes a criteria map mistaken for native field feedback. Lookup now checks actual error leaves and metadata ancestors; real schema fields named types beneath a container remain supported. `metadata-child-green.log` passes the retained name/types children in either order and excludes a criteria map with keys type/message/ref.
- **ErrorContainersAreNotFieldErrors:** `metadata-containers-red.log` reproduces a public setError at account.message crashing a native account field because its error container's message is an object. The shared lookup now requires an actual error node. `metadata-containers-green.log` passes this recovery contract and the metadata fixtures. The final fixture also reaches a criterion array through a nonmetadata validator name and confirms no false invalid state.

The spec names reserved root handling, actual error lookup, retained child counting, and criteria metadata exclusions. It does not promise to recover field errors that RHF itself overwrites.

- `round3-scoped-stories.log`: all 16 integration/schema stories pass with zero axe violations.
- `round3-typecheck.log` and `round3-lint.log`: pass without errors or warnings.
- Changed files formatted; git diff --check passes.

Source frozen for third independent review and full QA. No full suite, Git mutations, new servers, or dependency changes by the builder.

## Third review findings and fixes

Coordinator QA passed all 80 tests. Independent review found that a retained message child can replace an actual parent error's message string with an object, crashing FieldError, and that metadata containers without their own ref hide retained descendants. Reports are under `gates/round3-*`.

- **ErrorContainersAreNotFieldErrors:** extended the public fixture to set errors at profile.account and profile.account.message. `nested-message-descendants-red.log` reproduces the trim crash. FieldError now trims only string messages and otherwise keeps its existing fallback. The parent fallback and child feedback both remain associated and count in the summary; overwritten parent text is not reconstructed.
- **MetadataDescendantErrors:** the same red log reproduces missing retained branch.types.name feedback and a count of one rather than two. Lookup recognizes the actual retained target leaf beneath metadata ancestors. Summary traversal visits retained leaves within metadata containers without treating criteria maps as errors. Both public setError orders pass. The fixture also sets criteria type/message/ref-array/validator-array values first, then adds a descendant which RHF preserves beside them; these values add neither summary errors nor native invalid state.
- `nested-message-descendants-green.log` passes four targeted stories, including the two regressions and existing direct-child/schema metadata contracts.
- `round4-scoped-stories.log` passes all 17 integration/schema stories with zero axe violations.
- `round4-required-stories.log` passes all eight required-validation stories with zero axe violations, preserving the existing fallback behavior.
- `round4-typecheck.log` and `round4-lint.log` pass without errors or warnings.
- Changed source, spec, and evidence formatted; git diff --check passes.

The spec now names fallback behavior for overwritten message strings, descendants beneath metadata names, and mixed criteria values. Source is frozen for fourth independent review and full QA. No full suite, Git mutations, dependency changes, or server operations by the builder.

## Final gates

Independent full-batch reviews identified the path/metadata findings recorded above. Each was fixed with public red/green regressions. The final independent review of the three-file change against the frozen third-round snapshot found no actionable findings and passed 24 focused checks. Full QA on the final source passed all 81 Storybook interaction/accessibility tests, root/site/consumer typechecks, lint/format, production builds, package stylesheet assertions, and recipe browser/isolated-consumer checks. Every spec criterion is met. Reports: `gates/round3-review-result.log`, `gates/round4-review-result.log`, and `gates/round4-qa-result.log`. A complete branch review remains part of final readiness verification.
