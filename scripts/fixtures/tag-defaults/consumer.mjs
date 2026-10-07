/* global document, window */
import React from 'react'
import { createRoot } from 'react-dom/client'
import { useForm, FormProvider } from 'react-hook-form'
import { TagInput } from 'accessible-react-form'
const h = React.createElement

const options = JSON.parse(document.body.dataset.options)
function App() {
  const methods = useForm({
    ...(options.externalDefault === undefined
      ? {}
      : { defaultValues: { topics: options.externalDefault } }),
  })
  window.tagForm = methods
  return h(
    FormProvider,
    methods,
    h(TagInput, {
      id: 'topics',
      label: 'Topics',
      required: true,
      onlySuggestions: options.onlySuggestions,
      suggestions: ['React', 'TypeScript'],
      defaultValue: options.componentDefault,
      ...(options.explicitMethods ? { formProps: methods } : {}),
    }),
    h('button', { onClick: () => methods.reset({ topics: '' }) }, 'Reset empty')
  )
}
createRoot(document.getElementById('root')).render(h(App))
window.submitTags = async () => {
  let result
  await window.tagForm.handleSubmit(
    (values) => {
      result = { values }
    },
    (errors) => {
      result = { error: errors.topics?.type }
    }
  )()
  return result
}
