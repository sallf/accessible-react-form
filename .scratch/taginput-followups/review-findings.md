# TagInput review follow-ups

Status: suggestion normalization complete; prop-filter deduplication remains optional

These findings were present at `7193738` before the accessibility-attribute work. They were outside the attribute-forwarding fix. Finding 1 is now complete under SPEC-tag-suggestions.md, with independent review and QA passed. Finding 2 remains an optional cleanup.

1. Selecting a whitespace-padded suggestion such as `" React "` stores `"React"`, but suggestion filtering compares the untrimmed value. The Add button remains available and clicking it again does nothing. Normalize suggestion storage and filtering consistently in a separate fix, with a public interaction regression.
2. Textbox and suggestions-only modes duplicate the same prop exclusion list. Consider sharing the filtering while retaining mode-specific event types. This is a nonblocking cleanup, not a reason to broaden the current fix.

Found by independent review of the full branch against main. The separate finding about consumer accessible names is being fixed within the attribute-forwarding scope.
