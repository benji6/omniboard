import { useQuery } from '@apollo/react-hooks'
import { NavigateFn, RouteComponentProps } from '@reach/router'
import { Spinner, PaperGroup, Paper, Toggle, TextField, Select } from 'eri'
import gql from 'graphql-tag'
import * as React from 'react'
import { useDebounce } from 'use-debounce'
import PostListItem from '../../PostListItem'
import { IPost } from '../../../types'
import { useAppState } from '../../AppStateContainer'

const SEARCH_POSTS = gql`
  query SearchPosts($input: SearchPostsInput!) {
    searchPosts(input: $input) {
      body
      createdAt
      city {
        id
        name
      }
      id
      title
    }
  }
`

interface ISearchPostsInput {
  body?: string
  cityId?: string
  title?: string
}

interface IQueryResult {
  searchPosts: (Omit<IPost, 'userId'>)[]
}

const DEBOUNCE_TIME = 300

const initialSearchParams = new URLSearchParams(location.search) // eslint-disable-line no-restricted-globals
const initialSearchBody = initialSearchParams.get('body') || ''
const initialSearchCityId = initialSearchParams.get('cityId') || ''
const initialSearchTitle = initialSearchParams.get('title') || ''

const initialFilterValues = [initialSearchBody, initialSearchCityId]

export default function Home({ navigate }: RouteComponentProps) {
  const [appState] = useAppState()
  const cities = appState.cities!
  const [filtersApplied, setFiltersApplied] = React.useState(
    initialFilterValues.some(Boolean),
  )
  const [searchBody, setSearchBody] = React.useState(initialSearchBody)
  const [searchCityId, setSearchCityId] = React.useState(initialSearchCityId)
  const [searchTitle, setSearchTitle] = React.useState(initialSearchTitle)

  const [debouncedSearchBody] = useDebounce(searchBody, DEBOUNCE_TIME)
  const [debouncedSearchTitle] = useDebounce(searchTitle, DEBOUNCE_TIME)
  const [debouncedSearchCityId] = useDebounce(searchCityId, DEBOUNCE_TIME)

  React.useEffect(() => {
    const searchParams = new URLSearchParams()
    if (filtersApplied) {
      if (debouncedSearchBody) searchParams.set('body', debouncedSearchBody)
      if (debouncedSearchCityId)
        searchParams.set('cityId', debouncedSearchCityId)
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
    debouncedSearchCityId,
    debouncedSearchTitle,
    filtersApplied,
  ] /* eslint-enable react-hooks/exhaustive-deps */)

  let searchPostsInput: ISearchPostsInput = {}

  if (debouncedSearchTitle) searchPostsInput.title = debouncedSearchTitle
  if (filtersApplied) {
    if (debouncedSearchBody) searchPostsInput.body = debouncedSearchBody
    if (debouncedSearchCityId) searchPostsInput.cityId = debouncedSearchCityId
  }

  const { data, error, loading } = useQuery<IQueryResult>(SEARCH_POSTS, {
    fetchPolicy: 'network-only',
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
            <Select
              label="City"
              onChange={e => setSearchCityId(e.target.value)}
              value={searchCityId}
            >
              {[
                <option key="" value="">
                  Select
                </option>,
                ...cities.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                )),
              ]}
            </Select>
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
        data.searchPosts.map(post => (
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
