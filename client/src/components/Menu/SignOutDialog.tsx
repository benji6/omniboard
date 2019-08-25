import { useApolloClient } from '@apollo/react-hooks'
import { navigate } from '@reach/router'
import { Dialog, ButtonGroup, Button } from 'eri'
import * as React from 'react'
import { useAppState } from '../AppStateContainer'

interface IProps {
  onClose(): void
  open: boolean
}

export default function SignOutDialog({ onClose, open }: IProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const dispatch = useAppState()[1]
  const client = useApolloClient()

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      // TODO - sign out
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
}
