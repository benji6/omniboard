import { Link, RouteComponentProps } from '@reach/router'
import * as React from 'react'
import { VerifyPage } from 'eri'
import useRedirectAuthed from '../../hooks/useRedirectAuthed'

export default function Verify(_: RouteComponentProps) {
  useRedirectAuthed()
  return (
    <VerifyPage
      resendVerificationLink={
        <Link to="/resend-verification">resend the verification email</Link>
      }
    />
  )
}
