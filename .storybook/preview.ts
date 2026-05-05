/** @type { import('@storybook/react').Preview } */

import '../src/testing.scss'
import '../src/styles.scss'

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
