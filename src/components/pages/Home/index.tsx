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
import { searchJobs } from '../../../graphql/queries'
import {
  SearchableJobFilterInput,
  SearchJobsQuery,
  SearchJobsQueryVariables,
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

  let filter: SearchableJobFilterInput = {}

  if (filtersApplied && remoteValue !== undefined)
    filter.remote = { eq: remoteValue }
  if (searchText) filter.title = { match: searchText }

  const variables = Object.keys(filter).length ? { filter } : undefined

  return (
    <PaperGroup>
      <Paper>
        <h2>Job list</h2>
        <TextField
          label="Job title"
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
      <Query<SearchJobsQuery, SearchJobsQueryVariables>
        query={gql(searchJobs)}
        variables={variables}
      >
        {({ data, error, loading }) => {
          if (loading) return <Spinner />
          if (error || !data || !data.searchJobs || !data.searchJobs.items)
            return <p>Something went wrong, please try again</p>
          if (!data.searchJobs.items.length)
            return (
              <Paper>
                <p e-util="center">No results found</p>
              </Paper>
            )
          return data.searchJobs.items.map((job: any) => (
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
