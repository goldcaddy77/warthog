module.exports = [{
      plugin: require('/Users/caddy/code/goldcaddy77/warthog/docs/node_modules/gatsby-remark-autolink-headers/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/caddy/code/goldcaddy77/warthog/docs/node_modules/gatsby-plugin-google-analytics/gatsby-browser.js'),
      options: {"plugins":[],"trackingId":"UA-74643563-13"},
    },{
      plugin: require('/Users/caddy/code/goldcaddy77/warthog/docs/node_modules/gatsby-plugin-mdx/gatsby-browser.js'),
      options: {"plugins":[],"gatsbyRemarkPlugins":[{"resolve":"gatsby-remark-typescript","options":{"wrapperComponent":"MultiCodeBlock"}},"gatsby-remark-autolink-headers",{"resolve":"gatsby-remark-copy-linked-files","options":{"ignoreFileExtensions":[]}},{"resolve":"gatsby-remark-prismjs","options":{"showLineNumbers":true}},{"resolve":"gatsby-remark-check-links","options":{}}]},
    }]
