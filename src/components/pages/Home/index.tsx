import { RouteComponentProps, NavigateFn } from '@reach/router'
import {
  Spinner,
  PaperGroup,
  Paper,
  Toggle,
  RadioButtonGroup,
  RadioButton,
  TextField,
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

const initialSearchParams = new URLSearchParams(location.search) // eslint-disable-line no-restricted-globals
const initialSearchText = initialSearchParams.get('searchText') || ''
let initialRemoteValue: undefined | boolean

const initialRemoteString = initialSearchParams.get('remote')

if (initialRemoteString) {
  try {
    const remote = JSON.parse(initialRemoteString)
    if (typeof remote === 'boolean') initialRemoteValue = remote
  } catch {}
}

export default function Home({ navigate }: RouteComponentProps) {
  const [filtersApplied, setFiltersApplied] = React.useState(
    initialRemoteValue !== undefined,
  )
  const [remoteValue, setRemoteValue] = React.useState(initialRemoteValue)
  const [searchText, setSearchText] = React.useState(initialSearchText)

  React.useEffect(() => {
    const searchParams = new URLSearchParams()
    if (filtersApplied && remoteValue !== undefined)
      searchParams.set('remote', String(remoteValue))
    if (searchText) searchParams.set('searchText', searchText)
    ;(navigate as NavigateFn)(
      `/${[...searchParams].length ? '?' + searchParams : ''}`,
      {
        replace: true,
      },
    )
  }, [filtersApplied, remoteValue, searchText]) // eslint-disable-line react-hooks/exhaustive-deps

  let filter: ModelJobFilterInput = {}

  if (filtersApplied && remoteValue !== undefined)
    filter.remote = { eq: remoteValue }
  if (searchText) filter.title = { contains: searchText }

  const variables = Object.keys(filter).length ? { filter } : undefined

  return (
    <PaperGroup>
      <Paper>
        <h2>Job list</h2>
        <TextField
          label="Search"
          onChange={e => setSearchText(e.target.value)}
          value={searchText}
        />
      </Paper>
      <Paper>
        <Toggle
          checked={filtersApplied}
          label="Toggle filters"
          onChange={() => setFiltersApplied(!filtersApplied)}
        />
        {filtersApplied && (
          <RadioButtonGroup label="Remote">
            <RadioButton
              checked={remoteValue === undefined}
              name="remote"
              onChange={() => setRemoteValue(undefined)}
            >
              Off
            </RadioButton>
            <RadioButton
              checked={remoteValue === true}
              name="remote"
              onChange={() => setRemoteValue(true)}
            >
              Remote
            </RadioButton>
            <RadioButton
              checked={remoteValue === false}
              name="remote"
              onChange={() => setRemoteValue(false)}
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
