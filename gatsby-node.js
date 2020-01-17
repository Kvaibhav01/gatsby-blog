const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

//? A 'node' is an individual representation of files (see ___graphql playground)
exports.onCreateNode = ({ node, getNode, actions }) => {
  // This action adds a new field to our node
  const { createNodeField } = actions

  //? 'internal' is the data about that node
  // console.log(node.internal.type);
  if (node.internal.type === `MarkdownRemark`) {
    //? a 'slug' is the URL that the browser is able to access from an app in order to navigate
    //? the required page

    // Generate a new slug
    const slug = createFilePath({
      node,
      getNode,
      basePath: `pages`,
    })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  //? 'createPage' is an action which allows us to build the pages based on the properties we pass
  const { createPage } = actions
  return graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `).then(result => {
    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        // What path actually leads to this page i.e. the slug we created above
        path: node.fields.slug,
        component: path.resolve(`./src/templates/blog-post.js`),
        // Pass the actual slug value via 'context'
        context: {
          slug: node.fields.slug,
        },
      })
    })
  })
}
