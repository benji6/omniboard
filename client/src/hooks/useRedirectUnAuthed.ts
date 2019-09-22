import { navigate } from '@reach/router'
import * as React from 'react'
import { useAppState, IUser } from '../components/AppStateContainer'

export default function useRedirectUnAuthed() {
  const [{ user }] = useAppState()
  React.useEffect(() => {
    if (!user) navigate('/')
  }, [user])
  return user as IUser
}
