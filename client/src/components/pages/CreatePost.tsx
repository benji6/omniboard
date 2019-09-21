import { useMutation } from '@apollo/react-hooks'
import { RouteComponentProps, NavigateFn } from '@reach/router'
import {
  Button,
  TextField,
  ButtonGroup,
  PaperGroup,
  Paper,
  requiredValidator,
} from 'eri'
import { Formik, FormikProps, Form, Field, FieldProps } from 'formik'
import gql from 'graphql-tag'
import * as React from 'react'
import { networkErrorMessage } from '../../constants'
import useRedirectUnAuthed from '../../hooks/useRedirectUnAuthed'
import { useAppState, IUser } from '../AppStateContainer'

export const CREATE_POST = gql(`mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    body
    location
    title
    userId
  }
}
`)

interface IFormValues {
  body: string
  location: string
  title: string
}

const initialValues = {
  body: '',
  location: '',
  title: '',
}

interface IMutationVariables {
  input: {
    body: string
    location: string
    title: string
    userId: string
  }
}

export default function CreatePost({ navigate }: RouteComponentProps) {
  useRedirectUnAuthed()
  const [submitError, setSubmitError] = React.useState<React.ReactNode>()
  const [create] = useMutation<unknown, IMutationVariables>(CREATE_POST)
  const [{ user }] = useAppState()

  return (
    <PaperGroup>
      <Paper>
        <h2>Create post</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await create({
                variables: {
                  input: {
                    ...values,
                    userId: (user as IUser).id,
                  },
                },
              })
              ;(navigate as NavigateFn)('/my-posts')
            } catch {
              setSubmitting(false)
              setSubmitError(networkErrorMessage)
            }
          }}
        >
          {({ isSubmitting }: FormikProps<IFormValues>) => (
            <Form noValidate>
              <Field name="title" validate={requiredValidator}>
                {({ field, form }: FieldProps<IFormValues>) => (
                  <TextField
                    {...field}
                    error={
                      form.submitCount &&
                      form.touched.title &&
                      form.errors.title
                    }
                    label="Title"
                  />
                )}
              </Field>
              <Field name="location" validate={requiredValidator}>
                {({ field, form }: FieldProps<IFormValues>) => (
                  <TextField
                    {...field}
                    error={
                      form.submitCount &&
                      form.touched.location &&
                      form.errors.location
                    }
                    label="Location"
                  />
                )}
              </Field>
              <Field name="body" validate={requiredValidator}>
                {({ field, form }: FieldProps<IFormValues>) => (
                  <TextField
                    {...field}
                    error={
                      form.submitCount && form.touched.body && form.errors.body
                    }
                    label="Body"
                  />
                )}
              </Field>
              {submitError && (
                <p e-util="center">
                  <small e-util="negative">{submitError}</small>
                </p>
              )}
              <ButtonGroup>
                <Button disabled={isSubmitting}>Submit</Button>
              </ButtonGroup>
            </Form>
          )}
        </Formik>
      </Paper>
    </PaperGroup>
  )
}
