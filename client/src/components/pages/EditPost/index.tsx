import { useQuery, useMutation } from '@apollo/react-hooks'
import { RouteComponentProps, NavigateFn, Redirect } from '@reach/router'
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
  Select,
  TextArea,
} from 'eri'
import gql from 'graphql-tag'
import { GET_POST, IGetPostQueryResult } from '../../queries'
import { networkErrorMessage } from '../../../constants'
import { IPost, ICity } from '../../../types'
import { GET_POSTS_BY_USER_ID } from '../MyPosts'
import DeletePostDialog from './DeletePostDialog'
import { useAppState } from '../../AppStateContainer'

export const UPDATE_POST = gql(`
mutation UpdatePost($input: UpdatePostInput!) {
  updatePost(input: $input) {
    body
    city {
      id
      name
    }
    createdAt
    id
    title
    userId
  }
}
`)

interface IMutationVariables {
  input: {
    body: string
    id: string
    cityId: string
    title: string
    userId: string
  }
}

interface IMutationResult {
  updatePost: IPost
}

interface IFormValues {
  body: string
  cityId: string
  title: string
}

interface IProps extends RouteComponentProps {
  id: string
}

export default function EditPost(props: RouteComponentProps) {
  const [{ cities, user }] = useAppState()
  if (!user || !cities) return <Redirect to="/" />
  const { id } = props as IProps
  const userId = user.id
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
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
              cityId: data.getPost.city.id,
              title: data.getPost.title,
            }}
            onSubmit={async ({ body, cityId, title }, { setSubmitting }) => {
              try {
                updatePost({
                  optimisticResponse: {
                    updatePost: {
                      __typename: 'Post',
                      body,
                      city: cities.find(({ id }) => id === cityId) as ICity,
                      createdAt: String(Date.now()),
                      id: String(
                        Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
                      ),
                      title,
                      userId,
                    },
                  },
                  variables: {
                    input: {
                      body,
                      cityId,
                      id,
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
                <Field name="cityId" validate={requiredValidator}>
                  {({ field, form }: FieldProps<IFormValues>) => (
                    <Select
                      {...field}
                      error={
                        form.submitCount &&
                        form.touched.cityId &&
                        form.errors.cityId
                      }
                      label="City"
                    >
                      <option hidden value="">
                        Select
                      </option>
                      {cities.map(({ id, name }) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </Select>
                  )}
                </Field>
                <Field name="body" validate={requiredValidator}>
                  {({ field, form }: FieldProps<IFormValues>) => (
                    <TextArea
                      {...field}
                      error={
                        form.submitCount &&
                        form.touched.body &&
                        form.errors.body
                      }
                      label="Body"
                      rows={10}
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
                  <Button
                    danger
                    disabled={isSubmitting}
                    onClick={() => setIsDialogOpen(!isDialogOpen)}
                    type="button"
                    variant="secondary"
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </Form>
            )}
          </Formik>
        )}
        <DeletePostDialog
          id={id}
          navigate={props.navigate as NavigateFn}
          onClose={() => setIsDialogOpen(false)}
          open={isDialogOpen}
          userId={userId}
        />
      </Paper>
    </PaperGroup>
  )
}
