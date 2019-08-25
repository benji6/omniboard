const { ApolloServer, gql } = require('apollo-server')

const posts = [
  {
    body: 'fake body 0',
    id: 'fake-id-0',
    location: 'fake location 0',
    title: 'fake title 0',
    tags: ['foo'],
  },
  {
    body: 'fake body 1',
    id: 'fake-id-1',
    location: 'fake location 1',
    title: 'fake title 1',
    tags: ['bar'],
  },
  {
    body: 'fake body 2',
    id: 'fake-id-2',
    location: 'fake location 2',
    title: 'fake title 2',
    tags: ['foo', 'bar'],
  },
]

const typeDefs = gql`
  input CreatePostInput {
    body: String!
    location: String!
    title: String!
    tags: [String]!
  }

  type Post {
    body: String!
    id: ID!
    location: String!
    title: String!
    tags: [String]!
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post
  }

  type Query {
    getPost(id: ID!): Post
    posts: [Post]
  }
`

const resolvers = {
  Mutation: {
    createPost: (_, { input: { body, location, title, tags } }) => {
      const post = {
        id: Math.random()
          .toString(36)
          .slice(2),
        body,
        location,
        title,
        tags,
      }
      posts.push(post)
      return post
    },
  },
  Query: {
    getPost: (_, { id }) => posts.find(post => post.id === id),
    posts: () => posts,
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
