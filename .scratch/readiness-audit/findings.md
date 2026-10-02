# Additional consumer audit findings

Status: all three confirmed issues completed in the form-integration batch (`a8187bb`)

Independent read-only audit of the public API after `8950b1d` confirmed three additional pre-existing issues:

1. Nested schema errors: fixed nested resolver storage, field lookup, and actual error counting. Public regressions cover recovery, arrays, parent/child errors, metadata names, unsafe/reserved paths, and retained external descendants.
2. Callback replacement: the watch subscription follows the current callback and unsubscribes on removal. Public replacement/removal interactions verify one notification with the current closure.
3. Typed external methods: every control accepts conventional typed useForm methods through the shared field boundary. The isolated built-package fixture checks typed values/context/output, reusable wrappers, and native-prop failures; it also passes the final React 18/minimum-RHF refresh.

Server rendering still omits ARForm default values because they are applied in an effect. General SSR support was outside the approved scope and is not promised. CJS and ESM imports passed on the earlier local Node 22 check, with an ESM module-type warning. The final packed-package imports pass on available Node 25.2.1 without that warning; Node 22 was not available for the refresh, so its earlier warning remains a packaging limit.

Public red/green evidence and independent gates are recorded in [form integration evidence](../form-integration/implementation.md); final peer checks are in [React 18 compatibility](react18.md). This audit refresh changed only these evidence reports and the temporary consumer; no library source, checkout lockfiles, Git state, or existing Storybook servers were changed.
