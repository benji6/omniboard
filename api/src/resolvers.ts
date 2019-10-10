import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from 'apollo-server'
import postRepository, { IPost } from './repositories/postRepository'
import cityRepository from './repositories/cityRepository'

interface IContext {
  user?: { id: string }
}

const MAX_SEARCH_RESULTS = 100

export default {
  Post: {
    city: (post: IPost) => cityRepository.get(post.cityId),
  },
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
        id: string
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
    cities: cityRepository.getAll,
    getPost: async (
      _: undefined,
      { id }: { id: string },
    ): Promise<IPost | undefined> => postRepository.get(id),
    getPostsByUserId: async (
      _: undefined,
      { userId }: { userId: string },
    ): Promise<IPost[]> => postRepository.getByUserId(userId),
    searchPosts: async (
      _: undefined,
      {
        input,
      }: {
        input: {
          body?: string
          cityId?: string
          limit?: number
          offset?: number
          title?: string
        }
      },
    ): Promise<IPost[]> => {
      if (input.limit && input.limit > MAX_SEARCH_RESULTS)
        throw new UserInputError(
          `Maximum limit is ${MAX_SEARCH_RESULTS}, but received ${input.limit}`,
        )
      return postRepository.search(input)
    },
  },
}
