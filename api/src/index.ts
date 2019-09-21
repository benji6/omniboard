import {
  ApolloServer,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server'
import { validateToken } from './cognito'
import postRepository, { IPost } from './repositories/postRepository'
import typeDefs from './typeDefs'

interface IContext {
  user?: { id: string }
}

const resolvers = {
  Mutation: {
    createPost: async (
      _: unknown,
      {
        input,
      }: {
        input: Omit<IPost, 'id'>
      },
      context: IContext,
    ) => {
      if (!context.user) throw new AuthenticationError('Must sign in')
      if (context.user.id !== input.userId)
        throw new ForbiddenError(
          `Authenticated user id ${context.user.id} does not match post user id ${input.userId}`,
        )
      return postRepository.create(input)
    },
  },
  Query: {
    getPost: async (
      _: undefined,
      { id }: { id: number },
    ): Promise<IPost | undefined> => postRepository.getById(id),
    searchPosts: async (
      _: undefined,
      {
        input,
      }: { input: { body?: string; location?: string; title?: string } },
    ): Promise<IPost[]> => postRepository.search(input),
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
