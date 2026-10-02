import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@chromatic-com/storybook',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: (config) => {
    const aliases = config.resolve?.alias ?? []

    return {
      ...config,
      plugins: [...(config.plugins ?? []), tailwindcss()],
      resolve: {
        ...config.resolve,
        alias: [
          // Consumer examples exercise the package built by build-storybook.
          {
            find: /^accessible-react-form$/,
            replacement: fileURLToPath(
              new URL('../dist/index.es.js', import.meta.url)
            ),
          },
          ...(Array.isArray(aliases)
            ? aliases
            : Object.entries(aliases).map(([find, replacement]) => ({
                find,
                replacement,
              }))),
        ],
        dedupe: ['react', 'react-dom', 'react-hook-form'],
      },
    }
  },
}
export default config
