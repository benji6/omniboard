import Auth from '@aws-amplify/auth'
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync'
import { Paper, PaperGroup } from 'eri'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import awsconfig from '../aws-exports'
import JobList from './JobList'
import CreateJob from './CreateJob'
import SignIn from './SignIn'
import SignUp from './SignUp'

Auth.configure(awsconfig)

const client = new AWSAppSyncClient({
  auth: {
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    jwtToken: async () =>
      (await Auth.currentSession()).getIdToken().getJwtToken(),
  },
  region: awsconfig.aws_appsync_region,
  url: awsconfig.aws_appsync_graphqlEndpoint,
})

export default function App() {
  return (
    <ApolloProvider client={client}>
      <header>
        <div>
          <h1>
            <a href="/">Freelance Revolution</a>
          </h1>
        </div>
      </header>
      <main>
        <PaperGroup>
          <Paper>
            <JobList />
          </Paper>
          <Paper>
            <CreateJob />
          </Paper>
          <Paper>
            <SignIn />
          </Paper>
          <Paper>
            <SignUp />
          </Paper>
        </PaperGroup>
      </main>
    </ApolloProvider>
  )
}
