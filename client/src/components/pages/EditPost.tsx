import * as React from 'react'
import { RouteComponentProps } from '@reach/router'
import { PaperGroup, Paper } from 'eri'

interface IProps extends RouteComponentProps {
  id?: string
}

export default function EditPost({ id }: IProps) {
  return (
    <PaperGroup>
      <Paper>
        <h2>Edit post</h2>
        <div>Post ID: {id}</div>
      </Paper>
    </PaperGroup>
  )
}
