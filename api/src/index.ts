import {
  ApolloServer,
  AuthenticationError,
  ForbiddenError,
  UserInputError,
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
    ): Promise<IPost> => {
      if (!context.user) throw new AuthenticationError('Must sign in')
      if (context.user.id !== input.userId)
        throw new ForbiddenError(
          `Authenticated user id ${context.user.id} does not match post user id ${input.userId}`,
        )
      return postRepository.create(input)
    },
    deletePost: async (
      _: unknown,
      {
        id,
      }: {
        id: number
      },
      context: IContext,
    ): Promise<IPost> => {
      if (!context.user) throw new AuthenticationError('Must sign in')
      const post = await postRepository.get(id)
      if (!post) throw new UserInputError('Post does not exist')
      if (context.user.id !== post.userId)
        throw new ForbiddenError(
          `Authenticated user id ${context.user.id} does not match post user id ${post.userId}`,
        )
      return postRepository.delete(id)
    },
    updatePost: async (
      _: unknown,
      {
        input,
      }: {
        input: IPost
      },
      context: IContext,
    ): Promise<IPost> => {
      if (!context.user) throw new AuthenticationError('Must sign in')
      if (context.user.id !== input.userId)
        throw new ForbiddenError(
          `Authenticated user id ${context.user.id} does not match post user id ${input.userId}`,
        )
      return postRepository.update(input)
    },
  },
  Query: {
    getPost: async (
      _: undefined,
      { id }: { id: number },
    ): Promise<IPost | undefined> => postRepository.get(id),
    getPostsByUserId: async (
      _: undefined,
      { userId }: { userId: string },
    ): Promise<IPost[]> => postRepository.getByUserId(userId),
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
