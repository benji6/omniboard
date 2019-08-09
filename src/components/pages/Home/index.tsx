import { RouteComponentProps, NavigateFn, WindowLocation } from '@reach/router'
import {
  Spinner,
  PaperGroup,
  Paper,
  Toggle,
  RadioButtonGroup,
  RadioButton,
} from 'eri'
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

type TRemoteFilter = '' | 'true' | 'false'

export default function Home({ location, navigate }: RouteComponentProps) {
  let searchParams = new URLSearchParams((location as WindowLocation).search)
  const remoteValue = searchParams.get('remote')
  const [filtersApplied, setFiltersApplied] = React.useState(
    Boolean(remoteValue),
  )
  const [remoteFilter, setRemoteFilter] = React.useState<TRemoteFilter>(
    remoteValue && ['false', 'true', ''].includes(remoteValue)
      ? (remoteValue as TRemoteFilter)
      : '',
  )

  React.useEffect(() => {
    if (!filtersApplied) searchParams = new URLSearchParams()
    else if (remoteFilter) searchParams.set('remote', remoteFilter)
    else searchParams.delete('remote')
    ;(navigate as NavigateFn)(
      `/${[...searchParams].length ? '?' + searchParams : ''}`,
      {
        replace: true,
      },
    )
  }, [filtersApplied, remoteFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  let filter: ModelJobFilterInput = {}
  if (remoteValue) {
    try {
      const remote = JSON.parse(remoteValue)
      if (typeof remote === 'boolean') filter.remote = { eq: remote }
    } catch {}
  }

  const variables = Object.keys(filter).length ? { filter } : undefined

  return (
    <PaperGroup>
      <Paper>
        <h2>Job list</h2>
        <Toggle
          checked={filtersApplied}
          label="Toggle filters"
          onChange={() => setFiltersApplied(!filtersApplied)}
        />
        {filtersApplied && (
          <RadioButtonGroup label="Remote">
            <RadioButton
              checked={remoteFilter === ''}
              name="remote"
              onChange={() => setRemoteFilter('')}
            >
              Off
            </RadioButton>
            <RadioButton
              checked={remoteFilter === 'true'}
              name="remote"
              onChange={() => setRemoteFilter('true')}
            >
              Remote
            </RadioButton>
            <RadioButton
              checked={remoteFilter === 'false'}
              name="remote"
              onChange={() => setRemoteFilter('false')}
            >
              Not remote
            </RadioButton>
          </RadioButtonGroup>
        )}
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
