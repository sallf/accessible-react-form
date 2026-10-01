# SPEC: copyable form recipes

## Status and prerequisite

Draft for approval. The user approved the direction demonstrated by the recipe prototype: an unstyled library with complete, styled examples users copy into their own applications. The copied example uses Tailwind utility classes directly in its JSX, following the Headless UI docs pattern.

This spec builds on `SPEC-zero-css-components.md`, including its field wrappers, styling hooks, and TagInput fixes. That work must pass its review/QA gates before this spec is treated as an independent build. Do not discard, silently merge, or assume approval to commit the existing work.

## Problem

The library handles form registration and validation, but its unstyled examples leave users to design every field and state. The existing themed Storybook example demonstrates styling without giving the docs reader a complete, maintained set of files to copy.

Reusable application components also fail today. `ChildrenLoop` recognizes built-in field elements by `displayName`, but cannot discover a field rendered inside a consumer component. A recipe that encourages users to extract a styled field can therefore leave them with missing controls.

## Outcome

A developer opens a contact-form recipe, tries a polished live form, copies the exact JSX with Tailwind classes behind the preview, and connects their own submit handler. They can extract reusable styled fields without losing form registration or accessibility behavior.

The npm library remains unstyled. Appearance belongs to the copied application files. The concise API remains available:

```tsx
<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <Text id="name" label="Your name" required />
  <ContactText id="email" label="Email address" type="email" required />
</ARForm>
```

`ContactText` is an ordinary consumer component wrapping `Text`. It does not receive or forward internal form methods and does not need a special `displayName`.

## Scope

- One production recipe: a contact form with name, email, topics, and message fields, a visible submit button, and Zod validation.
- One presentation: Preview / Code tabs, with per-file code selection and copy actions. Use variant A from the prototype as the starting layout, integrated into the existing docs shell.
- Tailwind utility classes for the first recipe, written directly in the canonical JSX files and shown in the copyable source. Do not use `.arform` selectors or add a separate recipe stylesheet. Assume the consuming React app already has Tailwind configured; document that prerequisite and list the recipe dependencies. No icon dependency is required.
- Context-based field registration supporting reusable consumer field components.
- Docs navigation, quickstart, styling guidance, and a README link that make the recipe easy to find.
- Automated verification of reusable fields, recipe behavior, copy fidelity, and a clean consumer build.

## Non-goals

- No bundled/default theme or exported stylesheet in the npm package.
- No theme picker, recipe gallery, CLI, registry, or code generator in this first implementation.
- No replacement of the concise components with a new compound-component API.
- No new public styling-prop API, icon slots, or render props. Existing hooks and props are sufficient for this recipe.
- No submission backend, persistence, analytics, or external message delivery. The live demo reports its result locally.
- No general resolver, event-handler forwarding, default-value/reset, or file-preview fixes from the earlier audit. Preserve those as separate work unless a concrete regression from this implementation requires a fix.
- No release, deployment, commit, or merge is authorized by this document.

## Design

### Form context

`ARForm` provides its form instance through context. Fields read the nearest provided instance instead of depending on child traversal. Prefer React Hook Form's existing provider/context APIs; use one internal helper if needed for compatibility.

Remove `ChildrenLoop` and its component-name registry when all field types use context. Context consumption must obey the Rules of Hooks, including when explicit form methods are supplied.

Keep the existing `formProps` prop working for consumers that already provide it explicitly. Explicit methods take precedence over inherited context. Do not require a new prop or provider in the normal `<ARForm>` usage. Preserve existing behavior for fields used without either source; changing that error policy is outside this spec.

Cover Text, Date, Checkbox, Select, TextArea, FileUpload, and TagInput. Two sibling forms must maintain independent values, errors, and callbacks. Nested HTML forms remain unsupported. Do not change field naming or validation semantics as part of the context migration.

### Recipe source

Store the maintained recipe files under `site/src/recipes/contact/`:

- `ContactForm.tsx`: the form, its schema, and a small exported `ContactText` wrapper that demonstrates reuse of `Text` with ordinary props. Include the Tailwind utility classes for labels, controls, errors, focus, disabled states, tags, and the submit button in this file. Import library components from `accessible-react-form`, never repository-relative source paths. Expose an `onSubmit` callback rather than embedding a network request.
- `Usage.tsx`: the minimal application example connecting the form to a local result display. Include its Tailwind utility classes in this file and show the same local-only submission behavior used by the preview.

The live preview, displayed code, and copied text must come from these actual files. Use raw source imports or equivalent build-time loading; do not maintain separate hand-written strings or hide required helpers outside the copied files. Ordinary module loading should execute the same recipe source that users receive. The preview must compile with the site's Tailwind setup while remaining isolated from the site's `.arform` theme.

List all dependencies and filenames next to the code. The instructions assume an existing React application with Tailwind configured, and specify installation of `accessible-react-form`, `react-hook-form`, and `zod`. Do not require a recipe CSS file or hidden stylesheet for the copied source. No icon dependency is needed for this first recipe.

A consumer can edit the Tailwind classes or reuse `ContactText` in another form. Document that the recipe styles are theirs to maintain and that the library supplies form behavior and state hooks.

### Docs experience

Add `/docs/recipes/contact` to the existing docs router and a Contact form link under Getting started. Link to it from the README and quickstart. Keep the API-oriented unstyled examples available.

The page includes a short introduction, Tailwind prerequisite, dependency command, and Preview / Code tabs. Code view offers `ContactForm.tsx` and `Usage.tsx`, with a copy action for the selected file and a separate copy-install action. The displayed source must include the Tailwind class names used by the preview. Per-file copying is required; downloading a bundle is not part of this first version.

Use the existing docs code renderer and copy controls where suitable. Announce successful copy operations accessibly. If clipboard access fails, keep selectable source visible and explain how to copy manually; never claim success on failure.

The live preview must use the copied JSX and its Tailwind classes, isolated from the site's global `.arform` theme so the copied files reproduce its appearance. A dedicated Storybook recipe story embedded with the existing `StoryEmbed` is an acceptable implementation. Give it enough responsive height to show errors and the submission result without clipping. Retain entered values when switching between Preview and Code; switching views must not submit or reset the form.

Tabs must support keyboard navigation, visible focus, and correct selected-panel relationships. At narrow widths, the layout must fit the viewport; long source lines may scroll within the code pane.

Do not copy the prototype's fake navigation, variant switcher, debugging state panel, or experimental layouts into production. Adapt its Preview / Code arrangement to the existing docs design.

## Acceptance criteria and test contract

Use the existing Storybook interaction/axe runner for library and recipe behavior. Add a focused docs browser command, `npm run test:recipes`, for the real docs route, clipboard behavior, and copied-consumer verification. Declare any new directly used test dependency explicitly. Tests observe public behavior rather than private context implementation.

| #   | Requirement                                                                                                                                                                                                                                                                                     | Named evidence                                                                                                               |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 1   | Built-in fields inside ordinary consumer components, memoized wrappers, fragments, and layout components render, register, and submit their values without special names or forwarded form methods. Cover every field type, including checkbox selection, native file selection, and tag entry. | `WrappedFields` Storybook interaction test; typecheck the wrapper props.                                                     |
| 2   | Wrapped fields retain schema validation, error descriptions, label associations, class/style forwarding, and disabled behavior. Invalid submission is blocked and correction permits submission.                                                                                                | `WrappedFieldValidation` and axe checks.                                                                                     |
| 3   | Sibling forms remain independent. Existing direct-field usage still works. An explicitly supplied `formProps` instance continues to work and takes precedence over context.                                                                                                                     | `FormContextIsolation`, `ExplicitFormProps`, and the existing Storybook suite.                                               |
| 4   | The contact recipe supports valid submission, invalid-field feedback, and adding/removing topics. Its visible textbox keeps its label after tag actions. Submission displays a local result and makes no application submission request.                                                        | `ContactRecipe` story with play assertions and axe.                                                                          |
| 5   | The docs route is reachable from navigation and quickstart. Preview / Code and file selection work with pointer and keyboard. Switching views preserves entered form data. At a 375px viewport, controls remain visible and only the code pane may scroll horizontally.                         | `RecipeDocsNavigation` browser test on the built site, plus visual approval.                                                 |
| 6   | Displayed and copied JSX files match the canonical source, including the Tailwind classes used by the preview. Copy-install produces the documented command. Successful copying is announced; denied clipboard access exposes selectable code and an accurate fallback message.                 | `RecipeCopyFiles` browser test, including clipboard-success and clipboard-failure paths.                                     |
| 7   | The exact recipe files compile and function in an isolated React consumer using a tarball of the built package. No repository aliases, relative library-source imports, hidden theme CSS, or undeclared helpers are needed. Reusing the copied `ContactText` in another form works.             | `CopiedRecipeConsumer`: typecheck/build the fixture, then submit both the copied form and a form using its field wrapper.    |
| 8   | The npm package still contains no stylesheets or recipe/demo assets. The raw Storybook stories remain unstyled, and the recipe preview uses its copied Tailwind classes without influence from the docs site's `.arform` theme.                                                                 | Existing `check:package-css`, a package-file assertion for recipe/demo exclusions, and `RecipeStyleIsolation` browser check. |

`RecipeStyleIsolation` should verify that the site's `.arform` theme cannot change the isolated preview's controls. Also verify that Tailwind-styled recipe controls do not cause styles to leak into an adjacent ordinary form. Do not rely on class-name inspection alone.

The clean-consumer fixture must use the files returned by the copy source, without rewriting their imports or stylesheet contents. Test against the current built package, not an older registry release. If Storybook imports the recipe through the public package entry, ensure its build/test commands and CI build the library first on a clean checkout.

## Verification and delivery

1. Implement one acceptance-test slice at a time, recording a failing case before fixing the behavior. During UI iteration, use scoped checks and preview builds.
2. Present the actual docs route for visual approval in desktop and narrow layouts. Check initial, invalid, populated-tag, and submitted states, plus the source/copy interaction.
3. After visual approval, run typecheck, lint, formatting, library build, package assertions, the full Storybook suite, the docs/site production build, and `npm run test:recipes`. Use the repo's CI build order and record exact commands/results.
4. Run independent review and QA against the same final contents. Mark any unverified criterion explicitly. Leave changes uncommitted until the user approves committing; merge requires separate approval.

Before publishing the docs, confirm the documented installation version includes the context and zero-CSS fixes. This spec does not authorize publishing an incompatible recipe ahead of its package release.

## Prototype reference

The accepted direction is demonstrated by `playground/recipe-prototype.html`, built from `playground/src/recipe-prototype/`. The prototype explored Preview / Code, side-by-side, and starter-file presentations. The user approved the copyable-recipe approach; this spec selects Preview / Code as the first production presentation. The Tailwind source should follow the supplied Headless UI reference: utility classes appear in the JSX shown to the user and copied from the docs.

The playground is ignored and machine-local. The spec above is the implementation contract; a future build must not depend on the prototype being present. If the user later authorizes preserving the prototype in Git, capture it separately from production work under the prototype skill's workflow.
