import { useMutation } from '@apollo/react-hooks'
import { RouteComponentProps } from '@reach/router'
import { Button, TextField, ButtonGroup, PaperGroup, Paper } from 'eri'
import { Formik, FormikProps, Form, Field, FieldProps } from 'formik'
import gql from 'graphql-tag'
import * as React from 'react'
import { requiredValidator } from '../../validators'
import { networkErrorMessage } from '../../constants'
import useRedirectUnAuthed from '../../hooks/useRedirectUnAuthed'

export const CREATE_POST = gql(`mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    body
    location
    tags
    title
  }
}
`)

interface IFormValues {
  body: string
  location: string
  tags: string
  title: string
}

const initialValues = {
  body: '',
  location: '',
  tags: '',
  title: '',
}

interface IMutationVariables {
  input: {
    body: string
    location: string
    tags: string[]
    title: string
  }
}

export default function CreatePost(_: RouteComponentProps) {
  useRedirectUnAuthed()
  const [submitError, setSubmitError] = React.useState<string | undefined>()
  const [create] = useMutation<unknown, IMutationVariables>(CREATE_POST)

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
                  input: { ...values, tags: values.tags.split(' ') },
                },
              })
            } catch {
              setSubmitError(networkErrorMessage)
            } finally {
              setSubmitting(false)
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
              <Field name="tags" validate={requiredValidator}>
                {({ field, form }: FieldProps<IFormValues>) => (
                  <TextField
                    {...field}
                    error={
                      form.submitCount && form.touched.tags && form.errors.tags
                    }
                    label="Tags"
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
