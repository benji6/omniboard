import * as React from 'react'
import useLoadInitialUserInfo from './useLoadInitialUserInfo'

interface IAction {
  payload?: any
  type: 'setLoading' | 'setUserEmail'
}

interface IState {
  loading: boolean
  user: {
    email?: string
  }
}

export const appStateReducer = (state: IState, { payload, type }: IAction) => {
  switch (type) {
    case 'setLoading':
      return { ...state, loading: payload }
    case 'setUserEmail':
      return { ...state, user: { email: payload } }
    default:
      throw Error(`Unknown action type: ${type}`)
  }
}

const initialState = { loading: true, user: { email: undefined } }

const AppStateContext = React.createContext<
  [IState, React.Dispatch<React.ReducerAction<typeof appStateReducer>>]
>([initialState, () => {}])

export const useAppState = () => React.useContext(AppStateContext)

export default function AppStateContainer(props: object) {
  const [state, dispatch] = React.useReducer(appStateReducer, initialState)
  useLoadInitialUserInfo(dispatch)
  return <AppStateContext.Provider {...props} value={[state, dispatch]} />
}
