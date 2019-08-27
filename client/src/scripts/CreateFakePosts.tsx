import { Button } from 'eri'
import * as faker from 'faker'
import * as React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { CREATE_POST } from '../components/pages/CreatePost'
;(faker as any).locale = 'en_GB'

const integerBetween = (min: number, max: number): number =>
  Math.floor((max - min) * Math.random() + min)

const generatePost = (): {
  body: string
  location: string
  tags: string[]
  title: string
} => ({
  body: faker.lorem.paragraphs(),
  location: faker.fake('{{address.city}}, {{address.county}}'),
  tags: [...Array(integerBetween(0, 5)).keys()].map(() => faker.lorem.word()),
  title: faker.lorem.words(),
})

const generateFakePosts = (n: number) => {
  const posts = []
  for (let i = 0; i < n; i++) posts.push(generatePost())
  return posts
}

export default function CreateFakePosts({ n }: { n: number }) {
  const [create] = useMutation(CREATE_POST)

  return (
    <Button
      onClick={() =>
        generateFakePosts(n).forEach(input => create({ variables: { input } }))
      }
    >
      Click to create {n} fake post{n === 1 ? '' : 's'}
    </Button>
  )
}
