import Auth from '@aws-amplify/auth'
import * as React from 'react'
import { appStateReducer } from './AppStateContainer'

export default function useLoadInitialUserInfo(
  dispatch: React.Dispatch<React.ReducerAction<typeof appStateReducer>>,
) {
  React.useEffect(() => {
    let aborted = false
    ;(async function() {
      try {
        const {
          attributes: { email: newEmail },
        } = await Auth.currentAuthenticatedUser()
        if (aborted) return
        dispatch({ type: 'setUserEmail', payload: newEmail })
      } finally {
        dispatch({ type: 'setLoading', payload: false })
      }
    })()
    return () => {
      aborted = true
    }
  }, [dispatch])
}
