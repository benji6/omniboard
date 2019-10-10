import { gql } from 'apollo-server'

export default gql`
  input CreatePostInput {
    body: String!
    cityId: ID!
    title: String!
    userId: String!
  }

  input SearchPostsInput {
    body: String
    cityId: ID
    limit: Int
    offset: Int
    title: String
  }

  input UpdatePostInput {
    body: String!
    id: ID!
    cityId: ID!
    title: String!
    userId: String!
  }

  type City {
    id: ID!
    name: String!
  }

  type Post {
    body: String!
    city: City!
    createdAt: String!
    id: ID!
    title: String!
    userId: String!
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post!
    deletePost(id: ID!): Post!
    updatePost(input: UpdatePostInput!): Post!
  }

  type Query {
    cities: [City]!
    getPost(id: ID!): Post
    getPostsByUserId(userId: ID!): [Post]!
    searchPosts(input: SearchPostsInput!): [Post]!
  }
`
