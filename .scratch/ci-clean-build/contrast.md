# Native select contrast fixture correction

Status: implemented, awaiting independent gates

CI run 36956337135 passed clean installation and Storybook build, then axe failed ConsumerStyling on the native styledSelect control. Its consumer-supplied teal text did not meet contrast requirements against Linux Chromium's native select background. The same fixture passed against the local native appearance.

Use darker teal (#006666) for the fixture's custom-colored controls and update its prop-forwarding color assertion. This changes only the Unstyled verification fixture; the library remains headless and no accessibility rules are disabled. The GitHub failure is red evidence in ci-test-failure.log. Final Storybook/axe QA will verify the corrected fixture; a subsequent GitHub run checks the Linux rendering.
