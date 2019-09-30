import { Button } from 'eri'
import * as faker from 'faker'
import * as React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { CREATE_POST } from '../components/pages/CreatePost'
import { useAppState } from '../components/AppStateContainer'
;(faker as any).locale = 'en_GB'

const integerBetween = (min: number, max: number): number =>
  Math.floor((max - min) * Math.random() + min)

const generatePost = (
  userId: string,
): {
  body: string
  cityId: string
  title: string
  userId: string
} => ({
  body: faker.lorem.paragraphs(),
  cityId: String(integerBetween(0, 69)),
  title: faker.lorem.words(),
  userId,
})

const generateFakePosts = (n: number, userId: string) => {
  const posts = []
  for (let i = 0; i < n; i++) posts.push(generatePost(userId))
  return posts
}

export default function CreateFakePosts({ n }: { n: number }) {
  const [create] = useMutation(CREATE_POST)
  const [{ userLoading, user }] = useAppState()
  if (userLoading) return null
  if (!user) throw Error('Must sign in')
  return (
    <Button
      onClick={() =>
        generateFakePosts(n, user.id).forEach(input =>
          create({ variables: { input } }),
        )
      }
    >
      Click to create {n} fake post{n === 1 ? '' : 's'}
    </Button>
  )
}
