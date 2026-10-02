# Required validation implementation evidence

Approved public seam: Storybook interactions through ARForm and public field components, including explicitly supplied React Hook Form methods. No internal mocks or helper tests. Applied TDD and human-writing skills.

Scoped slice command:

`npx test-storybook --url http://127.0.0.1:6007 --includeTags required-regression --maxWorkers=1 --no-cache`

1. **SchemaFreeRequiredFields**
   - Red: empty required Text was marked `aria-invalid="false"`; expected true. Output: `required-red.log`.
   - Change: all errors mark controls invalid; required errors without messages render `This field is required`. Select and TextArea register required rules alongside existing shared input/TagInput registration.
   - Green: one story passed. Every control, including both TagInput modes and a real file upload, rejects empty submission, associates required feedback with help, and submits original keys/values after correction. Output: `required-green.log`.
2. **OptionalAndDisabledFields**
   - Red: disabled required fields blocked submission; expected one submit call, received zero. Required-fields story stayed green. Output: `disabled-red.log`.
   - Change: shared input, Select, TextArea, and TagInput pass disabled state to registration. Native disabled behavior and TagInput disabled buttons remain intact.
   - Green: two stories passed. Optional/disabled fields have no errors and submit successfully. Output: `disabled-green.log`.
   - Final fixture also checks a required text field containing a single space succeeds unchanged, matching React Hook Form semantics.
3. **MessageLessFieldErrors**
   - Red: a required error with a real whitespace-only message produced accessible description `Complete this field. .` instead of the required fallback. Prior two stories passed. Output: `message-less-red.log`.
   - Change: FieldError uses nonblank messages unchanged; required empty/blank messages use the required fallback, other empty/blank errors use `Please check this field`.
   - Green: three stories passed. Explicit public form methods set required and manual errors across every control; fallbacks coexist with help, invalid state is true, clearing restores help and valid state, and a nonblank supplied message including surrounding spaces is preserved. Output: `message-less-green.log`.
4. **SchemaOwnsRequiredValidation**
   - Existing resolver precedence already satisfies this contract; no additional production change was needed. A schema accepting empty values permits all required-presentation fields to submit. A rejecting schema retains its original message and invalid association; correction submits successfully.

Added initial/required-invalid/manual-invalid terminal-state stories for the shared axe runner. Named recovered stories also receive axe checks. README required-prop docs explain schema-free validation, disabled exclusion, schema precedence, and fallback messages. Broad WCAG claim remains untouched for its later batch.

Final scoped command includes required and existing attribute regressions:

`npx test-storybook --url http://127.0.0.1:6007 --includeTags required-regression attribute-regression --maxWorkers=1 --no-cache`

- `scoped-stories.log`: 17 stories passed (seven required, ten attributes), zero axe violations.
- `root-typecheck.log`: `npx tsc --noEmit` passed.
- `site-typecheck.log`: `npx tsc --noEmit -p site/tsconfig.json` passed.
- Changed source and README formatted with Prettier.

Source frozen for independent review and full QA. No Git mutations. Parent owns CI repairs and integration actions.

## Review follow-up: form-wide disabled methods

- `FormWideDisabledLateMount` red: an input mounted after the initial render with supplied `useForm({ disabled: true })` methods was enabled; the test expected disabled. All seven prior required stories passed. Output: `form-wide-disabled-red.log`.
- Minimal native fix: retain registration's disabled attribute rather than overriding it after the spread. React Hook Form combines form-wide disabled with local disabled, including an explicit local false.
- TagInput fix: combine its local disabled prop with supplied methods' form-wide disabled state for its visible textbox, tag buttons, event guards, and registration. Its hidden registration input preserves the registration attributes.
- Green: all 18 focused required/attribute stories passed with zero axe violations. Delayed fixtures cover all native controls and both TagInput modes, with omitted/local-false disabled props. Existing tag removal buttons and suggestions remain disabled and cannot change selections; visible draft textboxes remain disabled.
- Output: `form-wide-disabled-green.log`. Root/site typechecks and formatting pass. Source frozen for the next independent gate round; no Git mutations.

## Disabled recovery boundary check

Extended `FormWideDisabledLateMount` to change the supplied form methods from disabled to enabled after the disabled assertions. Every native control and TagInput textbox re-enables for both omitted and local-false disabled props. Existing tag removal buttons become usable, suggestions can add tags, typed textbox entries can add tags, and the group disabled state attribute clears. This additional recovery contract passed without a production change.

All 18 focused required/attribute stories and axe checks passed (`form-wide-enabled-recovery.log`); root typecheck and formatting passed. Source frozen for regate.

## Round 2 follow-up: globally disabled required submissions

- Extended `FormWideDisabledLateMount` to submit through the supplied public methods while globally disabled. Red: no submit callback despite disabled controls; expected one callback. Prior seven required stories passed. Output: `form-wide-submission-red.log`.
- Native controls now combine the local disabled prop with `formState.disabled` before registration, matching TagInput. This prevents local `disabled={false}` from reactivating required validation within a disabled form while preserving registration's DOM attributes.
- Green: globally disabled submission succeeds with no required errors in both omitted and local-false panels. After enabling, controls and tag actions work and a resubmit rejects remaining empty required controls in both panels, proving registration does not remain disabled.
- All 18 scoped required/attribute stories pass with zero axe violations (`form-wide-submission-green.log`). Root/site typechecks and formatting pass. Source frozen for the next independent gate round; no Git mutations.

## Final gates

Independent round 3 review found no actionable findings. QA verified every acceptance criterion and passed all 60 Storybook interaction/accessibility tests, root/site typechecks, lint, formatting, production builds, package stylesheet assertions, and recipe browser/isolated-consumer checks. Reports: `gates/round3-review-result.log` and `gates/round3-qa-result.log`. Existing watch lint and site bundle-size advisories remain nonblocking.
