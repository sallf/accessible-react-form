# SPEC: accessibility attribute forwarding

## Status

Approved for implementation in conversation on October 1, 2026. Leave changes uncommitted until explicitly authorized. Integration uses a PR; merging, publishing, and deployment require explicit approval.

## Problem Statement

Text, Date, Checkbox, FileUpload, Select, and TextArea consume the supplied `id` as the form registration name but omit it from the native control. Consumers cannot reliably target those controls through DOM IDs.

The same controls overwrite consumer `aria-describedby` references, even without an error. TagInput preserves help references initially but replaces them with the error reference when its textbox becomes invalid. Users then lose the instructions that explain how to correct their input.

## Solution

Forward the existing native-control IDs and preserve consumer descriptions throughout validation. When a field displays an error, append its error reference to the consumer references. When that error clears, retain the consumer references.

## User Stories

1. As a developer, I want the supplied ID on the native control, so DOM lookups and explicit label references resolve correctly.
2. As a developer, I want registration to keep using the existing ID, so submitted field names remain compatible.
3. As a form user, I want help text available before validation, so I can understand the expected input.
4. As a form user, I want help text and error text available together, so an error does not hide instructions.
5. As a form user, I want corrected fields to retain their help text, so successful validation does not remove useful guidance.
6. As a developer, I want multiple description references preserved in order without duplicates, so composed fields have predictable descriptions.
7. As a developer, I want controls without help text to retain their existing error association, so this fix does not require new props.
8. As a developer, I want reusable wrappers and explicitly supplied form methods to behave consistently, so composition does not affect accessibility attributes.
9. As a form user, I want checkbox errors associated with the checkbox even though their messages render outside the label.
10. As a form user, I want TagInput instructions preserved in both textbox and suggestions-only modes, so validation does not remove them.

## Implementation Decisions

- Forward the supplied `id` unchanged to the native input, select, and textarea. Cover Text, Date, Checkbox, and FileUpload through their shared input. Preserve registration names and refs, handler composition, and implicit label associations.
- Keep the current API: `id` remains the registration key. Do not add a separate field-name prop or generate replacement IDs. Consumers remain responsible for document-unique IDs, including across sibling forms.
- Merge `aria-describedby` as whitespace-separated ID references: consumer references first, then the library error reference when its message is rendered. Remove duplicate tokens while preserving first-occurrence order. Omit the attribute when there are no references.
- Preserve consumer tokens even when their targets are outside the field wrapper. Do not query the DOM to filter references. If a consumer explicitly supplies the library error ID, treat it as a consumer-owned token and retain it after recovery; only the library-added reference is conditional.
- Preserve the checkbox's error reference when its wrapper renders the error. The shared input's internal `showError` flag alone must not determine whether that reference is included.
- Apply the description merge to TagInput's visible textbox and suggestions-only group. Preserve the group's required-description reference in its current position between consumer help and error references. Keep TagInput's existing generated control/label IDs and hidden registration input unchanged.
- Preserve other forwarded attributes, including `aria-label`, `aria-labelledby`, and `data-*`. Do not change the current `aria-invalid` or required-validation policy in this fix.
- Keep the package headless. No theme dependencies, new styling props, or presentation redesign. A small internal description helper is acceptable; no new public helper is needed.

## Testing Decisions

Use the existing Storybook interaction and axe runner at public component/form boundaries. Follow the existing form-context, event-handler, and TagInput prop stories. Add regressions under Unstyled and record their failure before implementing the fix. Assert rendered controls, referenced messages, and submitted values rather than helper internals.

| Named evidence             | Required behavior                                                                                                                                                                                                                                                                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NativeControlIds`         | Text, Date, Checkbox, FileUpload, Select, and TextArea expose the supplied IDs on their native controls and remain discoverable by label. DOM lookup resolves the intended control, and successful submission retains the existing field keys and values. Include a reusable field wrapper and explicit form methods across the fixtures.          |
| `FieldHelpAndErrors`       | Each native control preserves multiple help references before validation, adds a reference to its rendered schema error after invalid submission, and removes only the library-added reference after correction and successful resubmission. Verify description text as well as tokens. Checkbox references resolve to its wrapper-rendered error. |
| `DescriptionTokenHandling` | Cover absent, empty, whitespace-only, repeated, and multiple consumer references. Verify stable order, deduplication, error-only descriptions, and omission when no references remain. Explicit consumer references survive recovery.                                                                                                              |
| `TagInputHelpAndErrors`    | Both textbox and suggestions-only modes retain help through failure and recovery. Required group guidance remains referenced. Existing label associations, tag interactions, and registration are preserved.                                                                                                                                       |

`ConsumerAccessibleNames` additionally verifies the existing requirement to preserve consumer naming attributes: consumer `aria-labelledby` takes precedence, `aria-label` works without an overriding generated reference, and the generated label remains the fallback. Cover TagInput in both modes. `BlankConsumerAccessibleNames` verifies that empty or whitespace-only naming props do not suppress the suggestions group's generated label, while nonblank consumer names retain precedence.

Run axe against the initial and error states of the new fixtures. Use schema errors with messages to isolate description behavior from the separate schema-free required-validation audit. Fix values and resubmit to test recovery; live clearing while typing is not required.

Run focused stories and relevant typechecks during implementation. Before presenting the implementation as ready, run root/site typechecks, lint, formatting, library/site/Storybook builds, package stylesheet assertions, all Storybook interaction/accessibility tests, and recipe browser/isolated-consumer checks. Complete independent code review and QA against the final changes. These are planned checks, not results from drafting this spec.

## Out of Scope

- Schema-free required validation, message fallbacks, and errors without messages.
- File reset/default-value synchronization and object-URL cleanup.
- README compliance claims and live whole-form error clearing.
- General handler-composition refactoring, nested field-path redesign, or new ID APIs.
- Changes to canonical example styling or copied source unless required to demonstrate this contract.
- Dependency/CI repair, implementation of the other audit items, commits, or integration actions.

## Further Notes

Baseline inspection on October 1, 2026: branch `260930-zero-css-components` was clean at `7193738`, matching open PR #66. All three CI jobs failed at root dependency installation before their checks ran. The logs report missing/inconsistent lockfile entries for `@emnapi/*` and `ajv`. Node 20 also produces engine warnings for Chromatic and concurrently, which require Node 22 or later. The Netlify preview check passed. CI repair should be handled separately before treating the PR as ready to merge.

Approval of this draft confirms the public Storybook/form testing boundary requested in the handoff. It does not approve a commit or merge.
