import * as React from 'react'
import { appStateReducer } from './AppStateContainer'
import { getIdToken } from '../cognito'

export default function useLoadInitialUserInfo(
  dispatch: React.Dispatch<React.ReducerAction<typeof appStateReducer>>,
) {
  React.useEffect(() => {
    let aborted = false
    ;(async function() {
      try {
        const {
          payload: { email },
        } = await getIdToken()
        if (aborted) return
        dispatch({ type: 'setUserEmail', payload: email })
      } catch {
      } finally {
        dispatch({ type: 'setLoading', payload: false })
      }
    })()
    return () => {
      aborted = true
    }
  }, [dispatch])
}
