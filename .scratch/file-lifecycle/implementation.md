# File lifecycle implementation evidence

Public seam: Storybook interactions using ARForm, FileUpload, and supplied public React Hook Form methods. Browser URL revocation is observed at the real external resource boundary; generated URLs remain real and fetchable. No helper tests, polling, or private RHF patches.

Scoped slice command:

`npx test-storybook --url http://127.0.0.1:6007 --includeTags file-lifecycle-regression --maxWorkers=1 --no-cache`

1. **FileResetAndDefaults**
   - Red: `picked.txt` remained in the rendered preview after reset. Output: `reset-red.log`.
   - Change: preview derives from current watched File/FileList/string value rather than a separate picked-file state or fallback to old defaults. Consumer capture callback forwards unchanged.
   - Green: upload preview/submission agree; reset/resetField restore the saved string; clear removes old previews and submits empty string. Output: `reset-green.log`.
   - `ChangedFormDefaults` adds default File-to-File, selection-to-new-default, string default, and explicit empty-default coverage without another production change.
2. **RequiredLogicalFileValues**
   - Red: required File default omitted `aria-required="true"`. Output: `logical-required-red.log`.
   - Change: preserve required presentation and use an internal shared Input registration override to validate logical File, nonempty FileList, or nonempty string while suppressing native-file required semantics. Disabled handling and schema resolver precedence remain intact.
   - Green: defaults submit unchanged with required announcement; File/FileList/string resets submit; empty FileList/string/null/undefined reject with associated fallback/help; native correction recovers. Output: `logical-required-green.log` (initial three-story run); final scoped run includes undefined coverage.
3. **MediaUrlLifecycle**
   - Red: replacing the media file never called browser URL revocation for its previous preview. Output: `url-red.log`.
   - Change: create an owned object URL in an effect and revoke it during cleanup on replacement, clear, file-type change, or unmount. Removed asynchronous Image preloading entirely. Preview records include the File reference so an earlier file's resource cannot serve as its replacement preview.
   - Green: real preview URLs fetch successfully; exact old resources are revoked on replacement, binary switch, clear, and unmount. Consumer string URL is never revoked. Output: `url-green.log`.
   - The one-line set-state-in-effect lint exception documents the browser resource synchronization: creation occurs after commit and cleanup owns that URL; URL allocation during rendering would leak abandoned renders.
4. **FileCallbacksAndDisabled**
   - Red: nonempty native file `value`/`defaultValue` props throw the browser's file-setter exception. Output: `callbacks-native-values-red.log`.
   - Change: consume those inherited props before DOM forwarding; logical values continue to come from form methods/defaults.
   - Green: native input remains empty initially with logical default shown; selecting a real file composes consumer change/capture once; an isolated blur event invokes consumer blur once. Local/global disabled required controls skip validation and keep required announcement. Output: `callbacks-native-values-green.log`.
   - Fixture correction: simulated file chooser can independently blur; reset the blur spy before testing the separate focus/tab blur rather than treating two browser events as one.

Added initial and invalid terminal-state fixtures for the shared axe runner. Recovered named fixtures also receive axe checks. File/FileList access is guarded during render for server environments. No theme or public API additions.

Final focused command:

`npx test-storybook --url http://127.0.0.1:6007 --includeTags file-lifecycle-regression required-regression attribute-regression --maxWorkers=1 --no-cache`

- `scoped-stories.log`: 25 stories pass (seven file lifecycle, eight required, ten attribute), zero axe violations.
- `root-typecheck.log`: root `npx tsc --noEmit` passes.
- `site-typecheck.log`: site typecheck passes.
- `scoped-lint.log`: changed component/story lint passes.
- Changed source/spec formatted with Prettier.

RHF 7.75's arbitrary `setValue(File)` identity-notification limitation remains documented in the spec; native selection/reset/resetField/ARForm defaults are verified. No Git mutations. Source frozen for coordinator-owned independent review and full QA.

## Final gates

Independent review found no code defects. The tracker duplication was corrected to a link. QA passed all 67 tests across 11 suites, root/site typechecks, lint/format, builds, package stylesheet checks, and recipe browser/isolated-consumer checks. A fresh independent follow-up confirmed disputed coverage from existing stories, independently reproduced eight server renders without File/FileList globals, and found no remaining spec gaps. Reports: `gates/round1-review-result.log`, `gates/round1-qa-result.log`, and `gates/followup-result.log`.
