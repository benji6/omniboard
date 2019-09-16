import * as React from 'react'
import useLoadInitialUserInfo from './useLoadInitialUserInfo'

interface IAction {
  payload?: any
  type: 'setLoading' | 'setUser'
}

export interface IUser {
  email: string
  id: string
}

interface IState {
  loading: boolean
  user?: IUser
}

export const appStateReducer = (state: IState, { payload, type }: IAction) => {
  switch (type) {
    case 'setLoading':
      return { ...state, loading: payload }
    case 'setUser':
      return { ...state, user: payload }
    default:
      throw Error(`Unknown action type: ${type}`)
  }
}

const initialState = { loading: true }

const AppStateContext = React.createContext<
  [IState, React.Dispatch<React.ReducerAction<typeof appStateReducer>>]
>([initialState, () => {}])

export const useAppState = () => React.useContext(AppStateContext)

export default function AppStateContainer(props: {
  children: React.ReactNode
}) {
  const [state, dispatch] = React.useReducer(appStateReducer, initialState)
  useLoadInitialUserInfo(dispatch)
  return <AppStateContext.Provider {...props} value={[state, dispatch]} />
}
