# SPEC: nested errors and typed form integration

## Status

Authorized as the next sequential readiness batch on `260930-zero-css-components`. The coordinator owns Git actions after independent review and QA. No merge, publication, or deployment.

## Problem

The resolver stores dotted error names as flat keys while React Hook Form updates nested errors. Editing an invalid nested field can retain its old message and count the same error twice. External typed form methods fail the public field prop types. ARForm retains its initial change callback after consumers replace or remove it.

## Behavior

- Build nested schema errors compatible with React Hook Form. All fields read nested errors and preserve their current invalid state, fallback messages, help references, and handler composition.
- Count actual errors across nested objects and arrays. Field names such as `type` and `message` remain ordinary names. Do not traverse error refs or other metadata.
- External parent errors do not hide child errors retained by RHF, including a child named `types` and descendants beneath that name. Count retained error leaves within metadata containers, even when RHF preserves criteria values beside them, while excluding the criteria values themselves. Field lookup accepts actual error leaves, not containers or criterion arrays; metadata names remain ordinary schema fields when their parent is only a container.
- A retained child named `message` may replace the parent's message string with an object. Keep the parent's existing fallback feedback and the child's local feedback without crashing; do not reconstruct the overwritten parent message.
- Preserve every blocking schema issue. Unsafe prototype paths and paths that cannot represent a native registered field become form-wide feedback. When a parent and descendant both have issues, show the parent message at form level and the descendant message at its field, regardless of issue order.
- Treat pipe characters stripped by RHF and array `length` properties as unrepresentable field paths. Preserve their messages at form level. Array-path detection works in either issue order and with numeric or string indices; ordinary object properties named `length` retain field feedback.
- Preserve schema issues at exact `root` or beneath top-level `root` as collision-safe form-wide feedback, because RHF removes that reserved error bucket before deciding submission validity. Nested ordinary field names such as `ordinary.root` retain field feedback.
- Accept conventional typed external useForm methods, including typed context and transformed output, through one documented type boundary. Keep native prop checks, existing reusable field wrappers, and explicit-method precedence over inherited context.
- After consumers replace onChangeCallback, the next field change calls the replacement once. Removing the callback stops notifications to the old callback.
- Retain whole-form messages, schema precedence, schema transformations, required/disabled behavior, and existing no-CSS accessibility contracts.

## Public tests

The approved seams are Storybook interactions through exported form components and public RHF methods, plus an isolated TypeScript consumer of built public declarations. Record red before each production fix.

| Named test                             | Contract                                                                                                                                                                                                   |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NestedSchemaErrorsRecover              | Empty, differently invalid, and valid nested values update the field message and description; the summary counts one error and recovery permits submission.                                                |
| ArrayAndMetadataErrors                 | Array item errors and nested fields named type/message receive associated feedback and accurate summary counts. Both bracket and dotted item IDs work.                                                     |
| ParentAndChildSchemaErrors             | Parent and descendant issues both remain visible and blocking in either issue order.                                                                                                                       |
| UnsafeSchemaPathsRemainBlocking        | Prototype paths and unrepresentable paths produce form-wide feedback, leave prototypes unchanged, and never permit submission.                                                                             |
| PipePathsRemainBlocking                | Pipe-only, disguised prototype, and ordinary pipe-containing paths produce visible form-wide errors and never permit invalid submission.                                                                   |
| ArrayLengthPathsRemainBlocking         | Array item and length issues remain visible without exceptions in either order; a length-only array issue stays visible; ordinary record length errors remain beside their field.                          |
| ReservedRootSchemaErrorsRemainBlocking | Exact root and root.name schema errors remain visible and block submission, even with a colliding form-error key; ordinary.root retains field feedback.                                                    |
| ExternalNestedErrors                   | Supplied RHF methods and an external FormProvider display nested errors for every control; clearing errors restores help references and valid state.                                                       |
| ExternalParentAndChildErrorCount       | Public setError counts a parent and its retained name/types children in either order. Criteria maps and arrays add no errors or native invalid state; clearing restores help descriptions.                 |
| ErrorContainersAreNotFieldErrors       | A native parent with only a message-child error stays valid; adding its own error uses fallback feedback without crashing when RHF replaces its message with the child object. Both retained errors count. |
| MetadataDescendantErrors               | Public setError retains a parent and types.name descendant in either order. Mixed criteria type/message/ref-array values add no errors or native invalid state; clearing restores help descriptions.       |
| UpdatedChangeCallback                  | Replacing a callback updates its captured state, calls it once on the next field change, and removing it stops calls.                                                                                      |
| TypedExternalMethods                   | Built public declarations accept typed values/context/output for every field without consumer casts; native attributes and reusable ComponentProps wrappers retain their checks.                           |

Scoped interaction and consumer typechecks during implementation. Full root/site checks, lint/format, builds, package assertions, Storybook/recipes, independent review, and full QA remain coordinator gates. No known-red baseline tests.

## Limits

No general SSR expansion, live whole-form error clearing, generic ARForm/schema inference redesign, stylesheet changes, file lifecycle redesign, or unrelated refactoring. No private RHF APIs. Do not reconstruct errors that RHF itself overwrites when field names collide with its error properties.
