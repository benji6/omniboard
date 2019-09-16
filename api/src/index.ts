import {
  ApolloServer,
  AuthenticationError,
  ForbiddenError,
  gql,
} from 'apollo-server'
import { postRepositoryPromise } from './repositories'
import Post from './entities/Post'
import { validateToken } from './cognito'

const typeDefs = gql`
  input CreatePostInput {
    body: String!
    location: String!
    title: String!
    tags: [String]!
    userId: String!
  }

  type Post {
    body: String!
    id: ID!
    location: String!
    title: String!
    tags: [String]!
    userId: String!
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post
  }

  type Query {
    getPost(id: ID!): Post
    posts: [Post]
  }
`

interface IContext {
  user?: { id: string }
}

const resolvers = {
  Mutation: {
    createPost: async (
      _: unknown,
      {
        input: { body, location, tags, title, userId },
      }: {
        input: {
          body: string
          location: string
          tags: string[]
          title: string
          userId: string
        }
      },
      context: IContext,
    ) => {
      if (!context.user) throw new AuthenticationError('Must sign in')
      if (context.user.id !== userId)
        throw new ForbiddenError(
          `Authenticated user id ${context.user.id} does not match post user id ${userId}`,
        )
      const post = new Post()
      post.body = body
      post.location = location
      post.tags = tags
      post.title = title
      post.userId = userId
      const postRepository = await postRepositoryPromise
      return postRepository.save(post)
    },
  },
  Query: {
    getPost: async (_: undefined, { id }: { id: string }) => {
      const postRepository = await postRepositoryPromise
      return postRepository.findOne(id)
    },
    posts: async (_: undefined, __: undefined, context: IContext) => {
      const postRepository = await postRepositoryPromise
      return postRepository.find()
    },
  },
}

const server = new ApolloServer({
  context: async ({ req }): Promise<IContext> => {
    try {
      const user = await validateToken(
        (req.headers.authorization || '').slice(7),
      )
      return { user: { id: user.sub } }
    } catch (e) {
      return {}
    }
  },
  resolvers,
  typeDefs,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
