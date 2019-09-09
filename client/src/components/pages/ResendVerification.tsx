import { Link, NavigateFn, RouteComponentProps } from '@reach/router'
import { CognitoUser } from 'amazon-cognito-identity-js'
import { Button, TextField, ButtonGroup, PaperGroup, Paper } from 'eri'
import * as React from 'react'
import { Formik, FormikProps, Form, Field, FieldProps } from 'formik'
import {
  emailValidator,
  composeValidators,
  requiredValidator,
} from '../../validators'
import { networkErrorMessage } from '../../constants'
import { userPool } from '../../cognito'

const resendConfirmation = ({ email }: { email: string }) =>
  new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Pool: userPool, Username: email })
    cognitoUser.resendConfirmationCode((err, result) =>
      err ? reject(err) : resolve(result),
    )
  })

interface IFormValues {
  email: string
}

const initialValues = {
  email: '',
}

export default function ResendVerification({ navigate }: RouteComponentProps) {
  const [submitError, setSubmitError] = React.useState<string | undefined>()

  return (
    <PaperGroup>
      <Paper>
        <h2>Resend verification email</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={async ({ email }, { setSubmitting }) => {
            try {
              await resendConfirmation({ email })
              ;(navigate as NavigateFn)('/verify')
            } catch (e) {
              switch (e.code) {
                case 'NetworkError':
                  setSubmitError(networkErrorMessage)
                  break
                case 'InvalidParameterException':
                  setSubmitError(
                    'Email address not recognised, try signing up instead',
                  )
                  break
                case 'UserNotFoundException':
                  setSubmitError(
                    'Email address has already been confirmed, please sign in',
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
              {submitError && (
                <p e-util="center">
                  <small e-util="negative">{submitError}</small>
                </p>
              )}
              <ButtonGroup>
                <Button disabled={isSubmitting}>Resend</Button>
              </ButtonGroup>
              <p e-util="center">
                <small>
                  Looking for the <Link to="/sign-in">Sign in</Link> or{' '}
                  <Link to="/sign-up">Sign up</Link> pages?
                </small>
              </p>
            </Form>
          )}
        </Formik>
      </Paper>
    </PaperGroup>
  )
}
