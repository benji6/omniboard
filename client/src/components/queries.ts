import gql from 'graphql-tag'
import { IPost } from '../types'

export interface IGetPostQueryResult {
  getPost: Omit<IPost, 'userId'>
}

export const GET_POST = gql`
  query GetPost($id: ID!) {
    getPost(id: $id) {
      body
      city {
        id
        name
      }
      createdAt
      id
      title
    }
  }
`
