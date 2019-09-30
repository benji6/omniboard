import * as React from 'react'
import { getIdToken } from '../../cognito'
import { IAction } from '.'

export default function useLoadInitialUserInfo(
  dispatch: React.Dispatch<IAction>,
) {
  React.useEffect(() => {
    let aborted = false
    ;(async function() {
      try {
        const {
          payload: { email, sub },
        } = await getIdToken()
        if (aborted) return
        dispatch({ type: 'setUser', payload: { email, id: sub } })
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
