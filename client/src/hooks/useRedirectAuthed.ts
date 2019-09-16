import { navigate } from '@reach/router'
import * as React from 'react'
import { useAppState } from '../components/AppStateContainer'

export default function useRedirectAuthed() {
  const [{ user }] = useAppState()
  React.useEffect(() => {
    if (user) navigate('/')
  }, [user])
}
