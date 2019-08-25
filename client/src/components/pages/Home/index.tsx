import { Link, RouteComponentProps, NavigateFn } from '@reach/router'
import { Spinner, PaperGroup, Paper } from 'eri'
import React from 'react'
import { useAppState } from '../../AppStateContainer'
import Search from './Search'

export default function Home({ navigate }: RouteComponentProps) {
  const [
    {
      loading: isAppStateLoading,
      user: { email: userEmail },
    },
  ] = useAppState()

  return isAppStateLoading ? (
    <Spinner />
  ) : userEmail ? (
    <Search navigate={navigate as NavigateFn} />
  ) : (
    <PaperGroup>
      <Paper>
        <h2>Welcome to Freelance Revolution!</h2>
        <p>
          Freelance Revolution is the place to come to for finding new
          opportunities. Whether you're a freelancer or an employer, we make it
          easy to find what you're looking for!
        </p>
        <br />
        <p e-util="center">
          <strong>
            <Link to="sign-up">Sign up now to get started!</Link>
          </strong>
        </p>
        <br />
        <p>
          <small>
            If you already have an account you can{' '}
            <Link to="sign-in">sign in here</Link>.
          </small>
        </p>
      </Paper>
    </PaperGroup>
  )
}
