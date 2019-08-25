import { RouteComponentProps } from '@reach/router'
import { Paper, Spinner, PaperGroup } from 'eri'
import gql from 'graphql-tag'
import * as React from 'react'
import { getJob } from '../../graphql/queries'
import { useQuery } from '@apollo/react-hooks'

export const keysToIgnore = ['description', 'id', 'title', '__typename']

interface IProps extends RouteComponentProps {
  id: string
}

export default function Job(props: RouteComponentProps) {
  const { id } = props as IProps
  const { data, error, loading } = useQuery(gql(getJob), { variables: { id } })
  return (
    <PaperGroup>
      <Paper>
        {loading ? (
          <Spinner />
        ) : error || !data || !data.getJob ? (
          <p>Something went wrong, please try again</p>
        ) : (
          <>
            <h2>{data.getJob.title}</h2>
            <h3>Job description</h3>
            <p e-util="pre-line">{data.getJob.description}</p>
            <h3>Key information</h3>
            <ul>
              {Object.entries(data.getJob)
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
