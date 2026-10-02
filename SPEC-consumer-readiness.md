# SPEC: consumer docs and dependency readiness

## Status

Implementation authorized after `a8187bb`. The coordinator owns independent review, final QA, and approved commit/push. No merge, version bump, package publication, or docs deployment.

## Problem

Consumer docs promise blanket WCAG compliance, automatic focus handling, zero re-render cost, and automatic schema typing/required hints. They omit current nested-field, typed-method, file-value, and tag-storage contracts. Compatible security fixes are available in the prepared root/site locks.

## Behavior

- Replace unsupported marketing/accessibility claims with concrete labels, required/invalid states, and linked error feedback. Keep application accessibility checks the consumer's responsibility. Remove the stale Hero version while retaining ALPHA.
- Document schema-free required validation, schema ownership of validation/transformed output, and the distinction between forwarded native attributes and registered validation. Keep required props aligned with schema rules.
- Describe nested field names and form-wide feedback; typed external methods through FormProvider/formProps, explicit-method precedence, and ARForm's FieldValues/type-inference limits.
- Describe FileUpload's FileList selections, logical defaults, ignored native value/defaultValue, and reset/resetField lifecycle. Describe comma-separated TagInput strings and unsupported commas within an atomic tag.
- Preserve canonical copied examples, layout, navigation, and public APIs. Do not add SSR promises or features.
- Apply the exact prepared compatible root/site locks with unchanged manifests. Preserve root React Hook Form 7.75.0. No forced major downgrades or overrides.
- Add maintainer guidance to coordinate versions/lock metadata and publish the matching package before deploying docs. Publication, deployment, and merge remain separate authorized actions.
- A recipe-test filter that matches no checks must fail with the available check names; valid filters and the unfiltered full run must still work.

## Verification

Clean root/site npm installs; root and site typechecks; library/Storybook/site production builds as needed; package stylesheet check; focused docs lint/format and browser route/copy checks. Production audits must report zero; record the five remaining moderate uuid-related development-tool findings. The coordinator owns the full Storybook/recipe suite and independent final gates.
