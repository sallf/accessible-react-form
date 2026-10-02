# SPEC: consistent required validation and error feedback

## Status

Implementation authorized by the user's request to complete the remaining readiness work. Work branch: `260930-zero-css-components`; integration through PR #66 into main. Commit/push authorization remains governed by the conversation. No merge, publication, or deployment.

## Problem

Without a schema, shared inputs register required rules but Select and TextArea do not. Errors without a message can block submission while leaving the field marked valid and showing no field feedback. Consumers cannot rely on the same required prop across controls.

## Behavior

- Without a schema, required Text, Date, Checkbox, FileUpload, Select, TextArea, and both TagInput modes reject empty values (or unchecked required checkboxes), expose invalid state, and show associated feedback. Optional fields remain optional. Use React Hook Form's required semantics; do not add whitespace trimming to text values or new constraints.
- Disabled fields do not acquire schema-free required errors or block submission. Keep disabled TagInput buttons inactive.
- With a schema, the schema remains the source of validation rules. Required props provide the visual/accessibility indication and must not override schema optionality.
- A field with an error is invalid even when the error has no message. Show `This field is required` for a required error without a usable message and `Please check this field` for other message-less errors. Preserve nonblank consumer/schema messages and existing error presentation. Do not add new required props or a public error-message API.
- Error descriptions coexist with consumer help text; successful validation removes error feedback and only the library-added description reference. Preserve checkbox wrapper error placement and TagInput group/textbox associations.
- Keep the package headless and retain current event-handler composition, form context, schema behavior, and supplied form methods.
- Update required-prop documentation to explain schema-free behavior and schema precedence. General README accessibility claims are a separate subsequent step.

## Tests

Use the already approved public Storybook/form interaction boundary and axe runner. Work in vertical red/green slices; record failing evidence before each fix. Existing Unstyled stories are the prior art.

| Named story                  | Contract                                                                                                                                                                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SchemaFreeRequiredFields     | Every required control rejects an empty submission with invalid state and described feedback; entering/selecting values permits one successful submission under the original field names. Include both TagInput modes and a real file upload.                            |
| OptionalAndDisabledFields    | Optional and disabled required controls do not block schema-free submission; disabled interaction remains disabled.                                                                                                                                                      |
| MessageLessFieldErrors       | Explicit public form methods set a required error and a non-required error without messages. Every control shows the appropriate fallback, remains invalid, and retains help references. Clearing errors restores valid state/help. Preserve supplied nonblank messages. |
| SchemaOwnsRequiredValidation | A schema that accepts empty optional values succeeds despite required presentation props; a schema rejection still produces its original message and invalid state.                                                                                                      |

`FormWideDisabledLateMount` also verifies delayed-mounted controls inside `useForm({ disabled: true })`, including TagInput in both modes, remain disabled when field-level disabled is absent or false and recover correctly when the form is enabled.

Initial, invalid, and recovered accessibility states should be checked by the existing runner using companion terminal-state stories where needed. No helper-only tests.

## Verification and scope

Run focused regressions and typechecks while implementing. Then independent review and QA against the final contents, with root/site checks, lint/format, production builds, full Storybook suite, package stylesheet assertion, and browser/isolated-consumer recipe checks. Existing watch lint and bundle-size warnings are known nonblocking warnings; no known-red tests.

No new styling, live whole-form error clearing, file lifecycle changes, nested-path redesign, handler-composition refactor, or unrelated TagInput suggestion changes in this batch. Continue the next readiness batch only after this batch's gates finish.
