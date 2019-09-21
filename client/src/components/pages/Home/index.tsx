import { useQuery } from '@apollo/react-hooks'
import { NavigateFn, RouteComponentProps } from '@reach/router'
import { Spinner, PaperGroup, Paper, Toggle, TextField } from 'eri'
import gql from 'graphql-tag'
import * as React from 'react'
import { useDebounce } from 'use-debounce'
import PostListItem from '../../PostListItem'
import { IPost } from '../../../types'

const SEARCH_POSTS = gql`
  query SearchPosts($input: SearchPostsInput!) {
    searchPosts(input: $input) {
      body
      id
      location
      title
    }
  }
`

interface ISearchPostsInput {
  body?: string
  location?: string
  title?: string
}

interface IQueryResult {
  searchPosts: IPost[]
}

const DEBOUNCE_TIME = 300

const initialSearchParams = new URLSearchParams(location.search) // eslint-disable-line no-restricted-globals
const initialSearchBody = initialSearchParams.get('body') || ''
const initialSearchLocation = initialSearchParams.get('location') || ''
const initialSearchTitle = initialSearchParams.get('title') || ''

const initialFilterValues = [initialSearchBody, initialSearchLocation]

export default function Home({ navigate }: RouteComponentProps) {
  const [filtersApplied, setFiltersApplied] = React.useState(
    initialFilterValues.some(Boolean),
  )
  const [searchBody, setSearchBody] = React.useState(initialSearchBody)
  const [searchLocation, setSearchLocation] = React.useState(
    initialSearchLocation,
  )
  const [searchTitle, setSearchTitle] = React.useState(initialSearchTitle)

  const [debouncedSearchBody] = useDebounce(searchBody, DEBOUNCE_TIME)
  const [debouncedSearchTitle] = useDebounce(searchTitle, DEBOUNCE_TIME)
  const [debouncedSearchLocation] = useDebounce(searchLocation, DEBOUNCE_TIME)

  React.useEffect(() => {
    const searchParams = new URLSearchParams()
    if (filtersApplied) {
      if (debouncedSearchBody) searchParams.set('body', debouncedSearchBody)
      if (debouncedSearchLocation)
        searchParams.set('location', debouncedSearchLocation)
    }
    if (debouncedSearchTitle) searchParams.set('title', debouncedSearchTitle)
    ;(navigate as NavigateFn)(
      `/${[...searchParams].length ? '?' + searchParams : ''}`,
      {
        replace: true,
      },
    )
  } /* eslint-disable react-hooks/exhaustive-deps */, [
    debouncedSearchBody,
    debouncedSearchLocation,
    debouncedSearchTitle,
    filtersApplied,
  ] /* eslint-enable react-hooks/exhaustive-deps */)

  let searchPostsInput: ISearchPostsInput = {}

  if (debouncedSearchTitle) searchPostsInput.title = debouncedSearchTitle
  if (filtersApplied) {
    if (debouncedSearchBody) searchPostsInput.body = debouncedSearchBody
    if (debouncedSearchLocation)
      searchPostsInput.location = debouncedSearchLocation
  }

  const { data, error, loading } = useQuery<IQueryResult>(SEARCH_POSTS, {
    variables: { input: searchPostsInput },
  })

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
              label="Location"
              onChange={e => setSearchLocation(e.target.value)}
              value={searchLocation}
            />
          </>
        )}
      </Paper>
      {loading ? (
        <Paper>
          <Spinner />
        </Paper>
      ) : error || !data ? (
        <p>Something went wrong, please try again</p>
      ) : !data.searchPosts.length ? (
        <Paper>
          <p e-util="center">No results found</p>
        </Paper>
      ) : (
        data.searchPosts.map((post: IPost) => (
          <PostListItem
            key={post.id}
            onClick={() => (navigate as NavigateFn)(`/posts/${post.id}`)}
            post={post}
          />
        ))
      )}
    </PaperGroup>
  )
}
