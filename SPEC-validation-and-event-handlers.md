# SPEC: validation and event-handler composition

## Status

Approved for implementation through the build request in conversation. This is the next focused follow-up to the September 30 codebase audit, after the zero-CSS and copyable-recipe work. Commits, merging, and publishing require separate authorization.

## Problem Statement

A schema can reject an entire form without assigning its error to a particular field. The current resolver discards those errors, allowing the submit callback to run with empty data even though validation failed.

Consumers also lose form behavior when they supply ordinary event handlers. A supplied `onChange` or `onBlur` can replace the handler returned by React Hook Form. The visible control and the form's registered value can then disagree, and consumer callbacks can prevent normal validation and change notifications.

## Solution

Every schema failure blocks submission. Form-level messages appear in the form's accessible error summary, alongside existing field feedback. Correcting the values clears the errors and permits a normal submission.

Consumers can attach change and blur callbacks without taking over registration. Both the library and consumer receive the event, while the form retains its values, notifications, and validation behavior.

## User Stories

1. As a developer, I want object-level schema refinements to block submission when they fail, so invalid data never reaches my submit handler.
2. As a form user, I want a whole-form error explained in visible, accessible text, so I know how to correct it.
3. As a developer, I want all form-level messages preserved, so one failure does not hide another.
4. As a form user, I want field errors and form-level errors to coexist, so I can understand both kinds of failure.
5. As a form user, I want corrected data to clear old errors and submit successfully, so a failed attempt does not leave the form stuck.
6. As a developer, I want synchronous and asynchronous Standard Schema validation to behave consistently.
7. As a developer, I want `onChange` callbacks to observe changes without disabling registration or form change notifications.
8. As a developer, I want `onBlur` callbacks to observe focus changes without disabling touched-state tracking or validation.
9. As a developer, I want both callbacks to work together and run once per dispatched event, so adding application behavior does not duplicate side effects.
10. As a developer, I want the same guarantees for text, date, checkbox, select, textarea, and file controls, including fields inside reusable wrappers.
11. As a developer, I want file-selection callbacks to preserve the component's own selection feedback as well as the submitted file.
12. As a developer, I want the existing unstyled API and TagInput behavior preserved, so this correctness fix does not require styling or application changes.

## Implementation Decisions

- Keep the current public form and field props. No new required props, provider, validator dependency, or stylesheet.
- Update the Standard Schema resolver to retain issues with an absent or empty path as form-level errors. Never return an empty error collection when the validator reports one or more issues. Preserve all form-level messages in their reported order.
- Use an internal form-level error representation compatible with React Hook Form. Do not assign a pathless issue to an arbitrary input or overwrite an ordinary field's error. Keep existing handling of field paths and successful transformed values unchanged; a general nested-path rewrite is out of scope.
- Extend the form's existing error summary to display form-level messages using accessible alert semantics. Escape message content through normal React rendering. Keep existing field error descriptions and associations working. A form-level issue must not falsely mark an unrelated input invalid.
- Validation results replace prior errors through the normal form lifecycle. After a successful validation, stale form-level messages disappear and the submit callback receives the validated values exactly once for that submission.
- Compose registration handlers and consumer `onChange`/`onBlur` callbacks on the shared native input, select, and textarea controls. Invoke registration first, then the consumer with the original event, once each. Consumer `preventDefault()` does not opt out of registration. Do not introduce awaiting of consumer callback promises or a new callback-error policy.
- Preserve the registered name and ref, native event types, disabled behavior, and existing prop forwarding. Keep callback composition small and consistent; use a shared helper only if it reduces duplication without weakening types.
- Apply the shared-input fix to Text, Date, Checkbox, and FileUpload. Preserve FileUpload's internal selection handler when a consumer supplies its corresponding capture callback. This fixes event composition only, not the separate preview/reset lifecycle issues.
- Preserve TagInput's existing custom event and tag-commit behavior. Do not change whether its callback represents draft textbox text versus committed tags.
- Keep the current form-context behavior, including ordinary consumer wrappers and explicit `formProps` precedence.

## Testing Decisions

Use the existing Storybook interaction and axe runner as the primary test seam. Exercise public form components with real input, blur, and submit events; assert visible errors, accessible feedback, callbacks, and submitted values. Do not assert private resolver storage keys or helper call graphs.

Use the existing wrapped-field and form-isolation stories as prior art. A story using explicitly supplied React Hook Form methods may display public touched state or use blur validation to prove that the registration blur handler still runs. Keep tests independent by clearing callbacks and starting with fresh state.

Record a failing regression before each behavior fix. Do not expand the production API just to make a test easier.

| #   | Requirement                                                                                                                                                                                                                                                                                                           | Named evidence                                                    |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | A Zod object-level refinement with no field path blocks submission and displays its message. Cover both an absent path and an empty path with a small Standard Schema fixture if necessary.                                                                                                                           | `WholeFormValidation`                                             |
| 2   | Multiple form-level messages and a field-level error remain visible together; field descriptions still refer to their own messages, and axe passes.                                                                                                                                                                   | `MixedSchemaErrors`                                               |
| 3   | An asynchronous whole-form failure blocks submission. Correcting the input clears the summary messages and submits the successful validated values once.                                                                                                                                                              | `AsyncWholeFormValidationRecovery`                                |
| 4   | Consumer change and blur handlers compose with registration for text, date, checkbox, select, and textarea. Each callback receives the expected target/value once per dispatched event; change notifications and submitted data remain correct. Include a wrapped field and a callback that calls `preventDefault()`. | `ComposedFieldHandlers`                                           |
| 5   | Supplying a consumer blur handler preserves observable touched state or blur-triggered validation through explicitly supplied form methods.                                                                                                                                                                           | `ComposedBlurValidation`                                          |
| 6   | Native file selection still reaches form state and local selection feedback when consumer change, blur, and change-capture callbacks are supplied. Each consumer callback runs once for its corresponding event.                                                                                                      | `ComposedFileHandlers`                                            |
| 7   | Existing direct fields, wrappers, explicit methods, sibling isolation, TagInput actions, accessible labels, and copied recipes continue to work. The package remains stylesheet-free.                                                                                                                                 | Existing Storybook suite, `test:recipes`, and `check:package-css` |

For callback-count checks, dispatch a known single event or assert the count corresponding to actual user events; do not assume that typing a multi-character string fires only one change event. Submit after a change as well as after blur, so blur cannot conceal lost change registration.

## Out of Scope

- General ID forwarding or consumer `aria-describedby` merging.
- Schema-free required-validation policy and fallback messages.
- Default-value/reset semantics, stale file previews after reset, and object-URL cleanup.
- General nested field-path or array-error redesign.
- A new theming system, styling props, copyable recipes, or visual redesign.
- Internationalization, broad error-summary navigation/focus management, or changing TagInput value semantics.
- Refactoring the recipe test harness or unrelated audit findings.
- Release, deployment, commit, or merge.

## Further Notes

The audited defects remain visible in the current resolver and native-control prop spreading. This spec should be implemented as a focused follow-up rather than reopening the completed styling work.

During implementation, run the named regression stories and typechecks as each fix lands. Present the changed form-level error summary for visual approval before final review and QA. Then run root/site typechecks, lint, formatting, library and site builds, package assertions, the full Storybook suite, and recipe checks. Run independent review and QA against the final contents, recording actual results. Leave all changes uncommitted until explicitly approved.

The proposed testing seam is the existing Storybook public-form interaction layer. Approval of this spec confirms that seam and the scope above.

## Approved Storybook presentation update

During visual review, the user approved consistent Tailwind styling for primary Storybook examples, with raw behavior checks grouped under Unstyled. Reuse the docs' canonical example files and show their actual source in Code panels. Keep Tailwind's reset scoped to styled examples so unstyled verification retains native browser rendering. Keep the npm package unstyled. This supersedes the exclusion of presentation changes only for this Storybook organization and styling work.

Check desktop and narrow layouts, source visibility, raw-story style isolation, and styled-story accessibility before requesting visual approval again.
