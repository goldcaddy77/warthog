// https://www.docz.site/docs/project-configuration
// Examples: https://github.com/doczjs/docz/tree/master/examples
export default {
  base: '/src',
  ignore: ['README.md'],
  themeConfig: {
    // TODO: change this to "dark" once I have an appropriate icon
    // initialColorMode: 'light',
    mainContainer: {
      fullscreen: false,
      align: 'center'
    },
    menu: {
      search: false,
      headings: {
        rightSide: true,
        scrollspy: true,
        depth: 3
      }
    }
  },
  menu: [
    {
      name: 'Introduction',
      menu: ['Introduction to Warthog', 'Installation and Setup']
    },
    {
      name: 'Constructs',
      menu: ['Models', 'Resolvers', 'Services', 'Generated Folder', 'Server', 'Config']
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
    {
      name: 'Decorators',
      menu: [
        'Overview',
        'BooleanField',
        'CustomField',
        'DateField',
        'EmailField',
        'EnumField',
        'Field',
        'FloatField',
        'ForiegnKeyField',
        'IdField',
        'InterfaceType',
        'IntField',
        'JSONField',
        'StringField',
        'ManyToMany',
        'ManyToManyJoin',
        'ManyToOne',
        'OneToMany',
        'Model'
      ]
    },
    {
      name: 'CLI',
      menu: [
        'CLI Overview',
        'codegen',
        'db:create',
        'db:drop',
        'generate',
        'db:migrate',
        'db:migrate:create'
      ]
    },
    {
      name: 'Upgrading',
      menu: ['Upgrading to 2.0']
    }
  ],
  title: 'Warthog',
  description: ''
};
