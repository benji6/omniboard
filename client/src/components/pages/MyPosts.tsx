import { useQuery } from '@apollo/react-hooks'
import { RouteComponentProps, Link, NavigateFn } from '@reach/router'
import { Spinner, Paper, PaperGroup } from 'eri'
import gql from 'graphql-tag'
import * as React from 'react'
import { useAppState, IUser } from '../AppStateContainer'
import useRedirectUnAuthed from '../../hooks/useRedirectUnAuthed'
import PostListItem from '../PostListItem'
import { IPost } from '../../types'

interface IQueryResult {
  getPostsByUserId: IPost[]
}

const GET_POSTS_BY_USER_ID = gql`
  query GetPostsByUserId($userId: ID!) {
    getPostsByUserId(userId: $userId) {
      body
      id
      location
      title
    }
  }
`

export default function MyPosts({ navigate }: RouteComponentProps) {
  useRedirectUnAuthed()
  const [{ user }] = useAppState()
  const { data, error, loading } = useQuery<IQueryResult>(
    GET_POSTS_BY_USER_ID,
    {
      variables: { userId: (user as IUser).id },
    },
  )

  return (
    <PaperGroup>
      <Paper>
        <h2>My posts</h2>
        <Link to="/posts/create">Create a new post</Link>
      </Paper>
      {loading ? (
        <Paper>
          <Spinner />
        </Paper>
      ) : error || !data ? (
        <p>Something went wrong, please try again</p>
      ) : (
        data.getPostsByUserId.map((post: IPost) => (
          <PostListItem
            key={post.id}
            onClick={() => (navigate as NavigateFn)(`/posts/${post.id}/edit`)}
            post={post}
          />
        ))
      )}
    </PaperGroup>
  )
}
