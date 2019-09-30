import * as React from 'react'
import useLoadInitialUserInfo from './useLoadInitialUserInfo'

interface ISetUserLoading {
  payload: false
  type: 'setUserLoading'
}

interface ISetUser {
  payload?: IUser
  type: 'setUser'
}

export type IAction = ISetUserLoading | ISetUser

export interface IUser {
  email: string
  id: string
}

interface IState {
  userLoading: boolean
  user?: IUser
}

const appStateReducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case 'setUserLoading':
      return { ...state, userLoading: action.payload }
    case 'setUser':
      return { ...state, user: action.payload }
  }
}

const initialState = { userLoading: true, user: undefined }

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
