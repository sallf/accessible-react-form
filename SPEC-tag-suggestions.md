# SPEC: consistent TagInput suggestions

## Status

Implementation authorized as the next sequential readiness batch after `79db231`. Leave Git actions to the coordinator after independent review and QA. No merge, publish, or deployment.

## Problem

Selecting `" React "` stores `"React"`, but suggestion filtering uses the untrimmed string, leaving an Add button that does nothing. Empty, single-comma, and repeated suggestion entries can also produce unusable or redundant buttons.

## Behavior

- Trim suggestion boundaries before rendering and adding. Ignore empty/whitespace-only entries and a single comma, which existing tag entry already rejects.
- Deduplicate suggestions with the existing tag duplicate rule: ignore whitespace differences, preserve case sensitivity, and keep the first normalized candidate and its order.
- Filter selected suggestions with that same rule, so any suggestion equivalent to a selected tag disappears. Removing the selected tag restores exactly one normalized Add button.
- Apply the behavior to textbox and suggestions-only modes. Preserve tag interactions, required/disabled states, handlers, form registration, and the headless presentation.
- Keep the public API and comma-separated storage unchanged. Atomic tag values containing commas remain unsupported; document that limit without changing encoding or adding validation policy.
- Do not refactor the separate mode prop-exclusion lists.

## Public regression stories

Use the approved Storybook/form interaction boundary and existing axe runner. Record red before each production fix; no helper tests.

| Story                        | Contract                                                                                                                                                                                                               |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PaddedSuggestions            | Both modes select a padded suggestion into one trimmed tag, remove its Add button, restore one after removal, and submit the existing field keys/string values.                                                        |
| EmptyAndDuplicateSuggestions | Both modes omit empty, whitespace-only, and single-comma entries; deduplicate equivalent candidates while preserving first-candidate order and case sensitivity. Selected equivalents disappear; removal restores one. |
| TypedWhitespaceEquivalent    | A textbox-entered tag with internal whitespace suppresses equivalent suggestions under the existing duplicate rule; removal restores them. Suggestions-only initial values use the same comparison.                    |

The runner checks every fixture with axe. Run focused interaction/typechecks and changed-file lint/format during implementation. The coordinator owns full builds/tests/recipe/package checks and independent review/QA before commit/push.
