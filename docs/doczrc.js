// https://www.docz.site/docs/project-configuration
export default {
  themeConfig: {
    initialColorMode: 'dark'
  },
  menu: [
    'Intro',
    {
      name: 'Overview',
      menu: [
        'Getting Started',
        'Models',
        'Resolvers',
        'Services',
        'Generated Folder',
        'Server',
        'Config'
      ]
    },
    {
      name: 'Techniques',
      menu: [
        'Authentication',
        'Authorization',
        'Validations',
        'Complex Use Cases',
        'Transactions',
        'Production'
      ]
    },
    'CLI',
    'Upgrading'
  ],
  title: 'Warthog',
  description: ''
};
