import { Button } from 'eri'
import * as faker from 'faker'
import gql from 'graphql-tag'
import * as React from 'react'
import jobDescriptions from './jobDescriptions'
import { createJob } from '../graphql/mutations'
import { useMutation } from '@apollo/react-hooks'
;(faker as any).locale = 'en_GB'

const integerBetween = (min: number, max: number): number =>
  Math.floor((max - min) * Math.random() + min)

const randomElement = function<A>(xs: Array<A>): A {
  return xs[Math.floor(Math.random() * xs.length)]
}

const generateJob = () => {
  const title = faker.name.jobTitle()
  return {
    description: randomElement(jobDescriptions),
    hourlyRate: integerBetween(7, 40),
    hoursPerWeek: integerBetween(5, 40),
    location: faker.fake('{{address.city}}, {{address.county}}'),
    numberOfDays: integerBetween(5, 250),
    pricingStructure: randomElement(['fixed', 'fixed with commission']),
    remote: Boolean(Math.round(Math.random())),
    title,
    type: faker.name.jobType(),
  }
}

const generateFakeJobs = (n: number) => {
  const jobs = []
  for (let i = 0; i < n; i++) jobs.push(generateJob())
  return jobs
}

export default function CreateFakeJobs({ n }: { n: number }) {
  const [create] = useMutation(gql(createJob))

  return (
    <Button
      onClick={() =>
        generateFakeJobs(n).forEach(input => create({ variables: { input } }))
      }
    >
      Click to create {n} fake job{n === 1 ? '' : 's'}
    </Button>
  )
}
