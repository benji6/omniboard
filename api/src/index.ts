import { ApolloServer } from 'apollo-server'
import { validateToken } from './cognito'
import typeDefs from './typeDefs'
import resolvers from './resolvers'

interface IContext {
  user?: { id: string }
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
