import Auth from '@aws-amplify/auth'
import { Link } from '@reach/router'
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync'
import { Header, MenuButton } from 'eri'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import awsconfig from '../aws-exports'
import Router from './Router'
import Menu from './Menu'

Auth.configure(awsconfig)

const client = new AWSAppSyncClient({
  auth: {
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    async jwtToken() {
      try {
        const session = await Auth.currentSession()
        return session.getIdToken().getJwtToken()
      } catch (e) {
        console.error('error getting session: ', e)
        return ''
      }
    },
  },
  region: awsconfig.aws_appsync_region,
  url: awsconfig.aws_appsync_graphqlEndpoint,
})

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const handleMenuClose = () => setIsMenuOpen(false)
  const handleMenuOpen = () => setIsMenuOpen(true)

  return (
    <ApolloProvider client={client}>
      <Header>
        <h1>
          <Link to="/">Freelance Revolution</Link>
        </h1>
        <MenuButton onClick={handleMenuOpen} />
      </Header>
      <Menu handleMenuClose={handleMenuClose} open={isMenuOpen} />
      <main>
        <Router />
      </main>
    </ApolloProvider>
  )
}
