import { NavigateFn } from '@reach/router'
import { Spinner, PaperGroup, Paper, Toggle, TextField } from 'eri'
import gql from 'graphql-tag'
import React from 'react'
import { useDebounce } from 'use-debounce'
import PostListItem from './PostListItem'
import { useQuery } from '@apollo/react-hooks'
import { IPost } from '../../../types'

const GET_POSTS = gql`
  {
    posts {
      body
      id
      location
      tags
      title
    }
  }
`

interface IQueryResult {
  posts: IPost[]
}

const DEBOUNCE_TIME = 300

const initialSearchParams = new URLSearchParams(location.search) // eslint-disable-line no-restricted-globals
const initialSearchBody = initialSearchParams.get('searchBody') || ''
const initialSearchLocation = initialSearchParams.get('searchLocation') || ''
const initialSearchTitle = initialSearchParams.get('searchTitle') || ''
const initialSearchType = initialSearchParams.get('searchType') || ''

const initialFilterValues = [
  initialSearchBody,
  initialSearchLocation,
  initialSearchType,
]

export default function Search({ navigate }: { navigate: NavigateFn }) {
  const [filtersApplied, setFiltersApplied] = React.useState(
    initialFilterValues.some(Boolean),
  )
  const [searchBody, setSearchBody] = React.useState(initialSearchBody)
  const [searchLocation, setSearchLocation] = React.useState(
    initialSearchLocation,
  )
  const [searchTitle, setSearchTitle] = React.useState(initialSearchTitle)
  const [searchType, setSearchType] = React.useState(initialSearchType)

  const [debouncedSearchBody] = useDebounce(searchBody, DEBOUNCE_TIME)
  const [debouncedSearchTitle] = useDebounce(searchTitle, DEBOUNCE_TIME)
  const [debouncedSearchType] = useDebounce(searchType, DEBOUNCE_TIME)
  const [debouncedSearchLocation] = useDebounce(searchLocation, DEBOUNCE_TIME)

  React.useEffect(() => {
    const searchParams = new URLSearchParams()
    if (filtersApplied) {
      if (debouncedSearchBody)
        searchParams.set('debouncedSearchBody', debouncedSearchBody)
      if (debouncedSearchLocation)
        searchParams.set('debouncedSearchLocation', debouncedSearchLocation)
      if (debouncedSearchType)
        searchParams.set('debouncedSearchType', debouncedSearchType)
    }
    if (debouncedSearchTitle)
      searchParams.set('debouncedSearchTitle', debouncedSearchTitle)
    navigate(`/${[...searchParams].length ? '?' + searchParams : ''}`, {
      replace: true,
    })
  } /* eslint-disable react-hooks/exhaustive-deps */, [
    debouncedSearchBody,
    debouncedSearchLocation,
    debouncedSearchTitle,
    debouncedSearchType,
    filtersApplied,
  ] /* eslint-enable react-hooks/exhaustive-deps */)

  let filter: any = {} // TODO

  if (filtersApplied) {
    if (debouncedSearchLocation)
      filter.location = { match: debouncedSearchLocation }
    if (debouncedSearchBody) filter.body = { matchPhrase: debouncedSearchBody }
    if (debouncedSearchType) filter.type = { match: debouncedSearchType }
  }
  if (debouncedSearchTitle) filter.title = { match: debouncedSearchTitle }

  const { data, error, loading } = useQuery<IQueryResult>(GET_POSTS)

  return (
    <PaperGroup>
      <Paper>
        <h2>Post list</h2>
        <TextField
          label="Post title"
          onChange={e => setSearchTitle(e.target.value)}
          value={searchTitle}
        />
      </Paper>
      <Paper side>
        <Toggle
          checked={filtersApplied}
          label="Toggle filters"
          onChange={() => setFiltersApplied(!filtersApplied)}
        />
        {filtersApplied && (
          <>
            <TextField
              label="Post body"
              supportiveText="Search for a phrase in the post body"
              onChange={e => setSearchBody(e.target.value)}
              value={searchBody}
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
          </>
        )}
      </Paper>
      {loading ? (
        <Spinner />
      ) : error || !data ? (
        <p>Something went wrong, please try again</p>
      ) : !data.posts.length ? (
        <Paper>
          <p e-util="center">No results found</p>
        </Paper>
      ) : (
        data.posts.map((post: IPost) => (
          <PostListItem
            key={post.id}
            onClick={() => navigate(`/posts/${post.id}`)}
            post={post}
          />
        ))
      )}
    </PaperGroup>
  )
}
