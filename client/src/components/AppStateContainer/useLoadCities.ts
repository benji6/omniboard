import * as React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { ICity } from '../../types'
import { IAction } from '.'

const QUERY = gql`
  {
    cities {
      id
      name
    }
  }
`

interface IQueryResult {
  cities: ICity[]
}

export default function useLoadCities(dispatch: React.Dispatch<IAction>) {
  const { data, error, startPolling, stopPolling } = useQuery<IQueryResult>(
    QUERY,
  )
  React.useEffect(() => {
    if (data) {
      stopPolling()
      dispatch({ type: 'setCities', payload: data.cities })
    } else if (error) {
      startPolling(5000)
    }
  }, [data, error, dispatch, startPolling, stopPolling])
}
