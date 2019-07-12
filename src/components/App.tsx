import { Paper, PaperGroup } from 'eri'
import React from 'react'
import awsconfig from '../aws-exports'
import JobList from './JobList'
import { ApolloProvider } from 'react-apollo'
import AWSAppSyncClient from 'aws-appsync'
import CreateJob from './CreateJob'

const client = new AWSAppSyncClient({
  auth: {
    apiKey: awsconfig.aws_appsync_apiKey,
    type: awsconfig.aws_appsync_authenticationType as any,
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
            <a href="/">Freelance revolution</a>
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
        </PaperGroup>
      </main>
    </ApolloProvider>
  )
}
