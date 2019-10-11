import { RouteComponentProps, Redirect } from '@reach/router'
import { Paper, Spinner, PaperGroup } from 'eri'
import * as React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { GET_POST, IGetPostQueryResult } from '../queries'

interface IProps extends RouteComponentProps {
  id: string
}

export default function Post(props: RouteComponentProps) {
  const { id } = props as IProps
  const { data, error, loading } = useQuery<IGetPostQueryResult>(GET_POST, {
    variables: { id },
  })
  return (
    <PaperGroup>
      <Paper>
        {loading ? (
          <Spinner />
        ) : error || !data || !data.getPost ? (
          <p>Something went wrong, please try again</p>
        ) : (
          <>
            <h2>{data.getPost.title}</h2>

            <h3>Post body</h3>
            <p e-util="pre-line">{data.getPost.body}</p>
            <h3>Key information</h3>
            <ul>
              <li>City: {data.getPost.city.name}</li>
              <li>
                Date posted:{' '}
                {new Date(Number(data.getPost.createdAt)).toLocaleDateString()}
              </li>
            </ul>
          </>
        )}
      </Paper>
    </PaperGroup>
  )
}
