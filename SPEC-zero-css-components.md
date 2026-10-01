# SPEC: zero-CSS components

## Problem

The README says the library ships unstyled, but four components only work because of a stylesheet users never get. Without it, the hidden submit button shows, TagInput's comma-separated value input shows and steals the label (the visible input has no accessible name), FileUpload shows both the native file control and a fake "Choose File" button, and checkboxes render after their label text. TagInput and Tag also ship Tailwind classes from another project, and FileUpload's icon has inline colors. Storybook loads `styles.scss`, so the axe checks never see what users actually get.

## Solution

Every component works and is accessible with no CSS at all. Library-generated class tokens start with `arform`; consumer-supplied classes, including Tailwind utilities and CSS Modules classes, are preserved unchanged. The library adds no Tailwind classes or inline visual styles. Consumer-supplied `style` remains supported. Internal inline styles are used only to hide elements that are never meant to be seen. The unstyled Storybook stories and their axe checks run without any library stylesheet. A separate consumer-themed example demonstrates optional application CSS scoped to that example.

## Acceptance criteria

1. WHEN a valid form with two or more ordinary single-line text inputs is rendered and the user presses Enter in one of those inputs THE SYSTEM SHALL submit exactly once. The default submit button has `tabIndex={-1}` and is hidden by an inline visually-hidden style, not a class. Adding a consumer-provided visible submit button SHALL NOT add a hidden Tab stop or cause duplicate submission. This requirement excludes TagInput's tag-entry textbox and multiline textareas. Test: new story `SubmitOnEnter` (play function), covering forms with and without a visible submit button and checking keyboard focus order.
2. WHEN a Checkbox is rendered THE SYSTEM SHALL place the checkbox input before the label text in DOM order. Test: new story `CheckboxOrder`.
3. WHEN a TagInput is rendered THE SYSTEM SHALL explicitly associate the field label with the visible textbox and store the submitted value in an `<input type="hidden">`. The textbox's accessible name SHALL remain the field label before and after tags are added or removed. Tag buttons SHALL sit outside the textbox's `<label>`. WHEN the user types a tag and presses Enter THE SYSTEM SHALL add the tag without submitting the form. Each removal button SHALL identify the tag it removes; removing it SHALL update the submitted value. Test: new story `TagInputBasic`, asserting accessible names, add/remove behavior, and submission data.
4. WHEN a FileUpload is rendered THE SYSTEM SHALL show the native file input, reachable by its label, with no duplicate fake button. The icon SHALL be `aria-hidden`, use `currentColor`, and set its size through `width`/`height` attributes (which any CSS rule overrides). Test: update the existing `FileUploadPreview` story.
5. WHEN every exported component is rendered without consumer-supplied classes THE SYSTEM SHALL emit only library-generated class tokens that start with `arform`. Test: new story `ClassHooksOnly`, which asserts tokens on library markup within a fixture, excluding Storybook and fixture wrappers. Exercise conditional markup such as errors, populated tags, suggestions, prefixes, and file previews. A companion `ConsumerStyling` story SHALL assert that arbitrary consumer class tokens and `style` are preserved on their documented targets alongside library hooks; no CSS framework is required for this forwarding test.
6. WHEN the Storybook test runner runs THE SYSTEM SHALL run the unstyled stories' play functions and axe checks with no library stylesheet loaded (only the story-frame `testing.scss`, which must not style library controls). A separate `StyledExample` story may render consumer CSS scoped to its own wrapper; that CSS SHALL NOT affect the unstyled stories or ship in the library. Test: the existing axe `postVisit` hook, run over all existing and new stories. TagInput play functions SHALL also assert accessible names after intermediate add/remove transitions, rather than relying only on the final axe scan.
7. WHEN TagInput has `onlySuggestions` enabled THE SYSTEM SHALL render no textbox and expose its tag controls as a group named by the field label. WHEN TagInput is disabled, in either mode, THE SYSTEM SHALL prevent typing, adding, and removing tags through pointer or keyboard interaction. Test: new story `TagInputStates`, covering both modes and disabled controls.
8. WHEN schema validation rejects a TagInput value THE SYSTEM SHALL expose the required/invalid state and error description on the visible textbox, or the named group in suggestions-only mode as appropriate. Hidden storage SHALL NOT be the only element carrying accessibility state. Adding or removing tags SHALL refresh an existing validation error. Test: new story `TagInputValidation`, covering failure and correction in both modes.
9. WHEN the package is built THE SYSTEM SHALL ship no CSS or SCSS files and require no stylesheet import. Test: an automated assertion over `npm pack --dry-run --json` file paths, plus review of the build entry and stylesheet imports. The assertion SHALL exit nonzero if a stylesheet would be packaged.

10. WHEN fields are rendered without consumer CSS THE SYSTEM SHALL place each field on its own line using block markup, with no inline layout styles. Checkboxes SHALL remain beside their label text, and prefixes SHALL remain with their input inside the same field. Use a stable `arform__field` hook on each field container while preserving existing label/control styling targets. Test: new `NoCssLayout` story with browser layout and label-association assertions. A separate `StyledExample` story SHALL show how consumer-owned CSS adds spacing and appearance through the hooks.

## Scope / non-goals

- No optional stylesheet. It can be added later without breaking anything.
- No general fixes for the other audit findings: resolver handling of whole-form errors, `rest`-spread handler override, default-value/reset behavior, file-preview cleanup, `required` without a schema, consumer `aria-describedby` merging, or hardcoded English text. Those go in a separate spec. TagInput labeling, disabled behavior, and its own error association are in scope because its markup is changing here.
- No new public props (for example submit label, `hideSubmit`, or `classNames`). Internal component props may change to support the markup corrections. Normalize TagInput's existing `className` and `style` targets and document the change.
- Follow-up: replace `ChildrenLoop` injection with form context so reusable styled field components work. This limitation remains after this spec.
- Follow-up: consider a consistent public API for styling internal parts. Stable hooks are the customization mechanism for this change.

## Design

- **Approach:** replace CSS-dependent behavior with markup. Only elements that must stay invisible get an inline visually-hidden style: the default submit button and Tag's screen-reader text. One shared constant for that style lives next to the components.
- **Field layout:** wrap each basic field's label and control in a `<div className="arform__field">`. TagInput already has a block container; add the same hook there without another wrapper. Preserve `labelClassName` on the label and `className`/`style` on their documented targets. No library CSS or inline layout styles are needed for this readable baseline.
- **Consumer example:** add a separate `StyledExample` story with scoped consumer CSS for spacing, borders, and colors. Keep the raw stories CSS-free and exclude the example from published assets.
- **Submit:** keep the always-present visually hidden `<input type="submit">` for implicit Enter submission. Add `tabIndex={-1}` so sequential keyboard navigation skips it. A visible submit button outside the form still needs a `form` association or an explicit submission handler; the hidden input does not wire that button automatically.
- **TagInput structure:** the value input becomes `type="hidden"`. Use a separate label with an explicit association to the visible textbox; do not rely on the first labelable descendant of a wrapping label. Use collision-safe DOM IDs independently of the registered field name. Tag and suggestion buttons sit outside the label. In `onlySuggestions` mode, associate the field label with a group containing the tag controls. Keep validation messages associated with the interactive surface, and propagate disabled state to every interactive control.
- **TagInput styling:** remove the hard-coded utilities and inline textbox width. Use `arform__tag-input` for the container, `arform__tag-input-control` for the visible textbox, `arform__tag-list`, `arform__tag`, `arform__tag-remove`, `arform__tag[data-arform-suggestion]`, and `arform__tag-suggestions`. Preserve the existing label and error hooks. Forward existing `className` and `style` to the visible textbox in ordinary mode and to the named group in `onlySuggestions` mode; document both targets. Expose disabled/invalid state on the container for styling as well as appropriate native/ARIA state on controls. `LimitMsg` is unused and gets deleted.
- **FileUpload:** remove the opacity-0 overlay and the fake "Choose File" and "Drag and drop" spans. The native input stays visible and still accepts dropped files. Keep `arform__upload-wrapper[data-arform-active]` and the preview. Users who want a large drop zone style the input with their own CSS.
- **Stylesheets and consumers:** delete `src/styles.scss` and remove its import from `.storybook/preview.ts`. Update the existing local playground's `playground/src/App.tsx` import too; it is ignored by Git, so report that local adjustment separately and do not force-add the playground. Search for other references before deletion. Update the README and docs styling page with the new hooks, removed upload markup, TagInput prop targets, and CSS-free behavior. Update the docs site's CSS for the new tag hooks, and fix its `.arform__field-error` to `.arform__error`.
- **Alternatives rejected:** an invisible overlay file input with inline styles (keyboard focus becomes invisible without CSS); inline styles for visual defaults (they beat user CSS).

## Verification

```sh
npx tsc --noEmit
npm run lint
npm run format:check
npm run build-lib
npm test # build Storybook + play functions + axe, including class/prop assertions
npm pack --dry-run --json
```

Add and run the automated package-file assertion from criterion 9; printing the pack output alone is not a passing check. DOM assertions enforce class hooks and consumer forwarding; do not rely on matching minified bundle strings with `grep`.

Run the site build as CI runs it (see the `build` job in `.github/workflows/ci.yml`). When the local playground exists, run its build after removing the stale stylesheet import. Search for remaining `styles.scss` imports to catch consumers that the root build does not cover.

## UI?

Yes. At the merge gate, check:

- Storybook with no library CSS: every component looks like a plain browser form and nothing is duplicated or out of place.
- The consumer-themed Storybook example: styling is scoped to that example and does not affect the raw stories.
- The docs site: TagInput and FileUpload still look intentional with the site's own styles.
- Keyboard interaction: visible focus is available on all interactive controls, the hidden submit is skipped, and TagInput remains correctly named after adding/removing tags and in suggestions-only mode.
