import { RouteComponentProps, NavigateFn } from '@reach/router'
import { Spinner, PaperGroup, Paper } from 'eri'
import gql from 'graphql-tag'
import React from 'react'
import { Query } from 'react-apollo'
import { listJobs } from '../../../graphql/queries'
import {
  ListJobsQueryVariables,
  ListJobsQuery,
  ModelJobFilterInput,
} from '../../../API'
import JobListItem from './JobListItem'

export default function Home({ location, navigate }: RouteComponentProps) {
  let filter: ModelJobFilterInput = {}

  if (location) {
    const searchParams = new URLSearchParams(location.search)
    const remoteValue = searchParams.get('remote')
    if (remoteValue) {
      try {
        const remote = JSON.parse(remoteValue)
        if (typeof remote === 'boolean') filter.remote = { eq: remote }
      } catch {}
    }
  }

  const variables = Object.keys(filter).length ? { filter } : undefined

  return (
    <PaperGroup>
      <Paper>
        <h2>Job list</h2>
      </Paper>
      <Query<ListJobsQuery, ListJobsQueryVariables>
        query={gql(listJobs)}
        variables={variables}
      >
        {({ data, error, loading }) => {
          if (loading) return <Spinner />
          if (error || !data || !data.listJobs || !data.listJobs.items)
            return <p>Something went wrong, please try again</p>
          return data.listJobs.items.map((job: any) => (
            <JobListItem
              job={job}
              key={job.id}
              onClick={() => (navigate as NavigateFn)(`/jobs/${job.id}`)}
            />
          ))
        }}
      </Query>
    </PaperGroup>
  )
}
