import * as React from 'react'
import { appStateReducer } from './AppStateContainer'

export default function useLoadInitialUserInfo(
  dispatch: React.Dispatch<React.ReducerAction<typeof appStateReducer>>,
) {
  React.useEffect(() => {
    let aborted = false
    ;(async function() {
      try {
        // TODO - load user info
        const newEmail = 'todo@email.com'
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
