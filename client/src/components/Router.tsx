import { Router as ReachRouter } from '@reach/router'
import * as React from 'react'
import CreatePost from './pages/CreatePost'
import Home from './pages/Home'
import Post from './pages/Post'
import NotFound404 from './pages/NotFound404'
import ResendVerification from './pages/ResendVerification'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Verify from './pages/Verify'

export default function Router() {
  return (
    <ReachRouter>
      <NotFound404 default />
      <Home path="/" />
      <CreatePost path="/posts/create" />
      <Post path="/posts/:id" />
      <ResendVerification path="/resend-verification" />
      <SignIn path="/sign-in" />
      <SignUp path="/sign-up" />
      <Verify path="/verify" />
    </ReachRouter>
  )
}
