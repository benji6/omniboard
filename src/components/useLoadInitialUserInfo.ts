import Auth from '@aws-amplify/auth'
import * as React from 'react'
import { appStateReducer } from './AppStateContainer'

export default function useLoadInitialUserInfo(
  dispatch: React.Dispatch<React.ReducerAction<typeof appStateReducer>>,
) {
  React.useEffect(() => {
    let aborted = false
    ;(async function() {
      const {
        attributes: { email: newEmail },
      } = await Auth.currentAuthenticatedUser()
      if (aborted) return
      dispatch({
        type: 'setUserEmail',
        payload: newEmail,
      })
    })()
    return () => {
      aborted = true
    }
  }, [dispatch])
}
