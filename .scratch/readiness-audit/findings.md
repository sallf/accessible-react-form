# Additional consumer audit findings

Status: queued for focused readiness batches

Independent read-only audit of the public API after `8950b1d` confirmed three additional pre-existing issues:

1. Nested schema errors: submitting `account.name` empty creates a flat error key. Editing to another invalid value adds a nested error while preserving the original flat error. The field shows stale feedback and the summary counts two errors for one field. Explicit React Hook Form methods with nested errors show no feedback. Fix resolver structure, field lookup, and leaf error counting together.
2. Callback replacement: updating a parent callback from version 1 to version 2 leaves subsequent field changes invoking the first closure. The watch subscription depends only on watch. Refresh callback handling without duplicate subscriptions or event notifications.
3. Typed external methods: passing `useForm<{ email: string }>()` to Text's formProps fails TS2322 because UseFormReturn<FieldValues> is not compatible with conventional typed methods. Verify a consumer TypeScript fixture across all controls.

The audit also observed that server rendering omits ARForm default values because they are applied only in an effect. Consider initial defaults in the form integration batch. CJS and ESM imports work on local Node 22; ESM emits a module-type warning, to be assessed in final package checks.

No audit source edits or Git mutations were performed. Browser/SSR/compiler reproductions informed the findings; implementation batches must add public red/green regression evidence before fixes.
