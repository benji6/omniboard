import * as React from 'react'
import { Paper } from 'eri'
import { keysToIgnore } from '../Post'
import { IPost } from '../../../types'

interface IProps {
  onClick(): void
  post: IPost
}

export default function PostListItem({ post, ...rest }: IProps) {
  return (
    <Paper {...rest}>
      <h3>{post.title}</h3>
      <ul>
        {Object.entries(post)
          .filter(([key, val]) => {
            if (keysToIgnore.includes(key)) return false
            return val !== null
          })
          .map(([key, val]) => (
            <li key={key}>
              {key}: {Array.isArray(val) ? val.join(', ') : String(val)}
            </li>
          ))}
      </ul>
    </Paper>
  )
}
