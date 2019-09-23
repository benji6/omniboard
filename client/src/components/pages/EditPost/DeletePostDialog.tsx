import { useMutation } from '@apollo/react-hooks'
import { NavigateFn } from '@reach/router'
import { Dialog, ButtonGroup, Button } from 'eri'
import gql from 'graphql-tag'
import * as React from 'react'
import { IPost } from '../../../types'
import { GET_POSTS_BY_USER_ID } from '../MyPosts'

const DELETE_POST = gql(`
mutation DeletePost($id: ID!) {
  deletePost(id: $id) {
    id
  }
}
`)

interface IMutationResult {
  deletePost: { __typename: 'Post'; id: string }
}

interface IProps {
  id: string
  navigate: NavigateFn
  onClose(): void
  open: boolean
  userId: string
}

export default function DeletePostDialog({
  id,
  navigate,
  onClose,
  open,
  userId,
}: IProps) {
  const [deletePost] = useMutation<IMutationResult, { id: string }>(
    DELETE_POST,
    {
      update(proxy, { data }) {
        if (!data) return
        let cachedData
        try {
          cachedData = proxy.readQuery<{
            getPostsByUserId?: IPost[]
          }>({
            query: GET_POSTS_BY_USER_ID,
            variables: { userId },
          })
        } catch {
          return
        }
        if (!cachedData || !cachedData.getPostsByUserId) return
        proxy.writeQuery({
          query: GET_POSTS_BY_USER_ID,
          variables: { userId },
          data: {
            getPostsByUserId: cachedData.getPostsByUserId.filter(
              post => post.id !== String(id),
            ),
          },
        })
      },
    },
  )
  const handleDelete = async () => {
    try {
      deletePost({
        optimisticResponse: {
          deletePost: {
            __typename: 'Post',
            id,
          },
        },
        variables: {
          id,
        },
      })
      navigate('/my-posts')
    } catch (e) {
      console.error('error: ', e)
    }
  }

  return (
    <Dialog onClose={onClose} open={open} title="Delete post?">
      <ButtonGroup>
        <Button danger onClick={handleDelete}>
          Delete
        </Button>
        <Button onClick={onClose} variant="secondary">
          Cancel
        </Button>
      </ButtonGroup>
    </Dialog>
  )
}
