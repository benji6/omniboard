import * as React from 'react'
import { Paper } from 'eri'

interface IProps {
  description: string
  numberOfDays: number | null
  hourlyRate: number | null
  hoursPerWeek: string | null
  id: string
  location: string
  pricingStructure: string | null
  remote: boolean | null
  title: string
  type: string
}

const keysToIgnore = ['description', 'id', 'title', '__typename']

export default function Job(job: IProps) {
  return (
    <Paper>
      <h3>{job.title}</h3>
      <p>{job.description}</p>
      <ul>
        {Object.entries(job)
          .filter(([key, val]) => {
            if (keysToIgnore.includes(key)) return false
            return val !== null
          })
          .map(([key, val]) => (
            <li key={key}>
              {key}: {val}
            </li>
          ))}
      </ul>
    </Paper>
  )
}
