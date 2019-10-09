import { Link, RouteComponentProps } from '@reach/router'
import * as React from 'react'
import { VerifyPage } from 'eri'
import useRedirectAuthed from '../../hooks/useRedirectAuthed'

export default function Verify(_: RouteComponentProps) {
  useRedirectAuthed()
  return (
    <VerifyPage
      appName="Omniboard"
      resendVerificationLink={
        <Link to="/resend-verification">resend the verification email</Link>
      }
      signInLink={<Link to="/sign-in">sign in</Link>}
    />
  )
}
