import { Spinner } from 'eri'
import * as React from 'react'
import Router from './Router'
import { useAppState } from './AppStateContainer'

export default function Main() {
  const [{ loading }] = useAppState()
  return <main>{loading ? <Spinner /> : <Router />}</main>
}
