const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---node-modules-gatsby-theme-apollo-docs-src-components-template-js": hot(preferDefault(require("/Users/caddy/code/goldcaddy77/warthog/docs/node_modules/gatsby-theme-apollo-docs/src/components/template.js"))),
  "component---cache-dev-404-page-js": hot(preferDefault(require("/Users/caddy/code/goldcaddy77/warthog/docs/.cache/dev-404-page.js")))
}

