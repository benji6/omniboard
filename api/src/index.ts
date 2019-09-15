import { ApolloServer, gql } from 'apollo-server'
import { postRepositoryPromise } from './repositories'
import Post from './entities/Post'

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
    createPost: async (
      _: unknown,
      {
        input: { body, location, tags, title },
      }: {
        input: {
          body: string
          location: string
          tags: string[]
          title: string
        }
      },
    ) => {
      const post = new Post()
      post.body = body
      post.location = location
      post.tags = tags
      post.title = title
      const postRepository = await postRepositoryPromise
      return postRepository.save(post)
    },
  },
  Query: {
    getPost: async (_: unknown, { id }: { id: string }) => {
      const postRepository = await postRepositoryPromise
      return postRepository.findOne(id)
    },
    posts: async () => {
      const postRepository = await postRepositoryPromise
      return postRepository.find()
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
