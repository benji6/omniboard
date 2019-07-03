import React from 'react'
import { Formik, FormikProps, Form, Field, ErrorMessage } from 'formik'
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
              <Form>
                <Field type="text" name="title" />
                <ErrorMessage name="title" component="div" />
                <Field type="text" name="type" />
                <ErrorMessage name="type" component="div" />
                <Field type="text" name="location" />
                <ErrorMessage name="location" component="div" />
                <Field type="text" name="description" />
                <ErrorMessage name="description" component="div" />
                <button type="submit" disabled={isSubmitting}>
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        )}
      </Mutation>
    </>
  )
}
