import * as React from 'react'
import useLoadInitialUserInfo from './useLoadInitialUserInfo'

interface IAction {
  payload?: any
  type: 'setUserEmail'
}

interface IState {
  user: {
    email?: string
  }
}

export const appStateReducer = (state: IState, { payload, type }: IAction) => {
  switch (type) {
    case 'setUserEmail':
      return { ...state, user: { email: payload } }
    default:
      throw new Error(`Unknown action type: ${type}`)
  }
}

const initialState = { user: { email: undefined } }

const AppStateContext = React.createContext<
  [IState, React.Dispatch<React.ReducerAction<typeof appStateReducer>>]
>([initialState, () => {}])

export const useAppState = () => React.useContext(AppStateContext)

export default function AppStateContainer(props: object) {
  const [state, dispatch] = React.useReducer(appStateReducer, initialState)
  useLoadInitialUserInfo(dispatch)
  return <AppStateContext.Provider {...props} value={[state, dispatch]} />
}
