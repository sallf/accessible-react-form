# Issue tracker: local Markdown

Track work under `.scratch/<feature-slug>/`. Do not create external issues unless explicitly requested.

The authoritative build spec is `SPEC-<feature-slug>.md` at the repository root. Publish a local tracker entry at `.scratch/<feature-slug>/spec.md` that links to it; do not maintain a second copy of the spec.

Use a `Status:` line for triage, including `ready-for-agent`. Triage status does not authorize implementation or commits; spec approval is recorded in conversation.

If a feature needs separate implementation tickets, put each in `.scratch/<feature-slug>/issues/<NN>-<slug>.md`. This tracker records work items, not portfolio status.

After implementation and required review/QA pass, remove the completed root spec and its `.scratch/` records before merging. First move lasting consumer or maintainer guidance into durable documentation, and keep unresolved work in separate active tracker entries. Update references to removed files. Git history preserves completed specs and work records; do not keep them in the working tree as an archive.
