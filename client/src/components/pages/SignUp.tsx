import { Link, NavigateFn, RouteComponentProps } from '@reach/router'
import { CognitoUserAttribute } from 'amazon-cognito-identity-js'
import { SignUpPage } from 'eri'
import * as React from 'react'
import { networkErrorMessage } from '../../constants'
import { userPool } from '../../cognito'
import useRedirectAuthed from '../../hooks/useRedirectAuthed'

const signUp = ({
  attributeList,
  email,
  password,
}: {
  attributeList: CognitoUserAttribute[]
  email: string
  password: string
}) =>
  new Promise((resolve, reject) => {
    userPool.signUp(
      email,
      password,
      attributeList,
      null as any,
      (err: Error | void, result) => (err ? reject(err) : resolve(result)),
    )
  })

export default function SignUp({ navigate }: RouteComponentProps) {
  useRedirectAuthed()
  return (
    <SignUpPage
      onSubmit={async ({ email, password, setSubmitError }) => {
        const attributeList = [
          new CognitoUserAttribute({ Name: 'email', Value: email }),
        ]
        try {
          await signUp({ attributeList, email, password })
          ;(navigate as NavigateFn)('/verify')
        } catch (e) {
          switch (e.code) {
            case 'NetworkError':
              setSubmitError(networkErrorMessage)
              break
            case 'UsernameExistsException':
              setSubmitError('Username already exists, try signing in instead')
              break
            default:
              setSubmitError(
                'Something went wrong, check the data you have entered and try again',
              )
          }
        }
      }}
      signInLink={<Link to="/sign-in">Sign in</Link>}
    />
  )
}
