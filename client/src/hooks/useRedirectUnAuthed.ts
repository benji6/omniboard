import { navigate } from '@reach/router'
import * as React from 'react'
import { useAppState } from '../components/AppStateContainer'

export default function useRedirectUnAuthed() {
  const [
    {
      user: { email: userEmail },
    },
  ] = useAppState()
  React.useEffect(() => {
    if (!userEmail) navigate('/')
  }, [userEmail])
}
