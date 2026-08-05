import type { TestRunnerConfig } from '@storybook/test-runner'
import { injectAxe, checkA11y } from 'axe-playwright'

// Runs axe accessibility checks against every story.
// See https://storybook.js.org/docs/writing-tests/accessibility-testing
const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page)
  },
  async postVisit(page) {
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
    })
  },
}

export default config
