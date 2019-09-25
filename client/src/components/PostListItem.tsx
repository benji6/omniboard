import * as React from 'react'
import { Paper } from 'eri'
import { IPost } from '../types'

interface IProps {
  onClick(): void
  post: IPost
}

export default function PostListItem({ post, ...rest }: IProps) {
  return (
    <Paper {...rest}>
      <h3>{post.title}</h3>
      <ul>
        <li>Location: {post.location}</li>
        <li>
          Date posted: {new Date(Number(post.createdAt)).toLocaleDateString()}
        </li>
      </ul>
    </Paper>
  )
}
