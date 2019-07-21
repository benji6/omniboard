import Auth from '@aws-amplify/auth'
import { RouteComponentProps, Link } from '@reach/router'
import { Button, TextField, ButtonGroup, PaperGroup, Paper } from 'eri'
import { Formik, FormikProps, Form, Field, FieldProps } from 'formik'
import React from 'react'
import {
  emailValidator,
  passwordValidator,
  composeValidators,
  requiredValidator,
} from '../../validators'
import { networkErrorMessage } from '../../constants'

interface IFormValues {
  email: string
  password: string
}

const initialValues = {
  email: '',
  password: '',
}

export default function SignIn(_: RouteComponentProps) {
  const [submitError, setSubmitError] = React.useState<string | undefined>()

  return (
    <PaperGroup>
      <Paper>
        <h2>Sign in</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={async ({ email, password }, { setSubmitting }) => {
            try {
              const user = await Auth.signIn(email, password)
              console.log({ user })
            } catch (e) {
              switch (e.code) {
                case 'NetworkError':
                  setSubmitError(networkErrorMessage)
                  break
                case 'UserNotConfirmedException':
                  setSubmitError(
                    'Please check your email to verify your email address before continuing',
                  )
                  break
                case 'NotAuthorizedException':
                case 'UserNotFoundException':
                  setSubmitError('Incorrect email/password')
                  break
                default:
                  setSubmitError(
                    'Something has gone wrong, please check the data you have entered and try again',
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
