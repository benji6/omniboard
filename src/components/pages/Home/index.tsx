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
import { useDebounce } from 'use-debounce'
import { searchJobs } from '../../../graphql/queries'
import {
  SearchableJobFilterInput,
  SearchJobsQuery,
  SearchJobsQueryVariables,
} from '../../../API'
import JobListItem from './JobListItem'

const DEBOUNCE_TIME = 300

const initialSearchParams = new URLSearchParams(location.search) // eslint-disable-line no-restricted-globals
const initialSearchDescription =
  initialSearchParams.get('searchDescription') || ''
const initialSearchLocation = initialSearchParams.get('searchLocation') || ''
const initialSearchTitle = initialSearchParams.get('searchTitle') || ''
const initialSearchType = initialSearchParams.get('searchType') || ''
let initialRemoteValue: undefined | boolean

const initialFilterValues = [
  initialRemoteValue,
  initialSearchDescription,
  initialSearchLocation,
  initialSearchType,
]

const initialRemoteString = initialSearchParams.get('remote')

if (initialRemoteString) {
  try {
    const remote = JSON.parse(initialRemoteString)
    if (typeof remote === 'boolean') initialRemoteValue = remote
  } catch {}
}

export default function Home({ navigate }: RouteComponentProps) {
  const [filtersApplied, setFiltersApplied] = React.useState(
    initialFilterValues.some(Boolean),
  )
  const [remoteValue, setRemoteValue] = React.useState(initialRemoteValue)
  const [searchDescription, setSearchDescription] = React.useState(
    initialSearchDescription,
  )
  const [searchLocation, setSearchLocation] = React.useState(
    initialSearchLocation,
  )
  const [searchTitle, setSearchTitle] = React.useState(initialSearchTitle)
  const [searchType, setSearchType] = React.useState(initialSearchType)

  const [debouncedSearchDescription] = useDebounce(
    searchDescription,
    DEBOUNCE_TIME,
  )
  const [debouncedSearchTitle] = useDebounce(searchTitle, DEBOUNCE_TIME)
  const [debouncedSearchType] = useDebounce(searchType, DEBOUNCE_TIME)
  const [debouncedSearchLocation] = useDebounce(searchLocation, DEBOUNCE_TIME)

  React.useEffect(() => {
    const searchParams = new URLSearchParams()
    if (filtersApplied) {
      if (remoteValue !== undefined)
        searchParams.set('remote', String(remoteValue))
      if (debouncedSearchDescription)
        searchParams.set(
          'debouncedSearchDescription',
          debouncedSearchDescription,
        )
      if (debouncedSearchLocation)
        searchParams.set('debouncedSearchLocation', debouncedSearchLocation)
      if (debouncedSearchType)
        searchParams.set('debouncedSearchType', debouncedSearchType)
    }
    if (debouncedSearchTitle)
      searchParams.set('debouncedSearchTitle', debouncedSearchTitle)
    ;(navigate as NavigateFn)(
      `/${[...searchParams].length ? '?' + searchParams : ''}`,
      { replace: true },
    )
  } /* eslint-disable react-hooks/exhaustive-deps */, [
    debouncedSearchDescription,
    debouncedSearchLocation,
    debouncedSearchTitle,
    debouncedSearchType,
    filtersApplied,
    remoteValue,
  ] /* eslint-enable react-hooks/exhaustive-deps */)

  let filter: SearchableJobFilterInput = {}

  if (filtersApplied) {
    if (remoteValue !== undefined) filter.remote = { eq: remoteValue }
    if (debouncedSearchLocation)
      filter.location = { match: debouncedSearchLocation }
    if (debouncedSearchDescription)
      filter.description = { matchPhrase: debouncedSearchDescription }
    if (debouncedSearchType) filter.type = { match: debouncedSearchType }
  }
  if (debouncedSearchTitle) filter.title = { match: debouncedSearchTitle }

  const variables = Object.keys(filter).length ? { filter } : undefined

  return (
    <PaperGroup>
      <Paper>
        <h2>Job list</h2>
        <TextField
          label="Job title"
          onChange={e => setSearchTitle(e.target.value)}
          value={searchTitle}
        />
      </Paper>
      <Paper>
        <Toggle
          checked={filtersApplied}
          label="Toggle filters"
          onChange={() => setFiltersApplied(!filtersApplied)}
        />
        {filtersApplied && (
          <>
            <TextField
              label="Job description"
              supportiveText="Search for a phrase in the job description"
              onChange={e => setSearchDescription(e.target.value)}
              value={searchDescription}
            />
            <TextField
              label="Type"
              onChange={e => setSearchType(e.target.value)}
              value={searchType}
            />
            <TextField
              label="Location"
              onChange={e => setSearchLocation(e.target.value)}
              value={searchLocation}
            />
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
          </>
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
