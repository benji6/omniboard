import { Link, NavigateFn, RouteComponentProps } from '@reach/router'
import { CognitoUserAttribute } from 'amazon-cognito-identity-js'
import { Button, TextField, ButtonGroup, PaperGroup, Paper } from 'eri'
import * as React from 'react'
import { Formik, FormikProps, Form, Field, FieldProps } from 'formik'
import {
  emailValidator,
  passwordValidator,
  composeValidators,
  requiredValidator,
} from '../../validators'
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

interface IFormValues {
  email: string
  password: string
}

const initialValues = {
  email: '',
  password: '',
}

export default function SignUp({ navigate }: RouteComponentProps) {
  useRedirectAuthed()
  const [submitError, setSubmitError] = React.useState<string | undefined>()

  return (
    <PaperGroup>
      <Paper>
        <h2>Sign up</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={async ({ email, password }, { setSubmitting }) => {
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
                  setSubmitError(
                    'Username already exists, try signing in instead',
                  )
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
                    autoComplete="new-password"
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
                <Button disabled={isSubmitting}>Sign up</Button>
              </ButtonGroup>
              <p e-util="center">
                <small>
                  Already have an account? <Link to="/sign-in">Sign in</Link>!
                </small>
              </p>
            </Form>
          )}
        </Formik>
      </Paper>
    </PaperGroup>
  )
}
