import { Button, TextField } from 'eri'
import React from 'react'
import { Formik, FormikProps, Form, Field, FieldProps } from 'formik'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { createJob } from '../graphql/mutations'
import { CreateJobMutationVariables, CreateJobMutation } from '../API'

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

export default function CreateJob() {
  return (
    <>
      <h2>Create job</h2>
      <Mutation<CreateJobMutation, CreateJobMutationVariables>
        mutation={gql(createJob)}
      >
        {create => (
          <Formik
            initialValues={initialValues}
            validate={values => {
              let errors: any = {}
              for (const [fieldName, value] of Object.entries(values))
                if (!value) errors[fieldName] = 'Required'
              return errors
            }}
            onSubmit={async (values, { setSubmitting }) => {
              await create({ variables: { input: values } })
              setSubmitting(false)
            }}
          >
            {({ isSubmitting }: FormikProps<IFormValues>) => (
              <Form noValidate>
                <Field name="title">
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
                <Field name="type">
                  {({ field, form }: FieldProps<IFormValues>) => (
                    <TextField
                      {...field}
                      error={
                        form.submitCount &&
                        form.touched.type &&
                        form.errors.type
                      }
                      label="Type"
                    />
                  )}
                </Field>
                <Field name="location">
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
                <Field name="description">
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
                <Button type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </Mutation>
    </>
  )
}
