import * as React from 'react'
import { Paper } from 'eri'
import { ICity, IPost } from '../types'

interface IProps {
  onClick(): void
  post: Omit<IPost, 'userId'>
}

export default function PostListItem({ post, ...rest }: IProps) {
  return (
    <Paper {...rest}>
      <h3>{post.title}</h3>
      <ul>
        <li>City: {post.city.name}</li>
        <li>
          Date posted: {new Date(Number(post.createdAt)).toLocaleDateString()}
        </li>
      </ul>
    </Paper>
  )
}
