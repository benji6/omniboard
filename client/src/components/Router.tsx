import { Router as ReachRouter } from '@reach/router'
import * as React from 'react'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import Home from './pages/Home'
import NotFound404 from './pages/NotFound404'
import Post from './pages/Post'
import ResendVerification from './pages/ResendVerification'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import MyPosts from './pages/MyPosts'
import Verify from './pages/Verify'

export default function Router() {
  return (
    <ReachRouter>
      <NotFound404 default />
      <Home path="/" />
      <CreatePost path="/posts/create" />
      <Post path="/posts/:id" />
      <EditPost path="/posts/:id/edit" />
      <ResendVerification path="/resend-verification" />
      <SignIn path="/sign-in" />
      <SignUp path="/sign-up" />
      <MyPosts path="/my-posts" />
      <Verify path="/verify" />
    </ReachRouter>
  )
}
