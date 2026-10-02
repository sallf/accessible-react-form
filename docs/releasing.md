# Release and docs checklist

The deployed docs must describe a package consumers can install. Netlify builds the local checkout, so a successful site build does not prove that the matching package is available on npm.

1. Choose the release version explicitly. Update package.json and the root lock, refresh the site file-link metadata, and refresh the packed-package consumer fixture lock with the matching tarball. Keep the fixture package version and its package contents coordinated. No release version is selected by this readiness batch.
2. Run clean installs, typechecks, production builds, package checks, Storybook/recipe tests, and independent review/QA. Record unresolved development-tool advisories separately from production audits.
3. Obtain explicit authorization for merge and release actions. Commit/push approval does not authorize merging, tagging, npm publication, or docs deployment.
4. After the approved commit is on main, create the matching v-prefixed tag only when release is authorized. The release workflow verifies the tag/version and main ancestry, then publishes to npm. Prereleases use the next dist-tag; stable releases use latest.
5. Verify the published version and tarball contents before deploying its docs. Alpha install snippets use accessible-react-form@next; an exact matching prerelease is also valid. Change snippets to the stable install only when that release is available.
6. Deploy docs from the matching source after publication is confirmed. If hosting deploys automatically on main pushes, hold that deployment until the package is published or keep public docs on the previous released version.

Do not merge, publish, or deploy automatically as part of a readiness check.
