import { gql } from 'apollo-server'

export default gql`
  input CreatePostInput {
    body: String!
    location: String!
    title: String!
    userId: String!
  }

  input SearchPostsInput {
    body: String
    location: String
    title: String
  }

  type Post {
    body: String!
    id: ID!
    location: String!
    title: String!
    userId: String!
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post
  }

  type Query {
    getPost(id: ID!): Post
    searchPosts(input: SearchPostsInput!): [Post]
  }
`
