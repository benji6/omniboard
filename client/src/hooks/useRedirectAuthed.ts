import { navigate } from '@reach/router'
import * as React from 'react'
import { useAppState } from '../components/AppStateContainer'

export default function useRedirectAuthed() {
  const [
    {
      user: { email: userEmail },
    },
  ] = useAppState()
  React.useEffect(() => {
    if (userEmail) navigate('/')
  }, [userEmail])
}
