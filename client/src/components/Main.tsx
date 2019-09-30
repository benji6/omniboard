import { Spinner } from 'eri'
import * as React from 'react'
import Router from './Router'
import { useAppState } from './AppStateContainer'

export default function Main() {
  const [{ userLoading }] = useAppState()
  return <main>{userLoading ? <Spinner /> : <Router />}</main>
}
