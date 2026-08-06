// Code samples for the "less code" comparison are generated from a single
// field spec per scenario, so every library shows the *same* form with the
// *same* accessibility wiring. That keeps the line-count comparison honest:
// the only variable is how much boilerplate each library makes you write.

export type LibraryId = 'arform' | 'rhf' | 'tanstack' | 'formik'

export type Library = {
  id: LibraryId
  name: string
  tagline: string
}

export const libraries: Library[] = [
  {
    id: 'arform',
    name: 'accessible-react-form',
    tagline: 'a11y wired internally',
  },
  {
    id: 'rhf',
    name: 'raw react-hook-form',
    tagline: 'manual ARIA + error wiring',
  },
  {
    id: 'tanstack',
    name: 'TanStack Form',
    tagline: 'render-prop fields + ARIA',
  },
  {
    id: 'formik',
    name: 'Formik',
    tagline: 'verbose render props + ARIA',
  },
]

type FieldType =
  'text' | 'email' | 'password' | 'date' | 'select' | 'textarea' | 'checkbox'

type Field = {
  id: string
  label: string
  type: FieldType
  required?: boolean
  options?: string[]
}

type ScenarioSpec = {
  id: string
  name: string
  blurb: string
  component: string
  fields: Field[]
}

const scenarioSpecs: ScenarioSpec[] = [
  {
    id: 'signup',
    name: 'Signup',
    blurb: 'The two-field starting point — name and email.',
    component: 'SignupForm',
    fields: [
      { id: 'name', label: 'Name', type: 'text', required: true },
      { id: 'email', label: 'Email', type: 'email', required: true },
    ],
  },
  {
    id: 'login',
    name: 'Login',
    blurb: 'Email, password, and a "remember me" checkbox.',
    component: 'LoginForm',
    fields: [
      { id: 'email', label: 'Email', type: 'email', required: true },
      { id: 'password', label: 'Password', type: 'password', required: true },
      { id: 'remember', label: 'Remember me', type: 'checkbox' },
    ],
  },
  {
    id: 'contact',
    name: 'Contact',
    blurb: 'A topic dropdown and a free-text message.',
    component: 'ContactForm',
    fields: [
      { id: 'name', label: 'Name', type: 'text', required: true },
      { id: 'email', label: 'Email', type: 'email', required: true },
      {
        id: 'topic',
        label: 'Topic',
        type: 'select',
        required: true,
        options: ['Sales', 'Support', 'Billing'],
      },
      { id: 'message', label: 'Message', type: 'textarea', required: true },
    ],
  },
  {
    id: 'registration',
    name: 'Registration',
    blurb: 'The full profile — text, select, date, textarea, and consent.',
    component: 'RegistrationForm',
    fields: [
      { id: 'name', label: 'Name', type: 'text', required: true },
      { id: 'email', label: 'Email', type: 'email', required: true },
      { id: 'password', label: 'Password', type: 'password', required: true },
      {
        id: 'country',
        label: 'Country',
        type: 'select',
        required: true,
        options: ['USA', 'Canada', 'Mexico'],
      },
      { id: 'dob', label: 'Date of birth', type: 'date', required: true },
      { id: 'bio', label: 'Bio', type: 'textarea' },
      {
        id: 'terms',
        label: 'I accept the terms',
        type: 'checkbox',
        required: true,
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------

const inputType = (f: Field) => (f.type === 'date' ? 'date' : f.type)

const schemaBlock = (fields: Field[]) =>
  [
    'const schema = object({',
    ...fields.map((f) => {
      if (f.type === 'checkbox') {
        return f.required
          ? `  ${f.id}: boolean().oneOf([true]).required(),`
          : `  ${f.id}: boolean(),`
      }
      const email = f.type === 'email' ? '.email()' : ''
      const req = f.required ? '.required()' : ''
      return `  ${f.id}: string()${email}${req},`
    }),
    '})',
  ].join('\n')

const yupImport = (fields: Field[]) => {
  const parts = ['object', 'string']
  if (fields.some((f) => f.type === 'checkbox')) parts.push('boolean')
  return `import { ${parts.join(', ')} } from 'yup'`
}

// ---------------------------------------------------------------------------
// accessible-react-form
// ---------------------------------------------------------------------------

const arformComponents = (fields: Field[]) => {
  const set = new Set<string>(['ARForm'])
  for (const f of fields) {
    if (f.type === 'select') set.add('Select')
    else if (f.type === 'textarea') set.add('TextArea')
    else if (f.type === 'checkbox') set.add('Checkbox')
    else if (f.type === 'date') set.add('Date')
    else set.add('Text')
  }
  const order = ['ARForm', 'Text', 'Select', 'TextArea', 'Checkbox', 'Date']
  return order.filter((c) => set.has(c))
}

const arformField = (f: Field) => {
  const req = f.required ? ' required' : ''
  if (f.type === 'select') {
    const opts = `[${f.options!.map((o) => `'${o}'`).join(', ')}]`
    return [
      '    <Select',
      `      id="${f.id}"`,
      `      label="${f.label}"`,
      `      options={${opts}}`,
      ...(f.required ? ['      required'] : []),
      '    />',
    ].join('\n')
  }
  if (f.type === 'textarea')
    return `    <TextArea id="${f.id}" label="${f.label}"${req} />`
  if (f.type === 'checkbox')
    return `    <Checkbox id="${f.id}" label="${f.label}"${req} />`
  if (f.type === 'date')
    return `    <Date id="${f.id}" label="${f.label}"${req} />`
  const type = f.type === 'text' ? '' : ` type="${f.type}"`
  return `    <Text id="${f.id}" label="${f.label}"${type}${req} />`
}

const arformCode = (s: ScenarioSpec) =>
  [
    `import { ${arformComponents(s.fields).join(', ')} } from 'accessible-react-form'`,
    yupImport(s.fields),
    '',
    schemaBlock(s.fields),
    '',
    `export const ${s.component} = ({ onSubmit }) => (`,
    '  <ARForm validationSchema={schema} onSubmit={onSubmit}>',
    ...s.fields.map(arformField),
    '  </ARForm>',
    ')',
  ].join('\n')

// ---------------------------------------------------------------------------
// raw react-hook-form
// ---------------------------------------------------------------------------

const rhfError = (f: Field) =>
  [
    `        {errors.${f.id} && (`,
    `          <p id="${f.id}-error" role="alert">`,
    `            {errors.${f.id}.message}`,
    '          </p>',
    '        )}',
  ].join('\n')

const rhfStar = (f: Field) =>
  f.required ? ' <span aria-hidden="true">*</span>' : ''

const rhfField = (f: Field): string => {
  const ariaReq = f.required ? '          aria-required="true"\n' : ''

  if (f.type === 'checkbox') {
    if (!f.required) {
      return [
        '      <div>',
        `        <input id="${f.id}" type="checkbox" {...register('${f.id}')} />`,
        `        <label htmlFor="${f.id}">${f.label}</label>`,
        '      </div>',
      ].join('\n')
    }
    return [
      '      <div>',
      '        <input',
      `          id="${f.id}"`,
      '          type="checkbox"',
      `          aria-invalid={!!errors.${f.id}}`,
      `          aria-describedby={errors.${f.id} ? '${f.id}-error' : undefined}`,
      `          {...register('${f.id}')}`,
      '        />',
      `        <label htmlFor="${f.id}">`,
      `          ${f.label} <span aria-hidden="true">*</span>`,
      '        </label>',
      rhfError(f),
      '      </div>',
    ].join('\n')
  }

  if (f.type === 'select') {
    const opts = f
      .options!.map((o) => `          <option value="${o}">${o}</option>`)
      .join('\n')
    return [
      '      <div>',
      `        <label htmlFor="${f.id}">`,
      `          ${f.label}${rhfStar(f)}`,
      '        </label>',
      '        <select',
      `          id="${f.id}"`,
      ariaReq + `          aria-invalid={!!errors.${f.id}}`,
      `          aria-describedby={errors.${f.id} ? '${f.id}-error' : undefined}`,
      `          {...register('${f.id}')}`,
      '        >',
      '          <option value="">Select…</option>',
      opts,
      '        </select>',
      rhfError(f),
      '      </div>',
    ].join('\n')
  }

  const tag = f.type === 'textarea' ? 'textarea' : 'input'
  const typeAttr =
    f.type === 'textarea' ? '' : `          type="${inputType(f)}"\n`
  return [
    '      <div>',
    `        <label htmlFor="${f.id}">`,
    `          ${f.label}${rhfStar(f)}`,
    '        </label>',
    `        <${tag}`,
    `          id="${f.id}"`,
    typeAttr + ariaReq + `          aria-invalid={!!errors.${f.id}}`,
    `          aria-describedby={errors.${f.id} ? '${f.id}-error' : undefined}`,
    `          {...register('${f.id}')}`,
    '        />',
    rhfError(f),
    '      </div>',
  ].join('\n')
}

const rhfCode = (s: ScenarioSpec) =>
  [
    "import { useForm } from 'react-hook-form'",
    "import { yupResolver } from '@hookform/resolvers/yup'",
    yupImport(s.fields),
    '',
    schemaBlock(s.fields),
    '',
    `export const ${s.component} = ({ onSubmit }) => {`,
    '  const {',
    '    register,',
    '    handleSubmit,',
    '    formState: { errors },',
    '  } = useForm({ resolver: yupResolver(schema) })',
    '',
    '  return (',
    '    <form onSubmit={handleSubmit(onSubmit)} noValidate>',
    s.fields.map(rhfField).join('\n\n'),
    '',
    '      <button type="submit">Submit</button>',
    '    </form>',
    '  )',
    '}',
  ].join('\n')

// ---------------------------------------------------------------------------
// TanStack Form
// ---------------------------------------------------------------------------

const tsStar = (f: Field) =>
  f.required ? ' <span aria-hidden="true">*</span>' : ''

const tsErrorSetup = [
  '        {(field) => {',
  '          const error = field.state.meta.errors[0]',
  '          const message = error?.message ?? error',
  '          return (',
]

const tsErrorRender = [
  '              {error && (',
  '                <p id={`${field.name}-error`} role="alert">',
  '                  {message}',
  '                </p>',
  '              )}',
]

const tsField = (f: Field): string => {
  if (f.type === 'checkbox') {
    if (!f.required) {
      return [
        `      <form.Field name="${f.id}">`,
        '        {(field) => (',
        '          <div>',
        '            <input',
        '              id={field.name}',
        '              name={field.name}',
        '              type="checkbox"',
        '              checked={field.state.value}',
        '              onBlur={field.handleBlur}',
        '              onChange={(e) => field.handleChange(e.target.checked)}',
        '            />',
        `            <label htmlFor={field.name}>${f.label}</label>`,
        '          </div>',
        '        )}',
        '      </form.Field>',
      ].join('\n')
    }
    return [
      `      <form.Field name="${f.id}">`,
      ...tsErrorSetup,
      '            <div>',
      '              <input',
      '                id={field.name}',
      '                name={field.name}',
      '                type="checkbox"',
      '                checked={field.state.value}',
      '                onBlur={field.handleBlur}',
      '                onChange={(e) => field.handleChange(e.target.checked)}',
      '                aria-invalid={!!error}',
      '                aria-describedby={error ? `${field.name}-error` : undefined}',
      '              />',
      '              <label htmlFor={field.name}>',
      `                ${f.label} <span aria-hidden="true">*</span>`,
      '              </label>',
      ...tsErrorRender,
      '            </div>',
      '          )',
      '        }}',
      '      </form.Field>',
    ].join('\n')
  }

  const ariaReq = f.required ? '                aria-required="true"\n' : ''

  if (f.type === 'select') {
    const opts = f
      .options!.map((o) => `                <option value="${o}">${o}</option>`)
      .join('\n')
    return [
      `      <form.Field name="${f.id}">`,
      ...tsErrorSetup,
      '            <div>',
      '              <label htmlFor={field.name}>',
      `                ${f.label}${tsStar(f)}`,
      '              </label>',
      '              <select',
      '                id={field.name}',
      '                name={field.name}',
      '                value={field.state.value}',
      '                onBlur={field.handleBlur}',
      '                onChange={(e) => field.handleChange(e.target.value)}',
      ariaReq + '                aria-invalid={!!error}',
      '                aria-describedby={error ? `${field.name}-error` : undefined}',
      '              >',
      '                <option value="">Select…</option>',
      opts,
      '              </select>',
      ...tsErrorRender,
      '            </div>',
      '          )',
      '        }}',
      '      </form.Field>',
    ].join('\n')
  }

  const tag = f.type === 'textarea' ? 'textarea' : 'input'
  const typeAttr =
    f.type === 'textarea' ? '' : `                type="${inputType(f)}"\n`
  return [
    `      <form.Field name="${f.id}">`,
    ...tsErrorSetup,
    '            <div>',
    '              <label htmlFor={field.name}>',
    `                ${f.label}${tsStar(f)}`,
    '              </label>',
    `              <${tag}`,
    '                id={field.name}',
    '                name={field.name}',
    typeAttr + '                value={field.state.value}',
    '                onBlur={field.handleBlur}',
    '                onChange={(e) => field.handleChange(e.target.value)}',
    ariaReq + '                aria-invalid={!!error}',
    '                aria-describedby={error ? `${field.name}-error` : undefined}',
    '              />',
    ...tsErrorRender,
    '            </div>',
    '          )',
    '        }}',
    '      </form.Field>',
  ].join('\n')
}

const tsDefaults = (fields: Field[]) =>
  fields
    .map((f) => `${f.id}: ${f.type === 'checkbox' ? 'false' : "''"}`)
    .join(', ')

const tanstackCode = (s: ScenarioSpec) =>
  [
    "import { useForm } from '@tanstack/react-form'",
    yupImport(s.fields),
    '',
    schemaBlock(s.fields),
    '',
    `export const ${s.component} = ({ onSubmit }) => {`,
    '  const form = useForm({',
    `    defaultValues: { ${tsDefaults(s.fields)} },`,
    '    validators: { onChange: schema },',
    '    onSubmit: ({ value }) => onSubmit(value),',
    '  })',
    '',
    '  return (',
    '    <form',
    '      noValidate',
    '      onSubmit={(e) => {',
    '        e.preventDefault()',
    '        form.handleSubmit()',
    '      }}',
    '    >',
    s.fields.map(tsField).join('\n\n'),
    '',
    '      <button type="submit">Submit</button>',
    '    </form>',
    '  )',
    '}',
  ].join('\n')

// ---------------------------------------------------------------------------
// Formik
// ---------------------------------------------------------------------------

const fkStar = (f: Field) =>
  f.required ? ' <span aria-hidden="true">*</span>' : ''

const fkError = (f: Field) =>
  [
    `          <ErrorMessage name="${f.id}">`,
    '            {(msg) => (',
    `              <p id="${f.id}-error" role="alert">`,
    '                {msg}',
    '              </p>',
    '            )}',
    '          </ErrorMessage>',
  ].join('\n')

const fkDescribedBy = (f: Field) =>
  [
    '            aria-describedby={',
    `              errors.${f.id} && touched.${f.id} ? '${f.id}-error' : undefined`,
    '            }',
  ].join('\n')

const fkField = (f: Field): string => {
  const ariaReq = f.required ? '            aria-required="true"\n' : ''

  if (f.type === 'checkbox') {
    if (!f.required) {
      return [
        '        <div>',
        `          <Field id="${f.id}" name="${f.id}" type="checkbox" />`,
        `          <label htmlFor="${f.id}">${f.label}</label>`,
        '        </div>',
      ].join('\n')
    }
    return [
      '        <div>',
      '          <Field',
      `            id="${f.id}"`,
      `            name="${f.id}"`,
      '            type="checkbox"',
      `            aria-invalid={!!(errors.${f.id} && touched.${f.id})}`,
      fkDescribedBy(f),
      '          />',
      `          <label htmlFor="${f.id}">`,
      `            ${f.label} <span aria-hidden="true">*</span>`,
      '          </label>',
      fkError(f),
      '        </div>',
    ].join('\n')
  }

  if (f.type === 'select') {
    const opts = f
      .options!.map((o) => `            <option value="${o}">${o}</option>`)
      .join('\n')
    return [
      '        <div>',
      `          <label htmlFor="${f.id}">`,
      `            ${f.label}${fkStar(f)}`,
      '          </label>',
      '          <Field',
      '            as="select"',
      `            id="${f.id}"`,
      `            name="${f.id}"`,
      '            aria-required="true"',
      `            aria-invalid={!!(errors.${f.id} && touched.${f.id})}`,
      fkDescribedBy(f),
      '          >',
      '            <option value="">Select…</option>',
      opts,
      '          </Field>',
      fkError(f),
      '        </div>',
    ].join('\n')
  }

  const asAttr = f.type === 'textarea' ? '            as="textarea"\n' : ''
  const typeAttr =
    f.type === 'textarea' ? '' : `            type="${inputType(f)}"\n`
  return [
    '        <div>',
    `          <label htmlFor="${f.id}">`,
    `            ${f.label}${fkStar(f)}`,
    '          </label>',
    '          <Field',
    asAttr + `            id="${f.id}"`,
    `            name="${f.id}"`,
    typeAttr +
      ariaReq +
      `            aria-invalid={!!(errors.${f.id} && touched.${f.id})}`,
    fkDescribedBy(f),
    '          />',
    fkError(f),
    '        </div>',
  ].join('\n')
}

const fkInitial = (fields: Field[]) =>
  fields
    .map((f) => `${f.id}: ${f.type === 'checkbox' ? 'false' : "''"}`)
    .join(', ')

const formikCode = (s: ScenarioSpec) =>
  [
    "import { Formik, Form, Field, ErrorMessage } from 'formik'",
    yupImport(s.fields),
    '',
    schemaBlock(s.fields),
    '',
    `export const ${s.component} = ({ onSubmit }) => (`,
    '  <Formik',
    `    initialValues={{ ${fkInitial(s.fields)} }}`,
    '    validationSchema={schema}',
    '    onSubmit={onSubmit}',
    '  >',
    '    {({ errors, touched }) => (',
    '      <Form noValidate>',
    s.fields.map(fkField).join('\n\n'),
    '',
    '        <button type="submit">Submit</button>',
    '      </Form>',
    '    )}',
    '  </Formik>',
    ')',
  ].join('\n')

// ---------------------------------------------------------------------------

export type Scenario = {
  id: string
  name: string
  blurb: string
  code: Record<LibraryId, string>
}

export const scenarios: Scenario[] = scenarioSpecs.map((s) => ({
  id: s.id,
  name: s.name,
  blurb: s.blurb,
  code: {
    arform: arformCode(s),
    rhf: rhfCode(s),
    tanstack: tanstackCode(s),
    formik: formikCode(s),
  },
}))

export const lineCount = (code: string) => code.split('\n').length
