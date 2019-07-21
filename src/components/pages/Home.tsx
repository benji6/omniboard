import { RouteComponentProps } from '@reach/router'
import { Spinner, PaperGroup, Paper } from 'eri'
import gql from 'graphql-tag'
import React from 'react'
import { Query } from 'react-apollo'
import { listJobs } from '../../graphql/queries'
import { ListJobsQueryVariables, ListJobsQuery } from '../../API'

export default function Home(_: RouteComponentProps) {
  return (
    <PaperGroup>
      <Paper>
        <h2>Job list</h2>
        <Query<ListJobsQuery, ListJobsQueryVariables> query={gql(listJobs)}>
          {({ data, error, loading }) => {
            if (loading) return <Spinner />
            if (error || !data || !data.listJobs || !data.listJobs.items)
              return <p>Something went wrong, please try again</p>
            return data.listJobs.items.map((job: any) => (
              <div key={job.id}>{JSON.stringify(job)}</div>
            ))
          }}
        </Query>
      </Paper>
    </PaperGroup>
  )
}
