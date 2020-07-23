const { mergeWith } = require('docz-utils')
const fs = require('fs-extra')

let custom = {}
const hasGatsbyConfig = fs.existsSync('./gatsby-config.custom.js')

if (hasGatsbyConfig) {
  try {
    custom = require('./gatsby-config.custom')
  } catch (err) {
    console.error(
      `Failed to load your gatsby-config.js file : `,
      JSON.stringify(err),
    )
  }
}

const config = {
  pathPrefix: '/',

  siteMetadata: {
    title: 'Warthog',
    description: '',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: { initialColorMode: 'dark' },
        src: './',
        gatsbyRoot: null,
        themesDir: 'src',
        mdxExtensions: ['.md', '.mdx'],
        docgenConfig: {},
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
              'Config',
            ],
          },
          {
            name: 'Techniques',
            menu: [
              'Authentication',
              'Authorization',
              'Validations',
              'Complex Use Cases',
              'Transactions',
              'Production',
            ],
          },
          'CLI',
          'Upgrading',
        ],
        mdPlugins: [],
        hastPlugins: [],
        ignore: [],
        typescript: false,
        ts: false,
        propsParser: true,
        'props-parser': true,
        debug: false,
        native: false,
        openBrowser: null,
        o: null,
        open: null,
        'open-browser': null,
        root: '/Users/salius/warthog/docs/.docz',
        base: '/',
        source: './',
        'gatsby-root': null,
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: '.docz/dist',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'Warthog',
        description: '',
        host: 'localhost',
        port: 3000,
        p: 3000,
        separator: '-',
        paths: {
          root: '/Users/salius/warthog/docs',
          templates:
            '/Users/salius/warthog/docs/node_modules/docz-core/dist/templates',
          docz: '/Users/salius/warthog/docs/.docz',
          cache: '/Users/salius/warthog/docs/.docz/.cache',
          app: '/Users/salius/warthog/docs/.docz/app',
          appPackageJson: '/Users/salius/warthog/docs/package.json',
          appTsConfig: '/Users/salius/warthog/docs/tsconfig.json',
          gatsbyConfig: '/Users/salius/warthog/docs/gatsby-config.js',
          gatsbyBrowser: '/Users/salius/warthog/docs/gatsby-browser.js',
          gatsbyNode: '/Users/salius/warthog/docs/gatsby-node.js',
          gatsbySSR: '/Users/salius/warthog/docs/gatsby-ssr.js',
          importsJs: '/Users/salius/warthog/docs/.docz/app/imports.js',
          rootJs: '/Users/salius/warthog/docs/.docz/app/root.jsx',
          indexJs: '/Users/salius/warthog/docs/.docz/app/index.jsx',
          indexHtml: '/Users/salius/warthog/docs/.docz/app/index.html',
          db: '/Users/salius/warthog/docs/.docz/app/db.json',
        },
      },
    },
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
