# SPEC: preserve consumer registration rules

## Status

Focused correction authorized by the final readiness review. The coordinator owns Git actions after gates. No merge, publish, or deployment.

## Problem

FileUpload replaces validators already registered through supplied form methods. Select and TextArea overwrite consumer required rules even when their required prop is omitted. Shared inputs and TagInput need the same distinction between an omitted prop and an explicit false.

## Behavior

- Omitted required props do not write a required registration option or erase an existing consumer rule across Text, Date, Checkbox, FileUpload, Select, TextArea, and both TagInput modes.
- Explicit true/false required props continue to set/update library required behavior. Explicit false clears a prior library requirement.
- FileUpload does not replace consumer validate functions, async functions, or validator maps. With the component required prop explicitly true, logical File/FileList/nonempty string values remain accepted when the native file input is empty after reset and rendering. Omitted required preserves external rules unchanged, including RHF native-file required semantics, which may reject logical defaults against the empty browser picker. Do not reinterpret consumer rules. Missing required files retain type `required`, existing fallback feedback, and aria-required.
- Use public registration APIs. For explicit file required props, enable RHF's required rule only while the rendered logical file value is empty. Calculate the rule once for rendering and native capture. Do not register fields from value subscriptions or intercept programmatic registration lifecycle. Retain required presentation regardless. Do not compose validators by reading private RHF state.
- Native selection, disabled behavior, schema precedence, and previews remain intact. Invoke consumer capture handlers exactly once before deriving required from the final native FileList, then let RHF's bubble handler validate.
- Programmatic FileUpload updates (defaults, setValue, resetField, and whole-form reset) must render before schema-free validation/submission. Preserve logical values, previews, empty FileList rejection after rendering, disabled consumer validators, unregister/conditional removal, and dot/bracket path aliases. Aggregate watching in the parent-path test fixtures makes their render boundary explicit. No registration subscription, native-ref restoration, private RHF access, or public API expansion.
- External-validation fixtures have one owning native form per methods instance. Native submit and keyboard submit use the same handleSubmit as the controls' registration.

## Public regressions

Use public Storybook/form boundaries, including supplied methods' submit/invalid callbacks. Record red/green evidence.

| Story                          | Contract                                                                                                                                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ConsumerFileValidators         | Optional, explicit-false, and required files preserve consumer async/map validators after native upload and logical File/string resets; rejected values block submission and corrected values succeed. |
| OmittedRequiredRules           | Every control preserves an externally registered required rule when the prop is omitted; empty submission retains consumer messages and invalid associations.                                          |
| RemovedNestedFileSubmission    | Conditional removal, unregister of a nested file, parent-path update, and submission do not resurrect the removed field.                                                                               |
| ConsumerCaptureFileChange      | Consumer capture clears the native selection; required feedback follows the final empty FileList and callback runs once.                                                                               |
| RemovedFileSubmission          | Conditional removal, unregister, sibling update, and same-handler submission do not resurrect the removed required file.                                                                               |
| DisabledConsumerResetLifecycle | A rejecting consumer validator remains skipped for a disabled file before and after keepDirtyValues reset, rendering, and submission.                                                                  |
| UnrelatedFileNotification      | An unrelated value update causes zero registrations of the explicit-required file.                                                                                                                     |
| AliasedFilePathSubmission      | Dot-notation parent updates of a bracket-notation array file reject clearing and accept restoration after rendering and before a separate submit.                                                      |
| WholeResetFileListSubmission   | Whole-form reset renders before a separate submission: empty FileList rejects with required type/fallback; populated FileList submits and recovers.                                                    |
| ParentPathFileSubmission       | Parent-path setValue clear/restore of a nested file updates required semantics after rendering and before a separate submit.                                                                           |
| DisabledFileResetSubmission    | Local and global disabled required files reset, render, then submit without required errors.                                                                                                           |
| OnChangeFileRequired           | Native upload, empty FileList selection, and recovery update onChange errors immediately; consumer capture runs once per change.                                                                       |
| ProgrammaticFileUpdates        | Programmatic resetField clear, File restoration, empty/populated FileList, and consumer-validated strings render before submission. Whole-form reset clear/restore renders before separate submission. |
| ExplicitRequiredChanges        | Required true rejects missing values; false clears library requirements; true restores them, including required File after default/reset changes. Missing file errors keep required type and feedback. |

Run focused stories, root/site typechecks, changed-file lint/format. Coordinator runs the full independent gates. No schema redesign, private RHF patches, new public props, or unrelated lifecycle changes.

For schema-free file validation, do not combine a programmatic value update with immediate validation/submission or shouldValidate: true. Render first, then validate/submit. A schema resolver can validate logical file values independently of the native picker. Whole-form reset retains RHF's existing consumer-registration lifecycle; consumer validators must be registered again after a reset clears registrations.

## Scope correction

Review exposed side effects from self-added synchronous programmatic-update guarantees: registering from watch notifications resurrected removed fields, altered disabled tracking, and added unrelated work. The original lifecycle requirements concern file values/previews and subsequent validation, not validation before React renders programmatic updates. Remove the registration subscription and native-ref restoration entirely. Keep immediate native-change validation, and retain all programmatic value/default/reset/path cases through real update, preview render, and separate submission interactions.

## Consumer guidance

README and FileUpload docs distinguish explicit component required from omitted consumer rules. Recommend defaults/reset/resetField for logical replacement, and show aggregate methods.watch() in the owning form component for parent-path or equivalent dot/bracket setValue updates. Waiting alone does not create a render. Retain the RHF 7.75 File-identity setValue notification limit and the render-before-validation boundary. No runtime or Storybook changes are needed for this clarification.
