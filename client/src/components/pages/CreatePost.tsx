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
import { IPost } from '../../types'
import { GET_POSTS_BY_USER_ID } from './MyPosts'

export const CREATE_POST = gql(`
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    body
    city {
      id
      name
    }
    id
    title
    userId
  }
}
`)

interface IMutationVariables {
  input: {
    body: string
    cityId: string
    title: string
    userId: string
  }
}

interface IMutationResult {
  createPost: IPost
}

interface IFormValues {
  body: string
  cityId: string
  title: string
}

const initialValues = {
  body: '',
  cityId: '',
  title: '',
}

export default function CreatePost({ navigate }: RouteComponentProps) {
  const user = useRedirectUnAuthed()
  const [submitError, setSubmitError] = React.useState<React.ReactNode>()
  const userId = user.id
  const [createPost] = useMutation<IMutationResult, IMutationVariables>(
    CREATE_POST,
    {
      update(proxy, { data }) {
        if (!data) return
        let cachedData
        try {
          cachedData = proxy.readQuery<{
            getPostsByUserId?: IPost[]
          }>({
            query: GET_POSTS_BY_USER_ID,
            variables: { userId },
          })
        } catch {
          return
        }
        if (!cachedData || !cachedData.getPostsByUserId) return
        proxy.writeQuery({
          query: GET_POSTS_BY_USER_ID,
          variables: { userId },
          data: {
            getPostsByUserId: [data.createPost, ...cachedData.getPostsByUserId],
          },
        })
      },
    },
  )

  return (
    <PaperGroup>
      <Paper>
        <h2>Create post</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={async ({ body, cityId, title }, { setSubmitting }) => {
            try {
              createPost({
                optimisticResponse: {
                  createPost: {
                    __typename: 'Post',
                    body,
                    createdAt: String(Date.now()),
                    id: String(
                      Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
                    ),
                    city: {
                      __typename: 'City',
                      id: cityId,
                      name: 'TODO', //TODO
                    },
                    title,
                    userId,
                  },
                },
                variables: {
                  input: {
                    body,
                    cityId,
                    title,
                    userId,
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
              <Field name="cityId" validate={requiredValidator}>
                {({ field, form }: FieldProps<IFormValues>) => (
                  <TextField
                    {...field}
                    error={
                      form.submitCount &&
                      form.touched.cityId &&
                      form.errors.cityId
                    }
                    label="City id"
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
                <Button disabled={isSubmitting}>Create</Button>
              </ButtonGroup>
            </Form>
          )}
        </Formik>
      </Paper>
    </PaperGroup>
  )
}
