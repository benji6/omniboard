import gql from 'graphql-tag'
import { IPost } from '../types'

export interface IGetPostQueryResult {
  getPost: {
    body: IPost['body']
    id: IPost['id']
    location: IPost['location']
    title: IPost['title']
  }
}

export const GET_POST = gql(`query GetPost($id: ID!) {
  getPost(id: $id) {
    body
    id
    location
    title
  }
}
`)
