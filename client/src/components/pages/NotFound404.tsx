import { Redirect, RouteComponentProps } from '@reach/router'
import * as React from 'react'

export default function NotFound404(_: RouteComponentProps) {
  return <Redirect to="/" />
}
