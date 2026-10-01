import { createElement } from 'react'
import type { Preview } from '@storybook/react-vite'
import '../src/testing.scss'
import './story-examples.css'

const preview: Preview = {
  decorators: [
    (Story, context) =>
      context.parameters.tailwind
        ? createElement(
            'div',
            {
              'data-example-theme': 'light',
              className:
                context.parameters.exampleShell === false
                  ? 'tailwind-example'
                  : 'tailwind-example mx-auto my-6 box-border w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 font-sans text-slate-900 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100',
            },
            createElement(Story)
          )
        : createElement(Story),
  ],
  parameters: {
    layout: 'padded',
    docs: { codePanel: true },
    options: {
      storySort: { order: ['Components', 'Recipes', 'Examples', 'Unstyled'] },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
