import { Spinner } from 'eri'
import * as React from 'react'
import Router from './Router'
import { useAppState } from './AppStateContainer'

export default function Main() {
  const [{ cities, userLoading }] = useAppState()
  return <main>{userLoading || !cities ? <Spinner /> : <Router />}</main>
}
