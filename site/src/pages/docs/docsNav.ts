export type DocLink = {
  title: string
  path: string
}

export type DocSection = {
  title: string
  links: DocLink[]
}

export const docsNav: DocSection[] = [
  {
    title: 'Getting started',
    links: [
      { title: 'Introduction', path: '/docs' },
      { title: 'Quickstart', path: '/docs/quickstart' },
    ],
  },
  {
    title: 'Guides',
    links: [
      { title: 'Styling', path: '/docs/styling' },
      { title: 'Validation schemas', path: '/docs/validation' },
      { title: 'Accessibility', path: '/docs/accessibility' },
    ],
  },
  {
    title: 'Components',
    links: [
      { title: 'Overview', path: '/docs/components' },
      { title: 'ARForm', path: '/docs/components/arform' },
      { title: 'Text', path: '/docs/components/text' },
      { title: 'TextArea', path: '/docs/components/textarea' },
      { title: 'Select', path: '/docs/components/select' },
      { title: 'Checkbox', path: '/docs/components/checkbox' },
      { title: 'Date', path: '/docs/components/date' },
      { title: 'FileUpload', path: '/docs/components/fileupload' },
    ],
  },
]
