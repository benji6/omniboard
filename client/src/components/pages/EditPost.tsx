import { useQuery, useMutation } from '@apollo/react-hooks'
import { RouteComponentProps, NavigateFn } from '@reach/router'
import { Formik, FormikProps, Form, Field, FieldProps } from 'formik'
import * as React from 'react'
import {
  PaperGroup,
  Paper,
  Spinner,
  requiredValidator,
  TextField,
  ButtonGroup,
  Button,
} from 'eri'
import gql from 'graphql-tag'
import useRedirectUnAuthed from '../../hooks/useRedirectUnAuthed'
import { GET_POST, IGetPostQueryResult } from '../queries'
import { networkErrorMessage } from '../../constants'
import { IPost } from '../../types'
import { GET_POSTS_BY_USER_ID } from './MyPosts'

export const UPDATE_POST = gql(`
mutation UpdatePost($input: UpdatePostInput!) {
  updatePost(input: $input) {
    body
    id
    location
    title
    userId
  }
}
`)

interface IMutationVariables {
  input: {
    body: string
    id: string
    location: string
    title: string
    userId: string
  }
}

interface IMutationResult {
  updatePost: IPost & { __typename: 'Post' }
}

interface IFormValues {
  body: string
  location: string
  title: string
}

interface IProps extends RouteComponentProps {
  id: string
}

export default function EditPost(props: RouteComponentProps) {
  const user = useRedirectUnAuthed()
  const { id } = props as IProps
  const userId = user.id
  const [submitError, setSubmitError] = React.useState<React.ReactNode>()
  const { data, error, loading } = useQuery<IGetPostQueryResult>(GET_POST, {
    variables: { id },
  })
  const [updatePost] = useMutation<IMutationResult, IMutationVariables>(
    UPDATE_POST,
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
            getPostsByUserId: cachedData.getPostsByUserId.map(post =>
              post.id === id ? data.updatePost : post,
            ),
          },
        })
      },
    },
  )
  return (
    <PaperGroup>
      <Paper>
        <h2>Edit post</h2>
        {loading ? (
          <Spinner />
        ) : error || !data || !data.getPost ? (
          <p>Something went wrong, please try again</p>
        ) : (
          <Formik
            initialValues={{
              body: data.getPost.body,
              location: data.getPost.location,
              title: data.getPost.title,
            }}
            onSubmit={async ({ body, location, title }, { setSubmitting }) => {
              try {
                updatePost({
                  optimisticResponse: {
                    updatePost: {
                      __typename: 'Post',
                      body,
                      id: String(
                        Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
                      ),
                      location,
                      title,
                      userId,
                    },
                  },
                  variables: {
                    input: {
                      body,
                      id,
                      location,
                      title,
                      userId,
                    },
                  },
                })
                ;(props.navigate as NavigateFn)('/my-posts')
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
                        form.submitCount &&
                        form.touched.body &&
                        form.errors.body
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
                  <Button disabled={isSubmitting}>Save</Button>
                </ButtonGroup>
              </Form>
            )}
          </Formik>
        )}
      </Paper>
    </PaperGroup>
  )
}
