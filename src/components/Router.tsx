import { Router as ReachRouter } from '@reach/router'
import * as React from 'react'
import CreateJob from './pages/CreateJob'
import Home from './pages/Home'
import Job from './pages/Job'
import NotFound404 from './pages/NotFound404'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'

export default function Router() {
  return (
    <ReachRouter>
      <NotFound404 default />
      <Home path="/" />
      <CreateJob path="jobs/create" />
      <Job path="jobs/:id" />
      <SignIn path="sign-in" />
      <SignUp path="sign-up" />
    </ReachRouter>
  )
}
