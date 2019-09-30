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
  const { data, error } = useQuery<IQueryResult>(QUERY)
  React.useEffect(() => {
    if (data) dispatch({ type: 'setCities', payload: data.cities })
    else if (error) dispatch({ type: 'setCities', payload: [] })
  }, [error, data, dispatch])
}
