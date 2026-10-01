import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  ARForm,
  Checkbox,
  FileUpload,
  TagInput,
  Text,
  TextArea,
} from '../index'

const meta: Meta<typeof ARForm> = {
  component: ARForm,
  title: 'Examples/Consumer theme',
  args: { onSubmit: fn() },
}

export default meta
type Story = StoryObj<typeof ARForm>

// Consumer-owned CSS, mounted only with this example and scoped to its wrapper.
// The library and the unstyled stories do not import it.
const consumerStyles = `
  .consumer-example {
    color: #172033;
    background: #fff;
    padding: 1.5rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.75rem;
  }
  .consumer-example h1 { margin: 0 0 0.5rem; font-size: 1.5rem; }
  .consumer-example p { margin: 0 0 1.5rem; line-height: 1.5; }
  .consumer-example .arform { display: grid; gap: 1.25rem; }
  .consumer-example .arform__field { min-width: 0; }
  .consumer-example .arform__label {
    display: flex; flex-direction: column; gap: 0.5rem; font-weight: 600;
  }
  .consumer-example .arform__label[data-arform-row] {
    flex-direction: row; align-items: center;
  }
  .consumer-example .arform__input:not([type='checkbox']):not([type='hidden']),
  .consumer-example .arform__textarea {
    box-sizing: border-box; width: 100%; padding: 0.625rem 0.75rem;
    border: 1px solid #64748b; border-radius: 0.375rem;
    background: #fff; color: #172033; font: inherit;
  }
  .consumer-example .arform__checkbox { accent-color: #3730a3; }
  .consumer-example .arform__textarea { min-height: 6rem; resize: vertical; }
  .consumer-example .arform__prefix { display: flex; align-items: center; gap: 0.5rem; }
  .consumer-example .arform__prefix-input { flex: 1; min-width: 0; }
  .consumer-example .arform__tag-input,
  .consumer-example .arform__upload-wrapper { display: grid; gap: 0.5rem; }
  .consumer-example .arform__tag-list,
  .consumer-example .arform__tag-suggestions { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .consumer-example .arform__tag-suggestions:empty { display: none; }
  .consumer-example .arform__tag {
    padding: 0.375rem 0.625rem; border: 1px solid #3730a3;
    border-radius: 1rem; background: #eef2ff; color: #312e81;
    font: inherit; cursor: pointer;
  }
  .consumer-example .arform__tag[data-arform-suggestion] { border-style: dashed; }
  .consumer-example .arform__upload-icon { width: 1.5rem; height: 1.5rem; color: #475569; }
  .consumer-example .arform__upload-preview { max-width: 100%; max-height: 8rem; }
  .consumer-example .arform__upload::file-selector-button {
    margin-right: 0.75rem; padding: 0.25rem 0.5rem;
    border: 1px solid #64748b; border-radius: 0.25rem;
    background: #f1f5f9; color: #172033;
  }
  .consumer-example .arform__error { color: #991b1b; }
  .consumer-example .consumer-submit {
    justify-self: start; padding: 0.625rem 1rem; border: 0;
    border-radius: 0.375rem; background: #3730a3; color: #fff;
    font: inherit; cursor: pointer;
  }
  .consumer-example :focus-visible { outline: 2px solid #3730a3; outline-offset: 3px; }
`

export const StyledExample: Story = {
  render: ({ onSubmit }) => (
    <section className="consumer-example" aria-labelledby="consumer-title">
      <style>{consumerStyles}</style>
      <h1 id="consumer-title">Your styles, native controls</h1>
      <p>
        This example supplies its own CSS. The ARForm stories show the same
        components without a theme.
      </p>
      <ARForm onSubmit={onSubmit}>
        <Text id="name" label="Name" autoComplete="name" />
        <Text id="username" label="Username" prefix="@" />
        <TagInput
          id="topics"
          label="Topics"
          suggestions={['Design', 'React']}
        />
        <TextArea id="comments" label="Comments" />
        <FileUpload id="attachment" label="Attachment" fileType="binary" />
        <Checkbox id="updates" label="Email me project updates" />
        <button className="consumer-submit" type="submit">
          Save preferences
        </button>
      </ARForm>
    </section>
  ),
}
