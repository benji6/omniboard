import { Button, TextField, ButtonGroup } from 'eri'
import React from 'react'
import { Formik, FormikProps, Form, Field, FieldProps } from 'formik'
import Auth from '@aws-amplify/auth'
import {
  emailValidator,
  passwordValidator,
  composeValidators,
  requiredValidator,
} from '../validators'
import { networkErrorMessage } from '../constants'

interface IFormValues {
  email: string
  password: string
}

const initialValues = {
  email: '',
  password: '',
}

export default function SignUp() {
  const [submitError, setSubmitError] = React.useState<string | undefined>()

  return (
    <>
      <h2>Sign up</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={async ({ email, password }, { setSubmitting }) => {
          try {
            await Auth.signUp({
              username: email,
              password,
            })
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
                    form.submitCount && form.touched.email && form.errors.email
                  }
                  label="Email"
                />
              )}
            </Field>
            <Field
              name="password"
              validate={composeValidators(requiredValidator, passwordValidator)}
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
          </Form>
        )}
      </Formik>
    </>
  )
}
