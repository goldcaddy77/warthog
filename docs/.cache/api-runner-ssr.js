var plugins = [{
      plugin: require('/Users/caddy/code/goldcaddy77/warthog/docs/node_modules/gatsby-plugin-react-helmet/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/caddy/code/goldcaddy77/warthog/docs/node_modules/gatsby-remark-autolink-headers/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/caddy/code/goldcaddy77/warthog/docs/node_modules/gatsby-plugin-google-analytics/gatsby-ssr'),
      options: {"plugins":[],"trackingId":"UA-74643563-13"},
    },{
      plugin: require('/Users/caddy/code/goldcaddy77/warthog/docs/node_modules/gatsby-plugin-mdx/gatsby-ssr'),
      options: {"plugins":[],"gatsbyRemarkPlugins":[{"resolve":"gatsby-remark-typescript","options":{"wrapperComponent":"MultiCodeBlock"}},"gatsby-remark-autolink-headers",{"resolve":"gatsby-remark-copy-linked-files","options":{"ignoreFileExtensions":[]}},{"resolve":"gatsby-remark-prismjs","options":{"showLineNumbers":true}},{"resolve":"gatsby-remark-check-links","options":{}}]},
    },{
      plugin: require('/Users/caddy/code/goldcaddy77/warthog/docs/node_modules/gatsby-theme-apollo-docs/gatsby-ssr'),
      options: {"plugins":[],"root":"/Users/caddy/code/goldcaddy77/warthog/docs","subtitle":"HELLO FOOBAR","description":"How to use the Warthog GraphQL platform","githubRepo":"goldcaddy77/warthog","spectrumPath":"warthog","sidebarCategories":{"null":["index","intro/platform","intro/benefits"],"Tutorial":["tutorial/introduction","tutorial/schema","tutorial/data-source","tutorial/resolvers","tutorial/production","tutorial/client","tutorial/queries","tutorial/mutations","tutorial/local-state"],"Platform":["platform/schema-registry","platform/schema-validation","platform/client-awareness","platform/operation-registry","platform/editor-plugins","platform/performance","platform/integrations","platform/federation"],"Resources":["[Principled GraphQL](https://principledgraphql.com)","resources/graphql-glossary","resources/faq"],"References":["references/warthog-config","references/setup-analytics","references/warthog-engine","references/engine-proxy","references/engine-proxy-release-notes"]}},
    }]
// During bootstrap, we write requires at top of this file which looks like:
// var plugins = [
//   {
//     plugin: require("/path/to/plugin1/gatsby-ssr.js"),
//     options: { ... },
//   },
//   {
//     plugin: require("/path/to/plugin2/gatsby-ssr.js"),
//     options: { ... },
//   },
// ]

const apis = require(`./api-ssr-docs`)

// Run the specified API in any plugins that have implemented it
module.exports = (api, args, defaultReturn, argTransform) => {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  // Run each plugin in series.
  // eslint-disable-next-line no-undef
  let results = plugins.map(plugin => {
    if (!plugin.plugin[api]) {
      return undefined
    }
    const result = plugin.plugin[api](args, plugin.options)
    if (result && argTransform) {
      args = argTransform({ args, result })
    }
    return result
  })

  // Filter out undefined results.
  results = results.filter(result => typeof result !== `undefined`)

  if (results.length > 0) {
    return results
  } else {
    return [defaultReturn]
  }
}
