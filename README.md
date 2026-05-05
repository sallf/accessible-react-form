# Accessible React Form

This is the alpha version of a minimal, accessible React form component. It uses [yup](https://github.com/jquense/yup) for validation and [react-hook-form](https://react-hook-form.com/) for a performant setup.

## Basic Form

```
const validationSchema: AnyObjectSchema = object({
  name: string().required(),
  email: string().email(),
})

<ARForm validationSchema={basicValidationSchema} onSubmit={onSubmit}>
  <Text id="name" label="Name" />
  <Text id="email" label="Email" />
</ARForm>
```

See `src/stories` for more examples.
