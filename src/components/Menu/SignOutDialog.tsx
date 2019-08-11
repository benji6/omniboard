import Auth from '@aws-amplify/auth'
import { navigate } from '@reach/router'
import { Dialog, ButtonGroup, Button } from 'eri'
import * as React from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { useAppState } from '../AppStateContainer'

interface IProps {
  onClose(): void
  open: boolean
}

export default withApollo<IProps>(function SignOutDialog({
  client,
  onClose,
  open,
}: WithApolloClient<IProps>) {
  const [isLoading, setIsLoading] = React.useState(false)
  const dispatch = useAppState()[1]

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await Auth.signOut()
    } finally {
      client.resetStore()
      onClose()
      setIsLoading(false)
      dispatch({ type: 'setUserEmail' })
      navigate('/')
    }
  }

  return (
    <Dialog
      disableClose={isLoading}
      onClose={onClose}
      open={open}
      title="Sign out?"
    >
      <ButtonGroup>
        <Button danger disabled={isLoading} onClick={handleSignOut}>
          Sign out
        </Button>
        <Button disabled={isLoading} onClick={onClose} variant="secondary">
          Cancel
        </Button>
      </ButtonGroup>
    </Dialog>
  )
})
