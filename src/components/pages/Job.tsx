import { RouteComponentProps } from '@reach/router'
import { Paper, Spinner, PaperGroup } from 'eri'
import gql from 'graphql-tag'
import * as React from 'react'
import { Query } from 'react-apollo'
import { getJob } from '../../graphql/queries'
import { GetJobQuery, GetJobQueryVariables } from '../../API'

export const keysToIgnore = ['description', 'id', 'title', '__typename']

interface IProps extends RouteComponentProps {
  id: string
}

export default function Job(props: RouteComponentProps) {
  const { id } = props as IProps
  return (
    <PaperGroup>
      <Paper>
        <Query<GetJobQuery, GetJobQueryVariables>
          query={gql(getJob)}
          variables={{ id }}
        >
          {({ data, error, loading }) => {
            if (loading) return <Spinner />
            if (error || !data || !data.getJob)
              return <p>Something went wrong, please try again</p>

            return (
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
            )
          }}
        </Query>
      </Paper>
    </PaperGroup>
  )
}
