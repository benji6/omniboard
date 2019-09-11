import { RouteComponentProps, Link, NavigateFn } from '@reach/router'
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserSession,
} from 'amazon-cognito-identity-js'
import { Button, TextField, ButtonGroup, PaperGroup, Paper } from 'eri'
import { Formik, FormikProps, Form, Field, FieldProps } from 'formik'
import * as React from 'react'
import {
  emailValidator,
  passwordValidator,
  composeValidators,
  requiredValidator,
} from '../../validators'
import { networkErrorMessage } from '../../constants'
import { useAppState } from '../AppStateContainer'
import { userPool } from '../../cognito'
import useRedirectAuthed from '../../hooks/useRedirectAuthed'

const authenticate = ({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<CognitoUserSession> => {
  const authenticationDetails = new AuthenticationDetails({
    Password: password,
    Username: email,
  })

  const cognitoUser = new CognitoUser({
    Pool: userPool,
    Username: email,
  })

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onFailure: reject,
      onSuccess: resolve,
    })
  })
}

interface IFormValues {
  email: string
  password: string
}

const initialValues = {
  email: '',
  password: '',
}

export default function SignIn({ navigate }: RouteComponentProps) {
  useRedirectAuthed()
  const [submitError, setSubmitError] = React.useState<React.ReactNode>()
  const dispatch = useAppState()[1]

  return (
    <PaperGroup>
      <Paper>
        <h2>Sign in</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={async ({ email, password }, { setSubmitting }) => {
            try {
              const result = await authenticate({ email, password })
              dispatch({
                payload: result.getIdToken().payload.email,
                type: 'setUserEmail',
              })
              ;(navigate as NavigateFn)('/')
            } catch (e) {
              switch (e.code) {
                case 'NetworkError':
                  setSubmitError(networkErrorMessage)
                  break
                case 'UserNotConfirmedException':
                  setSubmitError(
                    <>
                      Check your email to verify your email address or{' '}
                      <Link to="/resend-verification">
                        resend the verification email
                      </Link>
                    </>,
                  )
                  break
                case 'NotAuthorizedException':
                case 'UserNotFoundException':
                  setSubmitError('Incorrect email/password')
                  break
                default:
                  setSubmitError(
                    'Something went wrong, check the data you have entered and try again',
                  )
              }
            } finally {
              setSubmitting(false)
            }
          }}
        >
          {({ isSubmitting }: FormikProps<IFormValues>) => (
            <Form noValidate>
              <Field
                name="email"
                validate={composeValidators(requiredValidator, emailValidator)}
              >
                {({ field, form }: FieldProps<IFormValues>) => (
                  <TextField
                    {...field}
                    autoComplete="email"
                    error={
                      form.submitCount &&
                      form.touched.email &&
                      form.errors.email
                    }
                    label="Email"
                    type="email"
                  />
                )}
              </Field>
              <Field
                name="password"
                validate={composeValidators(
                  requiredValidator,
                  passwordValidator,
                )}
              >
                {({ field, form }: FieldProps<IFormValues>) => (
                  <TextField
                    {...field}
                    autoComplete="current-password"
                    error={
                      form.submitCount &&
                      form.touched.password &&
                      form.errors.password
                    }
                    label="Password"
                    type="password"
                  />
                )}
              </Field>
              {submitError && (
                <p e-util="center">
                  <small e-util="negative">{submitError}</small>
                </p>
              )}
              <ButtonGroup>
                <Button disabled={isSubmitting}>Sign in</Button>
              </ButtonGroup>
              <p e-util="center">
                <small>
                  Don't have an account? <Link to="/sign-up">Sign up</Link>!
                </small>
              </p>
            </Form>
          )}
        </Formik>
      </Paper>
    </PaperGroup>
  )
}
