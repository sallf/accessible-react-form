# Consumer readiness work

Status: in progress

Authorized by the user's request to continue through the remaining steps and make the codebase ready for consumers. The user authorizes committing and updating PR #66 after independent review and QA pass. No merge, package publication, or production deployment without explicit approval. Use focused sequential batches and the existing public Storybook/form test boundary.

1. Complete: CI clean-checkout installation/build resolution and native select contrast. All GitHub checks passed at 927fc22.
2. Complete: consistent schema-free required validation and message-less error feedback (SPEC-required-validation.md). Independent review and QA passed, including 60 interaction/accessibility tests.
3. File preview reset/default-value synchronization and object-URL cleanup.
4. Typed/nested form integration: eliminate flat/nested error disagreement, stale messages, and incorrect error counts; make conventional typed useForm methods accepted by field props. Fix stale ARForm change callbacks after parent updates with a public regression.
5. Normalize TagInput suggestions consistently with selected tags.
6. Replace blanket accessibility claims with precise behavior/limits and verify consumer/release guidance.
7. Address dependency advisories with compatible updates where available, retaining separate production/tooling findings. Current package production audit is clear; site has a Valibot advisory; tooling has transitive advisories.
8. Final full-branch independent review, public interaction/axe suite, builds/typechecks/lint/format, clean install/package/isolated-consumer checks, and GitHub CI on the final commit.

Optional live whole-form error clearing and broad event-handler refactoring remain outside the readiness baseline unless concrete defects make them necessary. Preserve the headless package and canonical copied example sources. Do not update AGENTS.md or portfolio status without the required authorization.
