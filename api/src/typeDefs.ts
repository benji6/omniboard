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

  input UpdatePostInput {
    body: String!
    id: ID!
    location: String!
    title: String!
    userId: String!
  }

  type Post {
    body: String!
    id: ID!
    location: String!
    title: String!
    userId: String!
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post!
    deletePost(id: ID!): Post!
    updatePost(input: UpdatePostInput!): Post!
  }

  type Query {
    getPost(id: ID!): Post
    getPostsByUserId(userId: ID!): [Post]!
    searchPosts(input: SearchPostsInput!): [Post]!
  }
`
