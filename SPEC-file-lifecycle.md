# SPEC: file value and preview lifecycle

## Status

Authorized as the next sequential readiness batch. Leave Git actions to the coordinator after independent gates. No merge, publish, or deployment.

## Problem

FileUpload keeps a picked file separately from the form value, so resetting the form or replacing defaults can leave stale preview content. Media object URLs are never released, and asynchronous image preload callbacks can restore outdated previews. Required file defaults suppress the required announcement and do not validate logical File/string values consistently.

## Behavior

- Derive binary/media previews from the current registered field value. Recognize browser File, the first entry of a FileList, and nonempty consumer strings. Empty values clear the preview; earlier selections or defaults must not return.
- Native selection, public React Hook Form reset/resetField, and ARForm default-value changes keep previews and submitted values consistent. Preserve registration names, native file selection, and consumer change/blur/capture callbacks.
- Create media object URLs only for files owned by the component's current preview. Release each on replacement, clear, switching to binary, and unmount. Never revoke consumer-provided string URLs. Remove or cancel stale image preload work so it cannot restore old previews.
- Keep required presentation and aria-required regardless of defaults. Schema-free required file validation accepts a logical File, nonempty FileList, or nonempty string even when the native input is empty. Empty FileLists/strings and nullish values reject submission with existing fallback feedback. Schemas retain validation precedence.
- Disabled controls continue to skip schema-free validation, including form-wide disabled state. Keep the library headless; do not add styling or public props.
- Guard File/FileList globals during rendering so server rendering can import/render safely. Avoid assigning consumer nonempty value/defaultValue strings to the native file input.

## Public tests

Use the approved Storybook/form interaction seam and existing axe runner. Record red before each production fix. System browser URL APIs may be observed at their external resource boundary; do not test helper internals.

| Story                     | Contract                                                                                                                                                             |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FileResetAndDefaults      | Native upload replaces the binary preview and submitted value. Public reset/resetField restores a logical default; clearing removes the prior preview and selection. |
| ChangedFormDefaults       | Replacing ARForm defaults after selection shows the new File/string default, then an explicit empty value clears the preview.                                        |
| RequiredLogicalFileValues | Required File, FileList, and string values submit with aria-required preserved; empty values reject, and correction clears feedback.                                 |
| MediaUrlLifecycle         | Real media selection creates a working preview URL. Replacement, clear, binary switch, and unmount revoke owned URLs; consumer strings remain usable.                |
| FileCallbacksAndDisabled  | Consumer change, blur, and capture callbacks compose once; disabled local/form-wide controls skip required validation and preserve interaction state.                |

Check initial, invalid, and recovered accessibility states with companion terminal stories as needed. Scoped interaction/typechecks during implementation; full root/site checks, lint/format, production builds, package assertions, all Storybook tests, recipes, and independent review/QA are coordinator gates.

## Limits

Installed RHF 7.75 suppresses File identity notifications for arbitrary setValue(File) replacements. This batch guarantees native selection, reset/resetField, and ARForm default updates established by the tests; do not promise arbitrary File identity updates without evidence, or add polling/private RHF patches. Native HTML form reset policy, nested paths, general callback replacement, typed-method API changes, and broad README claims remain separate work.
