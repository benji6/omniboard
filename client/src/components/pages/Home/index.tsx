import { useQuery } from '@apollo/react-hooks'
import { NavigateFn, RouteComponentProps } from '@reach/router'
import {
  Pagination,
  Paper,
  PaperGroup,
  Select,
  Spinner,
  TextField,
  Toggle,
} from 'eri'
import gql from 'graphql-tag'
import * as React from 'react'
import { useDebounce } from 'use-debounce'
import PostListItem from '../../PostListItem'
import { IPost } from '../../../types'
import { useAppState } from '../../AppStateContainer'

const RESULTS_PER_PAGE = 10

const SEARCH_POSTS = gql`
  query SearchPosts($input: SearchPostsInput!) {
    searchPosts(input: $input) {
      posts {
        body
        createdAt
        city {
          id
          name
        }
        id
        title
      }
      totalCount
    }
  }
`

interface ISearchPostsInput {
  body?: string
  cityId?: string
  title?: string
}

interface IQueryResult {
  searchPosts: { posts: (Omit<IPost, 'userId'>)[]; totalCount: number }
}

const DEBOUNCE_TIME = 300

const initialSearchParams = new URLSearchParams(location.search) // eslint-disable-line no-restricted-globals
const initialPage = Number(initialSearchParams.get('page'))
const initialSearchBody = initialSearchParams.get('body') || ''
const initialSearchCityId = initialSearchParams.get('cityId') || ''
const initialSearchTitle = initialSearchParams.get('title') || ''

const initialFilterValues = [initialSearchBody, initialSearchCityId]

export default function Home({ navigate }: RouteComponentProps) {
  const [appState] = useAppState()
  const cities = appState.cities!
  const [page, setPage] = React.useState(initialPage)
  const [filtersApplied, setFiltersApplied] = React.useState(
    initialFilterValues.some(Boolean),
  )
  const [searchBody, setSearchBody] = React.useState(initialSearchBody)
  const [searchCityId, setSearchCityId] = React.useState(initialSearchCityId)
  const [searchTitle, setSearchTitle] = React.useState(initialSearchTitle)

  const [debouncedPage] = useDebounce(page, DEBOUNCE_TIME)
  const [debouncedSearchBody] = useDebounce(searchBody, DEBOUNCE_TIME)
  const [debouncedSearchCityId] = useDebounce(searchCityId, DEBOUNCE_TIME)
  const [debouncedSearchTitle] = useDebounce(searchTitle, DEBOUNCE_TIME)

  React.useEffect(() => {
    const searchParams = new URLSearchParams()
    if (debouncedPage) searchParams.set('page', String(debouncedPage))
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
    debouncedPage,
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
    variables: {
      input: {
        ...searchPostsInput,
        limit: RESULTS_PER_PAGE,
        offset: page * RESULTS_PER_PAGE,
      },
    },
  })

  return (
    <PaperGroup noSlide>
      <Paper>
        <h2>Search</h2>
        <TextField
          label="Post title"
          onChange={e => {
            setPage(0)
            setSearchTitle(e.target.value)
          }}
          value={searchTitle}
        />
        {data && (
          <p e-util="center">
            <small>
              {data.searchPosts.totalCount} result
              {data.searchPosts.totalCount !== 1 && 's'}
            </small>
          </p>
        )}
      </Paper>
      <Paper side>
        <Toggle
          checked={filtersApplied}
          label="Toggle filters"
          onChange={() => {
            setPage(0)
            setFiltersApplied(!filtersApplied)
          }}
        />
        {filtersApplied && (
          <>
            <TextField
              label="Post body"
              supportiveText="Search for a phrase in the post body"
              onChange={e => {
                setPage(0)
                setSearchBody(e.target.value)
              }}
              value={searchBody}
            />
            <Select
              label="City"
              onChange={e => {
                setPage(0)
                setSearchCityId(e.target.value)
              }}
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
      ) : !data.searchPosts.totalCount ? (
        <Paper>
          <p e-util="center">No results found</p>
        </Paper>
      ) : (
        <>
          {data.searchPosts.posts.map(post => (
            <PostListItem
              key={post.id}
              onClick={() => (navigate as NavigateFn)(`/posts/${post.id}`)}
              post={post}
            />
          ))}
          <Pagination
            onChange={setPage}
            page={page}
            pageCount={Math.ceil(data.searchPosts.totalCount / 10)}
          />
        </>
      )}
    </PaperGroup>
  )
}
