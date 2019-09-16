import { useApolloClient } from '@apollo/react-hooks'
import { navigate } from '@reach/router'
import { Dialog, ButtonGroup, Button } from 'eri'
import * as React from 'react'
import { useAppState } from '../AppStateContainer'
import { userPool } from '../../cognito'

interface IProps {
  onClose(): void
  open: boolean
}

export default function SignOutDialog({ onClose, open }: IProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const dispatch = useAppState()[1]
  const client = useApolloClient()

  const handleSignOut = () => {
    setIsLoading(true)
    const currentUser = userPool.getCurrentUser()
    if (currentUser) currentUser.signOut()
    client.resetStore()
    onClose()
    dispatch({ type: 'setUser' })
    setIsLoading(false)
    navigate('/')
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
}
