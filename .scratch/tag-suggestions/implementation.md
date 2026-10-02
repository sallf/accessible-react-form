# Tag suggestion normalization evidence

Approved public seam: Storybook/form interactions using TagInput in both modes, observable buttons, and submitted string values. No helper tests or internal mocks. Source baseline: `79db231`.

Slice command:

`npx test-storybook --url http://127.0.0.1:6007 --includeTags tag-suggestions-regression --maxWorkers=1 --no-cache`

1. **PaddedSuggestions**
   - Red: selecting the padded React suggestion left its Add button in the document. Output: `padded-red.log`.
   - Change: trim candidates before rendering/filtering/adding.
   - Green: both modes add one trimmed tag, remove the matching Add button, restore one after removal, and submit existing keys and string values. Output: `padded-green.log`.
2. **EmptyAndDuplicateSuggestions**
   - Red: expected three useful Add buttons, received ten including blank/single-comma/equivalent duplicate candidates. First story stayed green. Output: `duplicates-red.log`.
   - Change: omit empty/whitespace-only/single-comma candidates and deduplicate with the existing whitespace-insensitive, case-sensitive rule, preserving the first normalized candidate and order.
   - Green: both modes show only Vue, React, and react in order; selected values disappear and removal restores one; differently cased tags remain distinct and submit unchanged. Output: `duplicates-green.log`.
3. **TypedWhitespaceEquivalent**
   - Red: an existing `R e a c t` tag left two Add buttons instead of only Vue. Prior two stories passed. Output: `whitespace-equivalent-red.log`.
   - Change: selected filtering uses existing `isDuplicate`, matching entry and suggestion deduplication.
   - Green: both modes recognize whitespace-equivalent initial values; typing a padded internal-whitespace tag hides its suggestion; removal restores it. Submitted values preserve existing serialization. Output: `whitespace-equivalent-green.log`.

README documents suggestion normalization and the existing comma-separated-storage limit: comma-containing values cannot represent a single tag. No encoding/API changes, prop-filter refactoring, styling, or validation-policy changes.

Final scoped command adds existing TagInput prop regressions:

`npx test-storybook --url http://127.0.0.1:6007 --includeTags tag-suggestions-regression tag-props-regression --maxWorkers=1 --no-cache`

- `scoped-stories.log`: five scoped stories pass with zero axe violations.
- Root/site typecheck logs: pass.
- `scoped-lint.log`: changed component/story lint passes.
- Changed source, README, spec, and linked tracker formatted with Prettier.

Source frozen for coordinator-owned independent gates. No Git or server mutations; existing port 6007 reused.

## Final gates

Independent review found no actionable findings. QA passed all 84 Storybook interaction/accessibility tests across 13 suites, root/site/consumer typechecks, lint/format, builds, package stylesheet checks, and recipe browser/isolated-consumer checks. Reports: `gates/round1-review-result.log` and `gates/round1-qa-result.log`.
