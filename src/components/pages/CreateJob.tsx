import { useMutation } from '@apollo/react-hooks'
import { RouteComponentProps } from '@reach/router'
import { Button, TextField, ButtonGroup, PaperGroup, Paper } from 'eri'
import { Formik, FormikProps, Form, Field, FieldProps } from 'formik'
import gql from 'graphql-tag'
import React from 'react'
import { createJob } from '../../graphql/mutations'
import { requiredValidator } from '../../validators'
import { networkErrorMessage } from '../../constants'

interface IFormValues {
  description: string
  location: string
  title: string
  type: string
}

const initialValues = {
  description: '',
  location: '',
  title: '',
  type: '',
}

export default function CreateJob(_: RouteComponentProps) {
  const [submitError, setSubmitError] = React.useState<string | undefined>()
  const [create] = useMutation(gql(createJob))

  return (
    <PaperGroup>
      <Paper>
        <h2>Create job ad</h2>(
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await create({ variables: { input: values } })
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
              <Field name="type" validate={requiredValidator}>
                {({ field, form }: FieldProps<IFormValues>) => (
                  <TextField
                    {...field}
                    error={
                      form.submitCount && form.touched.type && form.errors.type
                    }
                    label="Type"
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
              <Field name="description" validate={requiredValidator}>
                {({ field, form }: FieldProps<IFormValues>) => (
                  <TextField
                    {...field}
                    error={
                      form.submitCount &&
                      form.touched.description &&
                      form.errors.description
                    }
                    label="Description"
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
