import { RouteComponentProps } from '@reach/router'
import { Paper, Spinner, PaperGroup } from 'eri'
import gql from 'graphql-tag'
import * as React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { IPost } from '../../types'

const GET_POST = gql(`query GetPost($id: ID!) {
  getPost(id: $id) {
    body
    id
    location
    tags
    title
  }
}
`)

export const keysToIgnore = ['body', 'id', 'title', '__typename']

interface IQueryResult {
  getPost: IPost
}

interface IProps extends RouteComponentProps {
  id: string
}

export default function Post(props: RouteComponentProps) {
  const { id } = props as IProps
  const { data, error, loading } = useQuery<IQueryResult>(GET_POST, {
    variables: { id },
  })
  return (
    <PaperGroup>
      <Paper>
        {loading ? (
          <Spinner />
        ) : error || !data ? (
          <p>Something went wrong, please try again</p>
        ) : (
          <>
            <h2>{data.getPost.title}</h2>
            <h3>Post body</h3>
            <p e-util="pre-line">{data.getPost.body}</p>
            <h3>Key information</h3>
            <ul>
              {Object.entries(data.getPost)
                .filter(([key, val]) => {
                  if (keysToIgnore.includes(key)) return false
                  return val !== null
                })
                .map(([key, val]) => (
                  <li key={key}>
                    {key}: {String(val)}
                  </li>
                ))}
            </ul>
          </>
        )}
      </Paper>
    </PaperGroup>
  )
}
