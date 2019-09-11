import { ApolloProvider } from '@apollo/react-hooks'
import { Link } from '@reach/router'
import ApolloClient from 'apollo-boost'
import { Header, MenuButton } from 'eri'
import * as React from 'react'
import Main from './Main'
import Menu from './Menu'
import AppStateContainer from './AppStateContainer'
import { getIdToken } from '../cognito'

const client = new ApolloClient({
  request: async operation => {
    try {
      const idToken = await getIdToken()
      operation.setContext({
        headers: { Authorization: `Bearer ${idToken.getJwtToken()}` },
      })
    } catch {}
  },
  uri: 'http://localhost:4000', // TODO
})

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const handleMenuClose = () => setIsMenuOpen(false)
  const handleMenuOpen = () => setIsMenuOpen(true)

  return (
    <ApolloProvider client={client}>
      <AppStateContainer>
        <Header>
          <h1>
            <Link to="/">Omniboard</Link>
          </h1>
          <MenuButton onClick={handleMenuOpen} />
        </Header>
        <Menu handleMenuClose={handleMenuClose} open={isMenuOpen} />
        <Main />
      </AppStateContainer>
    </ApolloProvider>
  )
}
